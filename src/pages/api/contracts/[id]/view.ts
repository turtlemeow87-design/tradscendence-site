import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const contractId = params.id;
  if (!contractId) {
    return new Response("Missing contract ID", { status: 400 });
  }

  // Dev mode guard
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return new Response("Dev mode: no PDF to serve", { status: 200 });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const result = await sql`
      SELECT c.file_url, cs.email
      FROM contracts c
      JOIN contact_submissions cs ON c.submission_id = cs.id
      WHERE c.id = ${contractId}
    `;

    if (result.length === 0) {
      return new Response("Contract not found", { status: 404 });
    }

    if (result[0].email !== user.email) {
      return new Response("Forbidden", { status: 403 });
    }

    const pdfRes = await fetch(result[0].file_url);
    if (!pdfRes.ok) {
      return new Response("Failed to fetch PDF", { status: 502 });
    }

    const pdfBytes = await pdfRes.arrayBuffer();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    console.error("Contract view error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};