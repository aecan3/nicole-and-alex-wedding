import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { confirmationEmailHtml, confirmationEmailText, type ConfirmationPerson } from "@/lib/email-templates";

// Sends the RSVP confirmation email. Deliberately separate from the RPC
// calls in src/components/sections/rsvp-section.tsx, which write straight to
// Supabase from the browser — sending mail needs a secret API key, so it has
// to happen server-side, in a route the browser calls after the RSVP itself
// is saved. The actual email markup lives in src/lib/email-templates.ts.

type ConfirmationPayload = {
  email: string;
  party: ConfirmationPerson[];
  busPickup: string;
  message?: string | null;
  updated?: boolean;
  // Lets us record in Supabase whether the email went out
  inviteeId?: string;
  postcode?: string;
};

// Saves 'sent' or 'failed' against the household. Best effort: never throws.
async function recordConfirmation(body: ConfirmationPayload, status: "sent" | "failed") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !body.inviteeId || !body.postcode) return;
  try {
    const { error } = await createClient(url, key).rpc("record_confirmation", {
      invitee_id: body.inviteeId,
      p_postcode: body.postcode,
      p_status: status,
    });
    if (error) console.error("Couldn't record confirmation status:", error);
  } catch (err) {
    console.error("Couldn't record confirmation status:", err);
  }
}

function isValidPayload(body: unknown): body is ConfirmationPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.email === "string" &&
    b.email.includes("@") &&
    Array.isArray(b.party) &&
    b.party.every(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof (p as Record<string, unknown>).name === "string" &&
        typeof (p as Record<string, unknown>).attending === "boolean"
    ) &&
    typeof b.busPickup === "string"
  );
}

// Replies and copies go to both of us
const COUPLE = ["alex.cann@outlook.com", "nicole.c.fernando@gmail.com"];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // The RSVP is already saved by the time this runs, so nothing here ever
  // affects what the guest sees. Every outcome is recorded in Supabase.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    await recordConfirmation(body, "failed");
    return NextResponse.json({ sent: false, reason: "not_configured" });
  }

  const { email, party, busPickup, message, updated } = body;

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Nicole & Alex <rsvp@mail.nicoleandalexwedding.com>";
    const isUpdate = updated === true;
    const content = { party, busPickup, message, updated: isUpdate };

    // 1. The guest's email: only their address, replies come to both of us
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      replyTo: COUPLE,
      subject: `${isUpdate ? "RSVP updated" : "RSVP confirmed"}: Nicole & Alex, 11 March 2027`,
      html: confirmationEmailHtml(content),
      text: confirmationEmailText(content),
    });
    if (error) throw error;
    await recordConfirmation(body, "sent");

    // 2. Our own copy, sent separately and addressed to us (not BCC, which Outlook tends to junk).
    // The guest's address is never on this one, and replying to it goes to the guest.
    const names = party.map((p) => p.name).join(", ");
    const copyNote = `Copy of the ${isUpdate ? "updated " : ""}RSVP from ${names} (sent to ${email})`;
    // Wrapped on its own so a failed copy never marks the guest's email as failed
    try {
      const copy = await resend.emails.send({
        from: fromAddress,
        to: COUPLE,
        replyTo: email,
        subject: `${isUpdate ? "Updated RSVP" : "New RSVP"}: ${names}`,
        html: confirmationEmailHtml({ ...content, copyNote }),
        text: confirmationEmailText({ ...content, copyNote }),
      });
      if (copy.error) console.error("Guest email sent, but our copy failed:", copy.error);
    } catch (copyErr) {
      console.error("Guest email sent, but our copy failed:", copyErr);
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Failed to send RSVP confirmation email:", err);
    await recordConfirmation(body, "failed");
    return NextResponse.json({ sent: false, error: "send_failed" });
  }
}
