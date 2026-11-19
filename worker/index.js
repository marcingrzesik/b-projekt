const services = ['Wykonanie dachu','Wynajem rusztowania'];
const reply = (status, message) => Response.json({message}, {status,headers:{'Cache-Control':'no-store'}});
export async function contact(request, env, upstream = fetch) {
  if(request.method !== 'POST') return reply(405,'Ta metoda nie jest obsługiwana.');
  const origin=request.headers.get('Origin');
  if(!origin || origin !== new URL(request.url).origin) return reply(403,'Odśwież stronę i spróbuj ponownie.');
  if(!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415,'Niepoprawny format wiadomości.');
  if(Number(request.headers.get('Content-Length'))>12000) return reply(413,'Wiadomość jest za długa.');
  let raw;try {const text=await request.text();if(text.length>12000)return reply(413,'Wiadomość jest za długa.');raw=JSON.parse(text);}catch{return reply(400,'Sprawdź dane formularza.');}
  if(!raw || typeof raw!=='object' || Array.isArray(raw))return reply(400,'Sprawdź dane formularza.');
  if(raw.website)return reply(400,'Nie udało się wysłać wiadomości.');
  const limits={name:100,email:254,phone:40,place:100,date:100,details:1000};const data={};
  for(const [key,max] of Object.entries(limits)){if(typeof raw[key]!=='string'||raw[key].length>max)return reply(400,'Sprawdź dane formularza.');data[key]=raw[key].trim();}
  if(!services.includes(raw.service)||!data.name||!data.place||!data.details||!/^\S+@[^\s@]+\.[^\s@]+$/.test(data.email)||/[\r\n]/.test(data.email))return reply(400,'Uzupełnij imię, e-mail, miejscowość i opis.');
  if(!env.CONTACT_RECIPIENT)return reply(503,'Formularz jest chwilowo niedostępny. Zadzwoń: 512 760 117.');
  try{
    const res=await upstream('https://formsubmit.co/ajax/'+encodeURIComponent(env.CONTACT_RECIPIENT),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json',Referer:'https://b-projekt.pl/',Origin:'https://b-projekt.pl'},body:JSON.stringify({name:data.name,email:data.email,Telefon:data.phone||'Nie podano',Usługa:raw.service,Miejscowość:data.place,Termin:data.date||'Do uzgodnienia',message:data.details,_subject:'B-Projekt — '+raw.service,_template:'table',_url:'https://b-projekt.pl',_captcha:'false'}),signal:AbortSignal.timeout(15000)});
    const result=await res.json();
    if(!['true',true].includes(result.success))console.warn('Contact provider response',res.status,String(result.message||'').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+/ig,'[email]').slice(0,300));
    if(res.status===429)return reply(503,'Usługa wysyłki jest chwilowo przeciążona. Spróbuj za kilka minut lub zadzwoń: 512 760 117.');
    if(/needs Activation/i.test(result.message||''))return reply(503,'Formularz oczekuje na aktywację. W sprawie zapytania zadzwoń: 512 760 117.');
    if(!res.ok||!['true',true].includes(result.success))return reply(502,'Nie udało się wysłać zapytania. Spróbuj ponownie lub zadzwoń: 512 760 117.');
    return reply(200,'Zapytanie przyjęte do wysyłki. Dziękujemy!');
  }catch{return reply(502,'Nie udało się potwierdzić wysyłki. Spróbuj ponownie lub zadzwoń: 512 760 117.');}
}
export default {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/contact')return contact(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const asset=assets[url.pathname==='/'?'/index.html':url.pathname];
  if(!asset)return new Response('Nie znaleziono strony',{status:404});
  return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)),{headers:{'Content-Type':asset.type,'Cache-Control':url.pathname.startsWith('/assets/')?'public, max-age=86400':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});
}};
