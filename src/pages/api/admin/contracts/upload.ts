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

function buildContractEmail(clientName: string, isRegistered: boolean, contactEmail: string): string {
  const ctaUrl = isRegistered
    ? "https://soundbeyondborders.com/dashboard"
    : "https://soundbeyondborders.com/register";
  const ctaLabel = isRegistered ? "View &amp; Sign Contract →" : "Create Your Account →";
  const bodyText = isRegistered
    ? "Your booking contract has been uploaded and is ready for your review and signature. Please log in to your dashboard to view and sign the document at your earliest convenience."
    : "Your booking contract has been uploaded and is waiting for you — but first you'll need to create a free account on our client portal. Once registered, you'll be able to view, review, and sign your contract directly from your dashboard.";

  return `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #111111; color: #F5F1E8; border: 1px solid #C2A45F;">
      <h2 style="color: #C2A45F; margin: 0 0 16px; font-size: 22px;">Your contract is ready</h2>
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
      console.log("[DEV] Would upload contract for submission:", submissionId);
      return json(200, { success: true, message: "Dev mode: contract upload skipped", contractId: 999 });
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

    // Upload to Vercel Blob
    const blob = await put(`contracts/${submissionId}-${Date.now()}.pdf`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Insert contract record
    const result = await sql`
      INSERT INTO contracts (submission_id, file_url)
      VALUES (${submissionId}, ${blob.url})
      RETURNING id
    `;

    // Auto-advance status to "Contract Sent" (only if not already further along)
    await sql`
      UPDATE contact_submissions
      SET status = 'Contract Sent'
      WHERE id = ${submissionId}
      AND status IN ('Pending', 'Reviewing')
    `;

    // Send client notification email (non-fatal)
    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const contactEmail = import.meta.env.CONTACT_EMAIL;
      await resend.emails.send({
        from: "Tradscendence <noreply@soundbeyondborders.com>",
        replyTo: contactEmail,
        to: submission.email,
        subject: "Your contract is ready — Tradscendence",
        html: buildContractEmail(submission.first_name, isRegistered, contactEmail),
      });
    } catch (emailErr) {
      console.error("Contract notification email failed (non-fatal):", emailErr);
    }

    return json(200, { success: true, contractId: result[0].id, fileUrl: blob.url });
  } catch (error) {
    console.error("Contract upload error:", error);
    return json(500, { error: "Failed to upload contract" });
  }
};