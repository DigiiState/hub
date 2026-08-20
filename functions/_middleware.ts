export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const cookie = context.request.headers.get("Cookie") || "";
  
  // Protect all /dashboard routes
  if (url.pathname.startsWith("/dashboard")) {
    if (!cookie.includes("DS_SESSION=")) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/admin" },
      });
    }
  }
  
  return context.next();
};
