const SUPABASE_URL = "https://rxetfbsvnyzdcyuzhmfi.supabase.co";
const SUPABASE_KEY = "sb_publishable_EffrEgdpf9_YxTAySUnCqA_p5Bu_Q7p";

function authHeaders(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  return { apikey: SUPABASE_KEY, Authorization: authorization, "Content-Type": "application/json" };
}

export async function GET(request: Request) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/birds?select=data&order=updated_at.asc`, { headers: authHeaders(request), cache: "no-store" });
  if (res.status === 401 || res.status === 403) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (!res.ok) return Response.json({ birds: [] });
  const rows = await res.json() as { data: unknown }[];
  return Response.json({ birds: rows.map(r => r.data) });
}
export async function PUT(request: Request) {
  const bird = await request.json() as { name?: string };
  if (!bird.name) return Response.json({ error: "name is required" }, { status: 400 });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/birds?on_conflict=name`, { method:"POST", headers:{...authHeaders(request),Prefer:"resolution=merge-duplicates,return=minimal"}, body:JSON.stringify({name:bird.name,data:bird,updated_at:new Date().toISOString()}) });
  return res.ok ? Response.json({ok:true}) : Response.json({error:await res.text()},{status:res.status});
}
export async function DELETE(request: Request) {
  const name=new URL(request.url).searchParams.get("name");
  if(!name)return Response.json({error:"name is required"},{status:400});
  const res=await fetch(`${SUPABASE_URL}/rest/v1/birds?name=eq.${encodeURIComponent(name)}`,{method:"DELETE",headers:authHeaders(request)});
  return res.ok?Response.json({ok:true}):Response.json({error:await res.text()},{status:res.status});
}
