import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function buildReminderBlock(
  clientName: string,
  heading: string,
  bodyText: string,
  ctaLabel: string,
  ctaUrl: string,
  contactEmail: string
): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #111111; color: #F5F1E8; border: 1px solid #C2A45F;">
      <h2 style="color: #C2A45F; margin: 0 0 16px; font-size: 22px;">${heading}</h2>
      <p style="margin: 0 0 16px; line-height: 1.6;">Hi ${clientName},</p>
      <p style="margin: 0 0 24px; line-height: 1.6; color: #d4cfc4;">${bodyText}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${ctaUrl}" style="display: inline-block; padding: 14px 32px; background: #C2A45F; color: #111111; text-decoration: none; font-weight: bold; font-family: Georgia, serif; letter-spacing: 0.5px;">
          ${ctaLabel}
        </a>
      </div>
      <p style="margin: 24px 0 0; line-height: 1.6; color: #aaa; font-size: 13px;">
        Have questions or concerns?
        <a href="mailto:${contactEmail}" style="color: #C2A45F;">Send me a message directly</a>.
      </p>
      <hr style="border: none; border-top: 1px solid #C2A45F33; margin: 32px 0;" />
      <p style="color: #888; font-size: 12px; margin: 0;">Tradscendence · soundbeyondborders.com</p>
    </div>
  `;
}

export const POST: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  try {
    const body = await request.json();
    const { submission_id } = body;

    if (!submission_id) {
      return json(400, { error: "Missing submission_id" });
    }

    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would send reminder for submission:", submission_id);
      return json(200, { success: true, message: "Dev mode: reminder skipped" });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Fetch submission + registration status + contract state in one query
    const submissions = await sql`
      SELECT
        cs.id,
        cs.email,
        cs.status,
        COALESCE(cs.first_name, split_part(cs.name, ' ', 1), 'there') AS first_name,
        u.id AS user_id,
        c.id AS contract_id,
        c.signed_at AS contract_signed_at
      FROM contact_submissions cs
      LEFT JOIN users u ON cs.email = u.email
      LEFT JOIN contracts c ON cs.id = c.submission_id
      WHERE cs.id = ${submission_id}
    `;

    if (submissions.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    const sub = submissions[0];
    const isRegistered = !!sub.user_id;

    // Fetch uploaded invoices for this submission
    const invoices = await sql`
      SELECT id, label FROM invoices
      WHERE submission_id = ${submission_id}
      ORDER BY uploaded_at ASC
    `;

    const contactEmail = import.meta.env.CONTACT_EMAIL;
    const clientName = sub.first_name;

    const hasUnsignedContract = !!sub.contract_id && !sub.contract_signed_at;
    const hasInvoices = invoices.length > 0;
    const invoiceLabels = invoices.map((i: any) => i.label.toLowerCase()).join(" and ");
    const invoicePlural = invoices.length > 1 ? "are" : "is";

    // ── Build context-aware email ────────────────────────

    let subject: string;
    let bodyHtml: string;

    if (!isRegistered) {
      subject = "Action needed: register to access your booking documents — Tradscendence";
      bodyHtml = buildReminderBlock(
        clientName,
        "Register to access your documents",
        "I've uploaded booking documents to your client portal, but you'll need to create a free account before you can access them. It only takes a moment to set up.",
        "Create Your Account →",
        "https://soundbeyondborders.com/register",
        contactEmail
      );
    } else if (hasUnsignedContract && hasInvoices) {
      subject = "Reminder: your contract and documents are waiting — Tradscendence";
      bodyHtml = buildReminderBlock(
        clientName,
        "A couple of things need your attention",
        `Just a friendly reminder that your booking contract is still waiting for your signature, and your ${invoiceLabels} ${invoicePlural} also available for review. You can take care of both from your dashboard.`,
        "Go to Your Dashboard →",
        "https://soundbeyondborders.com/dashboard",
        contactEmail
      );
    } else if (hasUnsignedContract) {
      subject = "Reminder: your contract is waiting for your signature — Tradscendence";
      bodyHtml = buildReminderBlock(
        clientName,
        "Your contract is still waiting",
        "Just a friendly reminder that your booking contract is ready and waiting for your signature. Please log in to your dashboard whenever you get a chance.",
        "Sign Your Contract →",
        "https://soundbeyondborders.com/dashboard",
        contactEmail
      );
    } else if (hasInvoices) {
      subject = `Reminder: your ${invoiceLabels} ${invoicePlural} ready — Tradscendence`;
      bodyHtml = buildReminderBlock(
        clientName,
        `Your ${invoiceLabels} ${invoicePlural} available`,
        `Just a friendly reminder that your ${invoiceLabels} ${invoicePlural} available in your client dashboard.`,
        "View in Dashboard →",
        "https://soundbeyondborders.com/dashboard",
        contactEmail
      );
    } else {
      // Fallback: no specific pending items, send a general check-in
      subject = "A note about your booking — Tradscendence";
      bodyHtml = buildReminderBlock(
        clientName,
        "Checking in about your booking",
        "Just reaching out to check in on your booking. If you have any questions or would like to discuss next steps, feel free to reply directly or visit your dashboard.",
        "Go to Your Dashboard →",
        "https://soundbeyondborders.com/dashboard",
        contactEmail
      );
    }

    // Send the email
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Tradscendence <noreply@soundbeyondborders.com>",
      replyTo: contactEmail,
      to: sub.email,
      subject,
      html: bodyHtml,
    });

    // Stamp last_reminded_at on the submission
    await sql`
      UPDATE contact_submissions
      SET last_reminded_at = NOW()
      WHERE id = ${submission_id}
    `;

    return json(200, { success: true, lastRemindedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Remind error:", error);
    return json(500, { error: "Failed to send reminder" });
  }
};