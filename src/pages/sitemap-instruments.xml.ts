import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

// Instrument pages come from the database, so the build-time sitemap can't see them.
// Listed in robots.txt alongside sitemap-index.xml.
export const GET: APIRoute = async () => {
  try {
    const sql = neon(import.meta.env.DATABASE_URL);
    const rows = await sql`
      SELECT slug, updated_at
      FROM instruments
      WHERE page_ready = TRUE
      ORDER BY display_order ASC
    `;

    const urls = rows
      .map((row) => {
        const lastmod = row.updated_at ? `<lastmod>${new Date(row.updated_at).toISOString()}</lastmod>` : "";
        return `<url><loc>https://soundbeyondborders.com/instruments/${encodeURIComponent(row.slug)}</loc>${lastmod}</url>`;
      })
      .join("");

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (err) {
    console.error("GET /sitemap-instruments.xml error:", err);
    return new Response("Failed to build sitemap", { status: 500 });
  }
};
