// Confirmation email HTML, styled to match the site (see globals.css for the
// same colour tokens, and page-header.tsx / hero.tsx for the same kicker +
// gold-divider layout language). Email clients don't load next/font's
// Playfair Display / Cormorant Garamond, so headings fall back to a
// Georgia-based serif stack that reads similarly rather than relying on a
// web font that most inboxes will silently drop anyway.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nicoleandalexwedding.com";

const BUS_LABELS: Record<string, string> = {
  macedon_ranges_hotel_spa: "Pick up from Macedon Ranges Hotel & Spa",
  black_forest_motel: "Pick up from Black Forest Motel",
  gisborne_motel: "Pick up from Gisborne Motel",
  no: "Making their own way there",
  not_booked_yet: "Shuttle needed — accommodation not booked yet",
};

export function busLabel(value: string): string {
  return BUS_LABELS[value] ?? "No bus preference recorded";
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ConfirmationPerson = {
  name: string;
  attending: boolean;
  dietary?: string | null;
};

export function confirmationEmailHtml(params: {
  party: ConfirmationPerson[];
  busPickup: string;
  message?: string | null;
}): string {
  const { party, busPickup, message } = params;

  // Site fonts, with the stacks email clients actually have. Bickham (the
  // script face used for headings on the site) can't be webfonted reliably,
  // so the names are the hosted lettering image instead.
  const body = "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', Times, serif";
  const display = "'Playfair Display', Georgia, 'Times New Roman', Times, serif";

  const peopleRows = party
    .map((p) => {
      const statusLabel = p.attending ? "Joyfully attending" : "Regretfully declines";
      const statusColor = p.attending ? "#7a3540" : "#8c7361";
      const dietary = p.attending && p.dietary ? ` &middot; ${escapeHtml(p.dietary)}` : "";
      return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="border:1px solid #e3d3b2; border-radius:8px; padding:14px 18px;">
              <p style="margin:0; font-family:${body}; font-size:16px; color:#4a1521;">${escapeHtml(p.name)}</p>
              <p style="margin:4px 0 0; font-family:${body}; font-size:13px; color:${statusColor};">${statusLabel}${dietary}</p>
            </td>
          </tr>
        </table>`;
    })
    .join("");

  // Only shown when they actually asked for a seat — "no" and a blank answer
  // leave the row out entirely.
  const shuttleBlock = busPickup && busPickup !== "no"
    ? `
        <tr>
          <td style="padding: 22px 40px 0;">
            <p style="margin:0 0 6px; font-family:${body}; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8c7361;">Shuttle</p>
            <p style="margin:0; font-family:${body}; font-size:15px; color:#7a3540;">${busLabel(busPickup)}</p>
          </td>
        </tr>`
    : "";

  const messageBlock = message
    ? `
        <tr>
          <td style="padding: 28px 40px 0;">
            <p style="margin:0 0 6px; font-family:${body}; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8c7361;">Your message to us</p>
            <p style="margin:0; font-family:${serif}; font-size:17px; line-height:1.6; color:#7a3540; font-style:italic;">&ldquo;${escapeHtml(message)}&rdquo;</p>
          </td>
        </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RSVP Confirmed</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Playfair+Display:wght@400&family=Inter:wght@400;500&display=swap" />
    <!--[if mso]>
    <style>* { font-family: Georgia, 'Times New Roman', serif !important; }</style>
    <![endif]-->
  </head>
  <body style="margin:0; padding:0; background-color:#ece0cc;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ece0cc;">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#faf6ee; border:1px solid #e3d3b2; border-radius:6px;">
            <tr>
              <td style="padding: 48px 40px 0; text-align:center;">
                <img src="${SITE_URL}/brand/nicole-and-alex-burgundy.png" alt="Nicole &amp; Alex" width="196" style="display:block; margin:0 auto 14px; width:196px; max-width:58%; height:auto;" />
                <p style="margin:0 0 12px; font-family:${body}; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#8c7361;">
                  Thursday 11 March 2027
                </p>
                <h1 style="margin:0; font-family:${display}; font-size:30px; font-weight:400; color:#7a3540; letter-spacing:0.5px;">
                  RSVP Confirmed
                </h1>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px auto 0;">
                  <tr><td style="width:80px; height:1px; background-color:#c9a876; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 40px 0; text-align:center;">
                <p style="margin:0; font-family:${serif}; font-size:18px; line-height:1.7; color:#7a3540; font-style:italic;">
                  Thank you for letting us know! Your response has been warmly&nbsp;received.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 40px 0;">
                <p style="margin:0 0 14px; font-family:${body}; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8c7361;">Your responses</p>
                ${peopleRows}
              </td>
            </tr>
${shuttleBlock}
            ${messageBlock}
            <tr>
              <td style="padding: 36px 40px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr><td style="border-top:1px solid #e3d3b2; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 40px 4px; text-align:center;">
                <a href="${SITE_URL}" style="display:inline-block; background-color:#8c7361; color:#faf6ee; font-family:${body}; font-size:11px; letter-spacing:3px; text-transform:uppercase; text-decoration:none; padding:14px 34px; border-radius:999px;">
                  Visit the Website
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 40px 40px; text-align:center;">
                <a href="${SITE_URL}/#rsvp" style="font-family:${body}; font-size:13px; color:#8c7361; text-decoration:underline;">
                  Need to update your RSVP?
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 40px; text-align:center; border-top:1px solid #e3d3b2;">
                <img src="${SITE_URL}/brand/monogram-burgundy.png" alt="" width="54" style="display:block; margin:26px auto 0; width:54px; height:auto;" />
                <p style="margin:16px 0 0; font-family:${body}; font-size:12px; color:#8c7361;">
                  Please do not reply to this email. For any questions, contact Alex at
                  <a href="mailto:alex.cann@outlook.com" style="color:#8c7361;">alex.cann@outlook.com</a>
                  or 0423 340 677.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
