import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";
import { del } from "@vercel/blob";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const DELETE: APIRoute = async ({ request }) => {
  // Auth check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  let body: { submission_id: number };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { submission_id } = body;

  if (!submission_id || typeof submission_id !== "number") {
    return json(400, { error: "submission_id is required" });
  }

  // Dev mode guard
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    console.log("[DEV] Would delete submission:", submission_id);
    return json(200, { ok: true });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    // Verify submission exists
    const submission = await sql`
      SELECT id FROM contact_submissions WHERE id = ${submission_id}
    `;
    if (submission.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    // Gather Blob URLs before deleting DB records so we can clean up storage
    const [contractRows, invoiceRows] = await Promise.all([
      sql`SELECT file_url FROM contracts WHERE submission_id = ${submission_id}`,
      sql`SELECT file_url FROM invoices WHERE submission_id = ${submission_id}`,
    ]);

    const blobUrls = [
      ...contractRows.map(r => r.file_url),
      ...invoiceRows.map(r => r.file_url),
    ].filter(Boolean);

    // Delete child records first, then submission
    await sql`DELETE FROM contracts WHERE submission_id = ${submission_id}`;
    await sql`DELETE FROM invoices WHERE submission_id = ${submission_id}`;
    await sql`DELETE FROM contact_submissions WHERE id = ${submission_id}`;

    // Clean up Blob storage — non-fatal if it fails
    if (blobUrls.length > 0) {
      try {
        await Promise.all(blobUrls.map(url => del(url)));
      } catch (blobErr) {
        console.error("[Delete] Blob cleanup failed (DB already cleaned):", blobErr);
      }
    }

    return json(200, { ok: true });
  } catch (error) {
    console.error("Failed to delete submission:", error);
    return json(500, { error: "Failed to delete submission" });
  }
};