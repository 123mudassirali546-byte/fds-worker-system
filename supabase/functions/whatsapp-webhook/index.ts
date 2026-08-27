import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") ?? "";
const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN") ?? "";
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID") ?? "";
const GRAPH_VERSION = Deno.env.get("WHATSAPP_GRAPH_VERSION") ?? "v23.0";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new Response(challenge ?? "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const body = await req.json().catch(() => null);
  console.log("WhatsApp webhook received", JSON.stringify(body));
  return new Response("EVENT_RECEIVED", { status: 200 });
});
