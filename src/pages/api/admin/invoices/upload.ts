import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";
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

function buildInvoiceEmail(clientName: string, label: string, isRegistered: boolean, contactEmail: string): string {
  const ctaUrl = isRegistered
    ? "https://soundbeyondborders.com/dashboard"
    : "https://soundbeyondborders.com/register";
  const ctaLabel = isRegistered ? "View in Dashboard →" : "Create Your Account →";
  const bodyText = isRegistered
    ? `Your ${label.toLowerCase()} has been uploaded and is available for download in your client dashboard.`
    : `Your ${label.toLowerCase()} has been uploaded and is waiting for you — but first you'll need to create a free account on our client portal. Once registered, you'll be able to view and download it directly from your dashboard.`;

  return `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #111111; color: #F5F1E8; border: 1px solid #C2A45F;">
      <h2 style="color: #C2A45F; margin: 0 0 16px; font-size: 22px;">Your ${label.toLowerCase()} is ready</h2>
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
    const formData = await request.formData();
    const submissionId = formData.get("submission_id");
    const file = formData.get("file") as File | null;
    const label = (formData.get("label") as string | null) || "Invoice";

    if (!submissionId || !file) {
      return json(400, { error: "Missing submission_id or file" });
    }
    if (file.type !== "application/pdf") {
      return json(400, { error: "Only PDF files are allowed" });
    }
    if (file.size > 10 * 1024 * 1024) {
      return json(400, { error: "File too large (max 10MB)" });
    }

    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would upload invoice for submission:", submissionId, "label:", label);
      return json(200, { success: true, message: "Dev mode: invoice upload skipped", invoiceId: 999 });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Fetch submission + check registration status in one query
    const submissions = await sql`
      SELECT
        cs.id,
        cs.email,
        COALESCE(cs.first_name, split_part(cs.name, ' ', 1), 'there') AS first_name,
        u.id AS user_id
      FROM contact_submissions cs
      LEFT JOIN users u ON cs.email = u.email
      WHERE cs.id = ${submissionId}
    `;

    if (submissions.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    const submission = submissions[0];
    const isRegistered = !!submission.user_id;

    // Check for duplicate label (one per type per booking)
    const existing = await sql`
      SELECT id FROM invoices
      WHERE submission_id = ${submissionId} AND label = ${label}
    `;

    if (existing.length > 0) {
      return json(409, {
        error: `A ${label} already exists for this booking. Delete it first or choose a different document type.`,
      });
    }

    // Upload to Vercel Blob
    const blob = await put(
      `invoices/${submissionId}-${Date.now()}.pdf`,
      Buffer.from(await file.arrayBuffer()),
      { access: "public" }
    );

    // Insert invoice record
    const result = await sql`
      INSERT INTO invoices (submission_id, file_url, label)
      VALUES (${submissionId}, ${blob.url}, ${label})
      RETURNING id
    `;

    // Auto-advance status to "Invoice Sent" (only if not already further along)
    await sql`
      UPDATE contact_submissions
      SET status = 'Invoice Sent'
      WHERE id = ${submissionId}
      AND status IN ('Pending', 'Reviewing', 'Contract Sent', 'Contract Signed')
    `;

    // Send client notification email (non-fatal)
    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const contactEmail = import.meta.env.CONTACT_EMAIL;
      await resend.emails.send({
        from: "Tradscendence <noreply@soundbeyondborders.com>",
        replyTo: contactEmail,
        to: submission.email,
        subject: `Your ${label.toLowerCase()} is ready — Tradscendence`,
        html: buildInvoiceEmail(submission.first_name, label, isRegistered, contactEmail),
      });
    } catch (emailErr) {
      console.error("Invoice notification email failed (non-fatal):", emailErr);
    }

    return json(200, { success: true, invoiceId: result[0].id, fileUrl: blob.url, label });
  } catch (error) {
    console.error("Invoice upload error:", error);
    return json(500, { error: "Failed to upload invoice" });
  }
};