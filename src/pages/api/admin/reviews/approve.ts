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

export const PATCH: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Session expired — please refresh and re-enter your admin key" });
  }

  let body: { review_id?: unknown; approved?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const reviewId = Number(body.review_id);
  const approved = body.approved === true;

  if (!reviewId || isNaN(reviewId)) {
    return json(400, { error: "review_id is required" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const result = await sql`
      UPDATE reviews
      SET approved = ${approved}
      WHERE id = ${reviewId}
      RETURNING id
    `;

    if (result.length === 0) {
      return json(404, { error: "Review not found" });
    }

    return json(200, { ok: true, approved });
  } catch (err) {
    console.error("Failed to update review:", err);
    return json(500, { error: "Failed to update review" });
  }
};