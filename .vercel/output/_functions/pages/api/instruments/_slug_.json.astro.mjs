import { neon } from '@neondatabase/serverless';
export { renderers } from '../../../renderers.mjs';

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
const GET = async ({ params }) => {
  const { slug } = params;
  try {
    const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
    const instruments = await sql`
      SELECT * FROM instruments WHERE slug = ${slug}
    `;
    if (instruments.length === 0) {
      return json(404, { error: "Instrument not found." });
    }
    const inst = instruments[0];
    const videos = await sql`
      SELECT label, video_type, src, poster, aspect_ratio
      FROM instrument_videos
      WHERE instrument_id = ${inst.id}
      ORDER BY display_order ASC
    `;
    const moods = await sql`
      SELECT label, audio_file
      FROM instrument_moods
      WHERE instrument_id = ${inst.id}
      ORDER BY display_order ASC
    `;
    const { id, ...publicData } = inst;
    return json(200, { ...publicData, videos, moods });
  } catch (err) {
    console.error(`GET /api/instruments/${slug} error:`, err);
    return json(500, { error: "Failed to fetch instrument." });
  }
};
const PUT = async ({ params, request }) => {
  const key = request.headers.get("x-admin-key");
  if (key !== "45a99ef683fe05e1d53e1d24f15c7e9d1f1a06e6e720fdb54149513b7e7545a7") {
    return json(401, { error: "Unauthorized." });
  }
  const { slug } = params;
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON." });
  }
  try {
    const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
    const existing = await sql`SELECT id FROM instruments WHERE slug = ${slug}`;
    if (existing.length === 0) {
      return json(404, { error: "Instrument not found." });
    }
    const instId = existing[0].id;
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
    if (Array.isArray(payload.videos)) {
      await sql`DELETE FROM instrument_videos WHERE instrument_id = ${instId}`;
      for (let i = 0; i < payload.videos.length; i++) {
        const v = payload.videos[i];
        await sql`
          INSERT INTO instrument_videos (instrument_id, label, video_type, src, poster, aspect_ratio, display_order)
          VALUES (${instId}, ${v.label}, ${v.video_type ?? "video"}, ${v.src}, ${v.poster ?? ""}, ${v.aspect_ratio ?? "16 / 9"}, ${i})
        `;
      }
    }
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
const DELETE = async ({ params, request }) => {
  const key = request.headers.get("x-admin-key");
  if (key !== "45a99ef683fe05e1d53e1d24f15c7e9d1f1a06e6e720fdb54149513b7e7545a7") {
    return json(401, { error: "Unauthorized." });
  }
  const { slug } = params;
  try {
    const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
