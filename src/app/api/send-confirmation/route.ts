import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { confirmationEmailHtml, type ConfirmationPerson } from "@/lib/email-templates";

// Sends the RSVP confirmation email. Deliberately separate from the RPC
// calls in src/app/rsvp/page.tsx, which write straight to Supabase from the
// browser — sending mail needs a secret API key, so it has to happen
// server-side, in a route the browser calls after the RSVP itself is saved.
// The actual email markup lives in src/lib/email-templates.ts.

type ConfirmationPayload = {
  email: string;
  party: ConfirmationPerson[];
  busPickup: string;
  message?: string | null;
};

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

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  // The RSVP is already written to Supabase by the time the browser calls
  // this route (see handleSubmit in src/app/rsvp/page.tsx), so a missing
  // key here should never look like the RSVP itself failed — it just means
  // no confirmation email goes out this time. Respond 200 either way; the
  // page ignores this response.
  if (!apiKey) {
    return NextResponse.json({ sent: false, reason: "not_configured" });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, party, busPickup, message } = body;

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Nicole & Alex <rsvp@mail.nicoleandalexwedding.com>";
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      // The email tells guests not to reply (the sending address isn't a
      // real inbox) and points them to Alex's email/mobile instead — this
      // is just a safety net so a reply sent anyway still lands somewhere
      // real rather than disappearing.
      replyTo: process.env.RESEND_REPLY_TO || "alex.cann@outlook.com",
      subject: "RSVP confirmed — Nicole & Alex, 11 March 2027",
      html: confirmationEmailHtml({ party, busPickup, message }),
    });
    if (error) throw error;
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Failed to send RSVP confirmation email:", err);
    return NextResponse.json({ sent: false, error: "send_failed" });
  }
}
