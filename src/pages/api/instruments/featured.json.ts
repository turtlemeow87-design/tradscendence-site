import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

export const GET: APIRoute = async () => {
  try {
    const sql = neon(import.meta.env.DATABASE_URL);
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
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("GET /api/instruments/featured error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch featured instruments." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};