/**
 * Cloudflare Worker AI Proxy for FrontendForge (Advanced Mode Pages & Workers)
 * 
 * Securely proxies requests to NVIDIA Nemotron Ultra without CORS restrictions.
 */

export default {
  async fetch(request, env) {
    // 1. Handle CORS preflight
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests are supported" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();

      let messages = [];
      const model = body.model || env.NVIDIA_MODEL || "nvidia/nemotron-3.5-lightning-30b-a3b";

      if (Array.isArray(body.messages) && body.messages.length > 0) {
        messages = body.messages;
      } else if (body.prompt) {
        messages = [
          ...(body.systemPrompt ? [{ role: "system", content: body.systemPrompt }] : []),
          ...(Array.isArray(body.history) ? body.history.slice(-8).map((m) => ({ role: m.role, content: m.content })) : []),
          { role: "user", content: body.prompt },
        ];
      } else {
        return new Response(JSON.stringify({ error: "Missing required prompt or messages payload" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check for incoming Authorization header or Cloudflare secret
      const incomingAuth = request.headers.get("Authorization");
      const clientKey = incomingAuth ? incomingAuth.replace(/^Bearer\s+/i, "").trim() : "";
      const apiKey = env.NVIDIA_API_KEY || clientKey;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "NVIDIA API Key not provided. Configure NVIDIA_API_KEY in worker secrets or pass Authorization header." }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Forward request to NVIDIA NIM API (key is kept completely secret on the server)
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 4096,
          stream: true,
          chat_template_kwargs: { enable_thinking: false },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `NVIDIA API error (${response.status}): ${errText}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Return the streaming response directly to the browser
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  },
};
