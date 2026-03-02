import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json(401, { error: "You must be logged in to leave a review" });

  let body: { submission_id?: unknown; reviewBody?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const submissionId = Number(body.submission_id);
  const reviewBody = typeof body.reviewBody === "string" ? body.reviewBody.trim() : "";

  if (!submissionId || isNaN(submissionId)) {
    return json(400, { error: "submission_id is required" });
  }
  if (!reviewBody || reviewBody.length < 10) {
    return json(400, { error: "Review must be at least 10 characters" });
  }
  if (reviewBody.length > 1000) {
    return json(400, { error: "Review must be 1000 characters or fewer" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, message: "Review submitted (dev mode)" });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    // Verify this submission belongs to this user AND is Complete
    const [sub] = await sql`
      SELECT id, status
      FROM contact_submissions
      WHERE id = ${submissionId}
        AND email = ${user.email}
    `;

    if (!sub) {
      return json(404, { error: "Booking not found" });
    }
    if (sub.status !== "Complete") {
      return json(403, { error: "Reviews can only be submitted for completed bookings" });
    }

    // Insert — UNIQUE constraint on submission_id handles duplicates
    await sql`
      INSERT INTO reviews (submission_id, user_id, body)
      VALUES (${submissionId}, ${user.id}, ${reviewBody})
    `;

    return json(200, { ok: true, message: "Thank you — your review has been submitted for approval." });
  } catch (err: any) {
    // Unique violation = already reviewed
    if (err?.message?.includes("unique") || err?.code === "23505") {
      return json(409, { error: "You have already submitted a review for this booking" });
    }
    console.error("Failed to submit review:", err);
    return json(500, { error: "Failed to submit review" });
  }
};