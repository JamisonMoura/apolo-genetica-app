const URL="https://rxetfbsvnyzdcyuzhmfi.supabase.co";
const KEY="sb_publishable_EffrEgdpf9_YxTAySUnCqA_p5Bu_Q7p";
const headers=(r:Request)=>({apikey:KEY,Authorization:r.headers.get("authorization")||"","content-type":"application/json"});
export async function GET(r:Request){const x=await fetch(URL+"/rest/v1/breeding_plans?select=*&order=created_at.desc",{headers:headers(r),cache:"no-store"});return new Response(await x.text(),{status:x.status,headers:{"content-type":"application/json"}})}
export async function POST(r:Request){const body=await r.json();const x=await fetch(URL+"/rest/v1/breeding_plans?on_conflict=season,male_name,female_name",{method:"POST",headers:{...headers(r),Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(body)});return x.ok?Response.json({ok:true}):new Response(await x.text(),{status:x.status})}
