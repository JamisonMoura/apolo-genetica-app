const URL="https://rxetfbsvnyzdcyuzhmfi.supabase.co";
const KEY="sb_publishable_EffrEgdpf9_YxTAySUnCqA_p5Bu_Q7p";
const headers=(r:Request)=>({apikey:KEY,Authorization:r.headers.get("authorization")||"","content-type":"application/json"});
export async function GET(r:Request){const x=await fetch(URL+"/rest/v1/deleted_birds?select=name",{headers:headers(r),cache:"no-store"});return new Response(await x.text(),{status:x.status,headers:{"content-type":"application/json"}})}
export async function POST(r:Request){const {name}=await r.json();if(!name)return Response.json({error:"name required"},{status:400});const x=await fetch(URL+"/rest/v1/deleted_birds?on_conflict=name",{method:"POST",headers:{...headers(r),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify({name})});if(!x.ok)return new Response(await x.text(),{status:x.status});await fetch(URL+"/rest/v1/birds?name=eq."+encodeURIComponent(name),{method:"DELETE",headers:headers(r)});return Response.json({ok:true})}
