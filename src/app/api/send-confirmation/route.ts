import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Sends the RSVP confirmation email. Deliberately separate from the RPC
// calls in src/app/rsvp/page.tsx, which write straight to Supabase from the
// browser — sending mail needs a secret API key, so it has to happen
// server-side, in a route the browser calls after the RSVP itself is saved.

type PartyMemberResponse = {
  name: string;
  attending: boolean;
  dietary?: string | null;
};

type ConfirmationPayload = {
  email: string;
  party: PartyMemberResponse[];
  busPickup: string;
  message?: string | null;
};

const BUS_LABELS: Record<string, string> = {
  macedon_ranges_hotel_spa: "Pick up from Macedon Ranges Hotel & Spa",
  black_forest_motel: "Pick up from Black Forest Motel",
  gisborne_motel: "Pick up from Gisborne Motel",
  no: "Making their own way there",
  not_booked_yet: "Bus needed — accommodation not booked yet",
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

  const attendingLines = party
    .map((p) => {
      const status = p.attending ? "Joyfully attending" : "Regretfully declines";
      const dietary = p.attending && p.dietary ? ` (${escapeHtml(p.dietary)})` : "";
      return `${escapeHtml(p.name)} — ${status}${dietary}`;
    })
    .join("<br />");

  const busLine = BUS_LABELS[busPickup] ?? "No bus preference recorded";

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #4a1f26; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #7a3540; margin: 0 0 8px;">Nicole &amp; Alex &middot; 11 March 2027</p>
      <h1 style="font-size: 24px; margin: 0 0 24px;">RSVP received</h1>
      <p style="line-height: 1.6;">Thanks so much for letting us know — we can&rsquo;t wait to celebrate with you at Alora Macedon, New Gisborne.</p>
      <p style="margin-top: 24px; line-height: 1.6;"><strong>Your responses</strong><br />${attendingLines}</p>
      <p style="margin-top: 16px; line-height: 1.6;"><strong>Bus pickup</strong><br />${busLine}</p>
      ${message ? `<p style="margin-top: 16px; line-height: 1.6;"><strong>Your message to us</strong><br />${escapeHtml(message)}</p>` : ""}
      <p style="margin-top: 32px; font-size: 13px; color: #7a3540;">Something not right? Reply to this email, or reach Alex on 0423 340 677.</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Nicole & Alex <rsvp@mail.nicoleandalexwedding.com>";
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "RSVP confirmed — Nicole & Alex, 11 March 2027",
      html,
    });
    if (error) throw error;
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Failed to send RSVP confirmation email:", err);
    return NextResponse.json({ sent: false, error: "send_failed" });
  }
}
