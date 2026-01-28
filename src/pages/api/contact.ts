import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data instead of JSON
    const formData = await request.formData();
    
    // Convert FormData to a plain object for Formspree
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    console.log('Received form data:', data);
    
    // Forward to Formspree
    const formspreeResponse = await fetch(import.meta.env.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });
    
    console.log('Formspree status:', formspreeResponse.status);
    
    if (formspreeResponse.ok) {
      // Redirect back to contact page with success message
      return new Response(null, {
        status: 303,
        headers: {
          'Location': '/thanks'
        }
      });
    } else {
      return new Response(null, {
        status: 303,
        headers: {
          'Location': '/contact/?error=true'
        }
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(null, {
      status: 303,
      headers: {
        'Location': '/Contact/?error=true'
      }
    });
  }
}