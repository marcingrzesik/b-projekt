const menu=document.querySelector('.menu');
const nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Otwórz menu');}));
const form=document.querySelector('#inquiry');
document.querySelector('.rental-cta').addEventListener('click',()=>{form.querySelector('input[value="Wynajem rusztowania"]').checked=true;});
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const button=form.querySelector('button[type="submit"]');
  const result=document.querySelector('#message-result');
  button.disabled=true;button.textContent='Wysyłanie…';result.hidden=true;
  try{
    const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form))),signal:AbortSignal.timeout(20000)});
    const body=await response.json();
    result.textContent=body.message||'Nie udało się wysłać zapytania.';
    result.classList.toggle('error',!response.ok);
    if(response.ok)form.reset();
  }catch{
    result.textContent='Nie udało się potwierdzić wysyłki. Sprawdź połączenie i spróbuj ponownie lub zadzwoń: 512 760 117.';result.classList.add('error');
  }finally{button.disabled=false;button.innerHTML='Wyślij zapytanie <span aria-hidden="true">↗</span>';result.hidden=false;}
});
const dialog=document.querySelector('#photo-dialog');
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-image').src=button.dataset.photo;document.querySelector('#dialog-image').alt=button.dataset.caption;document.querySelector('#dialog-caption').textContent=button.dataset.caption;dialog.showModal();}));
document.querySelector('.close-photo').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.querySelector('#year').textContent=new Date().getFullYear();
