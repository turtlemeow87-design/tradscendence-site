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

    if (!submissionId || !file) {
      return json(400, { error: "Missing submission_id or file" });
    }

    if (file.type !== "application/pdf") {
      return json(400, { error: "Only PDF files are allowed" });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return json(400, { error: "File too large (max 10MB)" });
    }

    // Dev mode guard
    if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
      console.log("[DEV] Would upload contract for submission:", submissionId);
      return json(200, {
        success: true,
        message: "Dev mode: contract upload skipped",
        contractId: 999,
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

    return json(200, {
      success: true,
      contractId: result[0].id,
      fileUrl: blob.url,
    });
  } catch (error) {
    console.error("Contract upload error:", error);
    return json(500, { error: "Failed to upload contract" });
  }
};