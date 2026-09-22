export const runtime="nodejs";
const markers=["Oa2","Oa7","Oa26","Oa35","UN5","UN7","UN10","UN13","UN14","UN15","UN19","UN21","UN30","UN34","UN38"];
const empty=()=>Object.fromEntries(markers.map(m=>[m,["",""]]));
function pdfText(bytes:Uint8Array){let s="";for(const b of bytes)s+=(b>=32&&b<=126)||b===10||b===13?String.fromCharCode(b):" ";return s.replace(/\\([()\\])/g,"$1").replace(/[()<>]/g," ").replace(/\s+/g," ")}
function parse(text:string){
 const alleles:any=empty();let filled=0;
 for(const m of markers){const v=m.replace("UN","Un"),a=text.match(new RegExp("(\\d+|-)\\s*[\\/ ]\\s*(\\d+|-)\\s*"+v,"i"))||text.match(new RegExp(v+"\\s*(?:Alelos?\\s*)?(\\d+|-)\\s*[\\/ ]\\s*(\\d+|-)","i"));if(a){alleles[m]=[a[1]==="-"?"":a[1],a[2]==="-"?"":a[2]];filled++}}
 const get=(rx:RegExp)=>(text.match(rx)?.[1]||"").trim();
 const ring=get(/ID\s*\(anilha\)\s*[:\-]?\s*([A-Z0-9 .,/\-]{3,70}?)(?=Nome|Data|Informações|Sporophila)/i);
 const sample=get(/N[ºo°]?\s*da\s*Amostra\s*[:\-]?\s*([A-Z0-9\-]+)/i);
 let name=get(/Nome\s*[:\-]?\s*([A-Za-zÀ-ÿ0-9 .\-]{2,60}?)(?=Data de Nasc|Informações|N[ºo°]?\s*da\s*Amostra)/i);if(/^não informado$/i.test(name))name="";
 return{profile:{cig:ring||sample||name,name,ring,sample,alleles},filled}
}
export async function POST(req:Request){
 if(!(req.headers.get("authorization")||"").startsWith("Bearer "))return Response.json({error:"Não autorizado."},{status:401});
 const fd=await req.formData(),file=fd.get("file");if(!(file instanceof File))return Response.json({error:"Selecione um PDF."},{status:400});
 if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf"))return Response.json({error:"O arquivo precisa ser PDF."},{status:400});
 if(file.size>12*1024*1024)return Response.json({error:"PDF muito grande. Limite: 12 MB."},{status:413});
 const result=parse(pdfText(new Uint8Array(await file.arrayBuffer())));
 if(result.filled<5)return Response.json({error:"Não consegui extrair este PDF da Unigen com segurança. Use o PDF original, não escaneado. Nenhum dado foi salvo."},{status:422});
 return Response.json(result)
}
