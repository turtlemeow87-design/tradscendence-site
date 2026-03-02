import type { APIRoute } from "astro";
import { neon } from "@neondatabase/serverless";

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const invoiceId = params.id;
  if (!invoiceId) {
    return new Response("Missing invoice ID", { status: 400 });
  }

  // Dev mode guard
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return new Response("Dev mode: no PDF to serve", { status: 200 });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  try {
    const result = await sql`
      SELECT i.file_url, i.label, cs.email
      FROM invoices i
      JOIN contact_submissions cs ON i.submission_id = cs.id
      WHERE i.id = ${invoiceId}
    `;

    if (result.length === 0) {
      return new Response("Invoice not found", { status: 404 });
    }

    if (result[0].email !== user.email) {
      return new Response("Forbidden", { status: 403 });
    }

    const pdfRes = await fetch(result[0].file_url);
    if (!pdfRes.ok) {
      return new Response("Failed to fetch PDF", { status: 502 });
    }

    const pdfBytes = await pdfRes.arrayBuffer();
    const filename = `${result[0].label || "document"}.pdf`;

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Invoice view error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};