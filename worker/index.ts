interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API Health check verifying D1 and R2 connections
    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "SLIIT Courseweb MCP Server",
        domain: "sliitcoursewebmcp.kesaru.me",
        author: "Kesaru Hasun (kesaru.me)",
        bindings: {
          d1: !!env.DB,
          r2: !!env.MEDIA,
          assets: !!env.ASSETS
        },
        timestamp: new Date().toISOString()
      }, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      });
    }

    // Optional R2 media proxy for dynamic assets stored in courseweb-media
    if (url.pathname.startsWith("/api/media/")) {
      const key = url.pathname.replace("/api/media/", "");
      const object = await env.MEDIA.get(key);
      if (!object) {
        return new Response("Object Not Found in R2", { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      return new Response(object.body, { headers });
    }

    // Serve static assets from the website directory
    return env.ASSETS.fetch(request);
  }
};
