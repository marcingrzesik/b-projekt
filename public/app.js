(function(){
  // Wstępne zaznaczenie typu zapytania po kliknięciu przycisków z data-type
  document.querySelectorAll('[data-type]').forEach(function(a){
    a.addEventListener('click',function(){
      var r=document.getElementById(a.getAttribute('data-type')==='rusztowanie'?'t2':'t1');
      if(r) r.checked=true;
    });
  });

  // Powiększanie zdjęć
  var lb=document.getElementById('lb'),img=document.getElementById('lb-img'),cap=document.getElementById('lb-cap');
  document.querySelectorAll('.shot').forEach(function(b){
    b.addEventListener('click',function(){
      img.src=b.getAttribute('data-full');
      img.alt=b.getAttribute('data-alt')||'';
      cap.textContent=b.getAttribute('data-alt')||'';
      if(lb.showModal) lb.showModal(); else lb.setAttribute('open','');
    });
  });
  document.getElementById('lb-close').addEventListener('click',function(){lb.close();});
  lb.addEventListener('click',function(e){if(e.target===lb) lb.close();});

  // Rok w stopce
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // Formularz: wysyłka do /api/contact (worker/index.js)
  var f=document.getElementById('form'),st=document.getElementById('status');
  var label='Wyślij zapytanie';
  f.addEventListener('submit',async function(e){
    e.preventDefault();
    if(!f.reportValidity()) return;
    var btn=f.querySelector('button[type="submit"]');
    btn.disabled=true; btn.textContent='Wysyłanie…'; st.hidden=true;
    try{
      var data=Object.fromEntries(new FormData(f));
      var res=await fetch('/api/contact',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data),
        signal:AbortSignal.timeout(20000)
      });
      if(res.status===404||res.status===405){
        // Hosting statyczny (np. GitHub Pages): wysyłka bezpośrednio przez FormSubmit.
        if(data.website){ st.textContent='Zapytanie przyjęte do wysyłki. Dziękujemy!'; st.classList.remove('error'); f.reset(); return; }
        delete data.website;
        data._subject='Zapytanie ze strony B-Projekt: '+(data.service||'');
        data._template='table'; data._captcha='false';
        res=await fetch('https://formsubmit.co/ajax/kontakt@b-projekt.pl',{
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(data),
          signal:AbortSignal.timeout(20000)
        });
        var fb=await res.json().catch(function(){return {};});
        var ok=res.ok&&String(fb.success)==='true';
        st.textContent=ok?'Zapytanie przyjęte do wysyłki. Dziękujemy!':'Formularz jest chwilowo niedostępny. Zadzwoń: 512 760 117.';
        st.classList.toggle('error',!ok);
        if(ok) f.reset();
        return;
      }
      var body=await res.json();
      st.textContent=body.message||'Nie udało się wysłać zapytania.';
      st.classList.toggle('error',!res.ok);
      if(res.ok) f.reset();
    }catch(err){
      st.textContent='Nie udało się potwierdzić wysyłki. Sprawdź połączenie i spróbuj ponownie lub zadzwoń: 512 760 117.';
      st.classList.add('error');
    }finally{
      btn.disabled=false; btn.textContent=label; st.hidden=false;
    }
  });
})();
