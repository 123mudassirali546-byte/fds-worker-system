import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") ?? "";
Deno.serve(async (req) => {
 const url=new URL(req.url);
 if(req.method==="GET") return url.searchParams.get("hub.verify_token")===VERIFY_TOKEN ? new Response(url.searchParams.get("hub.challenge")??"",{status:200}) : new Response("Forbidden",{status:403});
 if(req.method==="POST"){ console.log(JSON.stringify(await req.json().catch(()=>null))); return new Response("EVENT_RECEIVED",{status:200}); }
 return new Response("Method Not Allowed",{status:405});
});
