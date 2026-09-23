export const runtime="nodejs";
const markers=["Oa2","Oa7","Oa26","Oa35","UN5","UN7","UN10","UN13","UN14","UN15","UN19","UN21","UN30","UN34","UN38"];
const empty=()=>Object.fromEntries(markers.map(m=>[m,["",""]]));
function normalize(s:string){return s.replace(/\\([()\\])/g,"$1").replace(/[()<>]/g," ").replace(/\s+/g," ")}
function decodePdfStrings(bytes:Uint8Array){const latin=new TextDecoder("latin1").decode(bytes);const chunks=[...latin.matchAll(/\(([^()]*(?:\\.[^()]*)*)\)\s*Tj/g)].map(x=>x[1]);return normalize(chunks.join(" ")+" "+latin)}
function parse(text:string){
 const alleles:any=empty();let filled=0;
 const canon=(s:string)=>s.replace(/^Un/i,"UN");
 const token=/\b(Oa2|Oa7|Oa26|Oa35|Un5|Un7|Un10|Un13|Un14|Un15|Un19|Un21|Un30|Un34|Un38)\b/gi;
 const hits=[...text.matchAll(token)];
 for(let i=0;i<hits.length;i++){const marker=canon(hits[i][1]),at=hits[i].index??0,next=hits[i+1]?.index??text.length;
   const before=text.slice(Math.max(0,at-35),at),after=text.slice(at+hits[i][0].length,Math.min(next,at+70));
   const candidates=[before,after];
   for(const seg of candidates){const nums=seg.match(/\b\d{1,3}\b|-/g)||[];if(nums.length){const pair=nums.slice(-2);if(seg===after)pair.splice(0,pair.length,...nums.slice(0,2));if(pair.length){alleles[marker]=[pair[0]==="-"?"":pair[0],pair[1]&&pair[1]!=="-"?pair[1]:""];filled++;break}}}
 }
 const get=(rx:RegExp)=>(text.match(rx)?.[1]||"").trim();
 const ring=get(/ID\s*\(?anilha\)?\s*[:\-]?\s*([A-Z0-9 .,\/\-]{3,70}?)(?=Nome|Data|Informações|Sporophila)/i);
 const sample=get(/(?:N[ºo°]?\s*da\s*Amostra|Amostra)\s*[:\-]?\s*([A-Z0-9\-]+)/i);
 let name=get(/Nome\s*[:\-]?\s*([A-Za-zÀ-ÿ0-9 .\-]{2,60}?)(?=Data de Nasc|Informações|N[ºo°]?\s*da\s*Amostra)/i);if(/^não informado$/i.test(name))name="";
 return{profile:{cig:ring||sample||name,name,ring,sample,alleles},filled}
}
export async function POST(req:Request){
 if(!(req.headers.get("authorization")||"").startsWith("Bearer "))return Response.json({error:"Não autorizado."},{status:401});
 const fd=await req.formData(),file=fd.get("file");if(!(file instanceof File))return Response.json({error:"Selecione um PDF."},{status:400});
 if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf"))return Response.json({error:"O arquivo precisa ser PDF."},{status:400});
 if(file.size>30*1024*1024)return Response.json({error:"PDF muito grande. Limite: 30 MB."},{status:413});
 const bytes=new Uint8Array(await file.arrayBuffer()),text=decodePdfStrings(bytes),result=parse(text);
 if(result.filled<5)return Response.json({error:"Este arquivo parece ser um PDF por imagem/print. O leitor automático não conseguiu confirmar pelo menos 5 marcadores. Use o CIG original ou preencha manualmente; nenhum dado foi salvo.",needsVisualRead:true},{status:422});
 return Response.json(result)
}