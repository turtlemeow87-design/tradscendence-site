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

export const GET: APIRoute = async ({ request }) => {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, {
      reviews: [
        {
          id: 1,
          body: "Hunter played beautifully at our wedding — truly unforgettable.",
          approved: false,
          created_at: new Date().toISOString(),
          reviewer_name: "Jane D.",
          submission_location: "Richmond, VA",
        },
      ],
    });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const reviews = await sql`
      SELECT
        r.id,
        r.body,
        r.approved,
        r.created_at,
        cs.location  AS submission_location,
        -- Display name: preferred_name first, else first initial + last name
        COALESCE(
          u.preferred_name,
          CONCAT(LEFT(u.first_name, 1), '. ', u.last_name)
        ) AS reviewer_name
      FROM reviews r
      JOIN contact_submissions cs ON r.submission_id = cs.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.approved ASC, r.created_at DESC
    `;

    return json(200, { reviews });
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    return json(500, { error: "Failed to fetch reviews" });
  }
};