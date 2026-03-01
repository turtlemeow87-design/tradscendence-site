import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // Auth check
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

    // Dev mode guard
    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would upload invoice for submission:", submissionId, "label:", label);
      return json(200, {
        success: true,
        message: "Dev mode: invoice upload skipped",
        invoiceId: 999,
      });
    }

    const sql = neon(import.meta.env.DATABASE_URL);

    // Verify submission exists
    const submission = await sql`
      SELECT id FROM contact_submissions WHERE id = ${submissionId}
    `;

    if (submission.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    // Check for duplicate label on this submission (enforce one per type)
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

    return json(200, {
      success: true,
      invoiceId: result[0].id,
      fileUrl: blob.url,
      label,
    });
  } catch (error) {
    console.error("Invoice upload error:", error);
    return json(500, { error: "Failed to upload invoice" });
  }
};