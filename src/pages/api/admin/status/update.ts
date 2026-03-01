import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

const VALID_STATUSES = [
  "Pending",
  "Reviewing",
  "Contract Sent",
  "Contract Signed",
  "Invoice Sent",
  "Payment Received",
  "Complete",
  "Declined",
] as const;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const PATCH: APIRoute = async ({ request }) => {
  // Auth check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  let body: { submission_id: number; status: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { submission_id, status } = body;

  if (!submission_id || typeof submission_id !== "number") {
    return json(400, { error: "submission_id is required" });
  }

  if (!status || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return json(400, { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  // Dev mode guard
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, submission_id, status });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const result = await sql`
      UPDATE contact_submissions
      SET status = ${status}
      WHERE id = ${submission_id}
      RETURNING id, status
    `;

    if (result.length === 0) {
      return json(404, { error: "Submission not found" });
    }

    return json(200, { ok: true, submission_id: result[0].id, status: result[0].status });
  } catch (error) {
    console.error("Failed to update status:", error);
    return json(500, { error: "Failed to update status" });
  }
};