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
  if (request.headers.get("x-admin-key") !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    const rows = await sql`
      SELECT
        m.id,
        m.submission_id,
        m.title,
        m.event_date,
        m.location,
        m.reflection,
        m.photo_urls,
        m.video_src,
        m.display_order,
        m.visible,
        m.created_at,
        CASE
          WHEN cs.id IS NOT NULL THEN
            CONCAT(
              COALESCE(
                NULLIF(TRIM(COALESCE(cs.first_name, '') || ' ' || COALESCE(cs.last_name, '')), ''),
                cs.name
              ),
              CASE WHEN cs.event_date IS NOT NULL
                THEN ' · ' || TO_CHAR(cs.event_date, 'Mon DD, YYYY')
                ELSE ''
              END,
              CASE WHEN cs.location IS NOT NULL
                THEN ' · ' || cs.location
                ELSE ''
              END
            )
          ELSE NULL
        END AS linked_submission_label
      FROM memories m
      LEFT JOIN contact_submissions cs ON m.submission_id = cs.id
      ORDER BY m.event_date DESC NULLS LAST, m.display_order ASC, m.created_at DESC
    `;

    return json(200, { memories: rows });
  } catch (err) {
    console.error("Failed to load memories:", err);
    return json(500, { error: "Failed to load memories" });
  }
};