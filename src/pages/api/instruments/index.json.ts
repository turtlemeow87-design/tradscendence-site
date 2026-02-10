import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

function json(status: number, body: Record<string, unknown> | unknown[]) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// GET /api/instruments — public listing
export const GET: APIRoute = async () => {
  try {
    const sql = neon(import.meta.env.DATABASE_URL);
    const rows = await sql`
      SELECT slug, name, origin_prefix, audio_teaser, page_ready,
             display_order, featured, featured_image, image_url, tagline
      FROM instruments
      ORDER BY display_order ASC
    `;
    return json(200, rows);
  } catch (err) {
    console.error("GET /api/instruments error:", err);
    return json(500, { error: "Failed to fetch instruments." });
  }
};

// POST /api/instruments — admin: add new instrument
export const POST: APIRoute = async ({ request }) => {
  // Auth check
  const key = request.headers.get("x-admin-key");
  if (key !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized." });
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON." });
  }

  const { slug, name } = payload;
  if (!slug || !name) {
    return json(400, { error: "slug and name are required." });
  }

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    // Insert instrument
    const result = await sql`
      INSERT INTO instruments (
        slug, name, origin_prefix, tagline, seo_title, seo_description,
        about_html, moods_intro, image_url, image_alt, audio_teaser,
        featured, featured_image, display_order, page_ready
      ) VALUES (
        ${slug},
        ${name},
        ${payload.origin_prefix ?? ''},
        ${payload.tagline ?? ''},
        ${payload.seo_title ?? ''},
        ${payload.seo_description ?? ''},
        ${payload.about_html ?? ''},
        ${payload.moods_intro ?? ''},
        ${payload.image_url ?? ''},
        ${payload.image_alt ?? ''},
        ${payload.audio_teaser ?? ''},
        ${payload.featured ?? false},
        ${payload.featured_image ?? ''},
        ${payload.display_order ?? 0},
        ${payload.page_ready ?? true}
      )
      RETURNING id
    `;

    const instrumentId = result[0].id;

    // Insert videos if provided
    if (Array.isArray(payload.videos)) {
      for (let i = 0; i < payload.videos.length; i++) {
        const v = payload.videos[i];
        await sql`
          INSERT INTO instrument_videos (instrument_id, label, video_type, src, poster, aspect_ratio, display_order)
          VALUES (${instrumentId}, ${v.label}, ${v.video_type ?? 'video'}, ${v.src}, ${v.poster ?? ''}, ${v.aspect_ratio ?? '16 / 9'}, ${i})
        `;
      }
    }

    // Insert moods if provided
    if (Array.isArray(payload.moods)) {
      for (let i = 0; i < payload.moods.length; i++) {
        const m = payload.moods[i];
        await sql`
          INSERT INTO instrument_moods (instrument_id, label, audio_file, display_order)
          VALUES (${instrumentId}, ${m.label}, ${m.audio_file}, ${i})
        `;
      }
    }

    return json(201, { success: true, id: instrumentId });
  } catch (err: any) {
    if (err.message?.includes("unique") || err.message?.includes("duplicate")) {
      return json(409, { error: "An instrument with that slug already exists." });
    }
    console.error("POST /api/instruments error:", err);
    return json(500, { error: "Failed to create instrument." });
  }
};