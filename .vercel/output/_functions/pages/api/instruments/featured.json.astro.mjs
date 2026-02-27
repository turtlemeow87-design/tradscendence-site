import { neon } from '@neondatabase/serverless';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  try {
    const sql = neon("postgresql://neondb_owner:npg_7w9kgXDBueEJ@ep-shiny-river-aiuubcro-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require");
    const rows = await sql`
      SELECT slug, name, featured_image, image_url, audio_teaser
      FROM instruments
      WHERE featured = TRUE
      ORDER BY display_order ASC
    `;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    console.error("GET /api/instruments/featured error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch featured instruments." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
