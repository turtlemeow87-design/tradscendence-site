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

// GET /api/instruments/ArabicOud — public: single instrument with videos & moods
export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    const instruments = await sql`
      SELECT * FROM instruments WHERE slug = ${slug}
    `;

    if (instruments.length === 0) {
      return json(404, { error: "Instrument not found." });
    }

    const inst = instruments[0];

    // Fetch related videos
    const videos = await sql`
      SELECT label, video_type, src, poster, aspect_ratio
      FROM instrument_videos
      WHERE instrument_id = ${inst.id}
      ORDER BY display_order ASC
    `;

    // Fetch related moods
    const moods = await sql`
      SELECT label, audio_file
      FROM instrument_moods
      WHERE instrument_id = ${inst.id}
      ORDER BY display_order ASC
    `;

    // Remove internal id from response
    const { id, ...publicData } = inst;

    return json(200, { ...publicData, videos, moods } as any);
  } catch (err) {
    console.error(`GET /api/instruments/${slug} error:`, err);
    return json(500, { error: "Failed to fetch instrument." });
  }
};

// PUT /api/instruments/ArabicOud — admin: update instrument
export const PUT: APIRoute = async ({ params, request }) => {
  const key = request.headers.get("x-admin-key");
  if (key !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized." });
  }

  const { slug } = params;
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON." });
  }

  try {
    const sql = neon(import.meta.env.DATABASE_URL);

    // Check exists
    const existing = await sql`SELECT id FROM instruments WHERE slug = ${slug}`;
    if (existing.length === 0) {
      return json(404, { error: "Instrument not found." });
    }
    const instId = existing[0].id;

    // Update main fields (only those provided)
    // We rebuild the full row to keep it simple with Neon's tagged template
    const current = (await sql`SELECT * FROM instruments WHERE id = ${instId}`)[0];

    await sql`
      UPDATE instruments SET
        name            = ${payload.name ?? current.name},
        origin_prefix   = ${payload.origin_prefix ?? current.origin_prefix},
        tagline         = ${payload.tagline ?? current.tagline},
        seo_title       = ${payload.seo_title ?? current.seo_title},
        seo_description = ${payload.seo_description ?? current.seo_description},
        about_html      = ${payload.about_html ?? current.about_html},
        moods_intro     = ${payload.moods_intro ?? current.moods_intro},
        image_url       = ${payload.image_url ?? current.image_url},
        image_alt       = ${payload.image_alt ?? current.image_alt},
        audio_teaser    = ${payload.audio_teaser ?? current.audio_teaser},
        featured        = ${payload.featured ?? current.featured},
        featured_image  = ${payload.featured_image ?? current.featured_image},
        display_order   = ${payload.display_order ?? current.display_order},
        page_ready      = ${payload.page_ready ?? current.page_ready},
        updated_at      = NOW()
      WHERE id = ${instId}
    `;

    // Replace videos if provided
    if (Array.isArray(payload.videos)) {
      await sql`DELETE FROM instrument_videos WHERE instrument_id = ${instId}`;
      for (let i = 0; i < payload.videos.length; i++) {
        const v = payload.videos[i];
        await sql`
          INSERT INTO instrument_videos (instrument_id, label, video_type, src, poster, aspect_ratio, display_order)
          VALUES (${instId}, ${v.label}, ${v.video_type ?? 'video'}, ${v.src}, ${v.poster ?? ''}, ${v.aspect_ratio ?? '16 / 9'}, ${i})
        `;
      }
    }

    // Replace moods if provided
    if (Array.isArray(payload.moods)) {
      await sql`DELETE FROM instrument_moods WHERE instrument_id = ${instId}`;
      for (let i = 0; i < payload.moods.length; i++) {
        const m = payload.moods[i];
        await sql`
          INSERT INTO instrument_moods (instrument_id, label, audio_file, display_order)
          VALUES (${instId}, ${m.label}, ${m.audio_file}, ${i})
        `;
      }
    }

    return json(200, { success: true });
  } catch (err) {
    console.error(`PUT /api/instruments/${slug} error:`, err);
    return json(500, { error: "Failed to update instrument." });
  }
};

// DELETE /api/instruments/ArabicOud — admin: remove instrument
export const DELETE: APIRoute = async ({ params, request }) => {
  const key = request.headers.get("x-admin-key");
  if (key !== import.meta.env.ADMIN_API_KEY) {
    return json(401, { error: "Unauthorized." });
  }

  const { slug } = params;

  try {
    const sql = neon(import.meta.env.DATABASE_URL);
    const result = await sql`DELETE FROM instruments WHERE slug = ${slug} RETURNING id`;

    if (result.length === 0) {
      return json(404, { error: "Instrument not found." });
    }

    return json(200, { success: true });
  } catch (err) {
    console.error(`DELETE /api/instruments/${slug} error:`, err);
    return json(500, { error: "Failed to delete instrument." });
  }
};