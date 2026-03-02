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

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("x-admin-key") !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { error: "Content-Type must be application/json" });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const {
    id,
    submission_id,
    title,
    event_date,
    location,
    reflection,
    photo_urls,
    video_src,
    display_order,
    visible,
  } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return json(400, { error: "Title is required" });
  }

  // Normalise photo_urls — accept newline-separated string OR array
  let photoUrlsArray: string[] = [];
  if (Array.isArray(photo_urls)) {
    photoUrlsArray = (photo_urls as string[]).map((s) => s.trim()).filter(Boolean);
  } else if (typeof photo_urls === "string") {
    photoUrlsArray = photo_urls
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const subId   = submission_id ? Number(submission_id) : null;
  const evDate  = event_date && typeof event_date === "string" ? event_date : null;
  const locVal  = location   && typeof location   === "string" ? location.trim()   : null;
  const reflVal = reflection && typeof reflection === "string" ? reflection.trim() : null;
  const vidVal  = video_src  && typeof video_src  === "string" ? video_src.trim()  : null;
  const dispOrd = display_order !== undefined ? Number(display_order) : 0;
  const isVis   = visible !== undefined ? Boolean(visible) : true;

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    if (id) {
      // ── Update existing ──────────────────────────────
      const result = await sql`
        UPDATE memories SET
          submission_id = ${subId},
          title         = ${title.trim()},
          event_date    = ${evDate},
          location      = ${locVal},
          reflection    = ${reflVal},
          photo_urls    = ${photoUrlsArray},
          video_src     = ${vidVal},
          display_order = ${dispOrd},
          visible       = ${isVis}
        WHERE id = ${Number(id)}
        RETURNING id
      `;
      if (result.length === 0) return json(404, { error: "Memory not found" });
      return json(200, { ok: true, action: "updated", id: Number(id) });
    } else {
      // ── Create new ───────────────────────────────────
      const [row] = await sql`
        INSERT INTO memories
          (submission_id, title, event_date, location, reflection, photo_urls, video_src, display_order, visible)
        VALUES
          (${subId}, ${title.trim()}, ${evDate}, ${locVal}, ${reflVal}, ${photoUrlsArray}, ${vidVal}, ${dispOrd}, ${isVis})
        RETURNING id
      `;
      return json(201, { ok: true, action: "created", id: row.id });
    }
  } catch (err) {
    console.error("Failed to save memory:", err);
    return json(500, { error: "Failed to save memory" });
  }
};