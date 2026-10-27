(function(){
  var b=document.body, API=b.getAttribute('data-api')||'', LANG=document.documentElement.lang||'es';
  var T=JSON.parse(document.getElementById('t-js')?document.getElementById('t-js').textContent:'{}');
  // Menú móvil
  var mb=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}})}
  // Año
  document.querySelectorAll('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});
  // Formulario
  var f=document.getElementById('contact-form');
  if(f){
    var msg=f.querySelector('.form-msg');
    function data(){return{nombre:f.nombre.value.trim(),telefono:f.telefono.value.trim(),correo:f.correo.value.trim(),
      tipo:f.tipo.value,mensaje:f.mensaje.value.trim(),consent:f.consent.checked,empresa:f.empresa.value,idioma:LANG,pagina:location.pathname}}
    function ok(d){return d.nombre&&d.telefono.replace(/\D/g,'').length>=8&&d.mensaje&&d.consent}
    function send(d,canal){if(!API)return Promise.reject();d.canal=canal;
      return fetch(API,{method:'POST',body:JSON.stringify(d)}).then(function(r){return r.json()}).then(function(j){if(!j.ok)throw 0;return j})}
    function show(t,c){msg.textContent=t;msg.className='form-msg '+(c||'')}
    f.addEventListener('submit',function(e){e.preventDefault();var d=data();if(!ok(d))return show(T.invalid,'err');
      var btn=f.querySelector('[type=submit]');btn.disabled=true;show(T.sending);
      send(d,'formulario').then(function(){f.reset();show(T.ok,'ok')}).catch(function(){show(T.error,'err')}).then(function(){btn.disabled=false})});
    var wb=f.querySelector('[data-wa]');
    if(wb)wb.addEventListener('click',function(){var d=data();if(!ok(d))return show(T.invalid,'err');
      var txt=T.greeting+'\n\n'+d.nombre+' · '+d.telefono+(d.correo?' · '+d.correo:'')+'\n'+d.tipo+'\n\n'+d.mensaje;
      send(d,'whatsapp').catch(function(){});
      window.open(wb.getAttribute('data-wa')+'?text='+encodeURIComponent(txt),'_blank','noopener');show('')});
  }
  // Opiniones de Google
  var rv=document.getElementById('g-reviews');
  if(rv&&API){
    fetch(API+'?api=resenas&lang='+LANG).then(function(r){return r.json()}).then(function(j){
      if(!j||!j.ok||!j.rating)return;
      var box=document.getElementById('g-rating');
      box.querySelector('b').textContent=j.rating.toFixed(1);
      box.querySelector('.stars').textContent=stars(j.rating);
      box.querySelector('.n').textContent=j.total;
      if(j.url){box.querySelectorAll('[data-gurl]').forEach(function(a){a.href=a.hasAttribute('data-write')&&j.writeUrl?j.writeUrl:j.url})}
      box.classList.add('on');
      var list=document.getElementById('quotes');
      (j.reviews||[]).forEach(function(r){
        if(!r.text)return;
        var q=document.createElement('blockquote');q.className='quote';
        var p=document.createElement('p');p.textContent='“'+r.text+'”';q.appendChild(p);
        var ft=document.createElement('footer');
        if(r.photo){var im=document.createElement('img');im.src=r.photo;im.alt='';im.referrerPolicy='no-referrer';im.loading='lazy';ft.appendChild(im)}
        var a=document.createElement(r.authorUrl?'a':'span');a.textContent=r.author;if(r.authorUrl){a.href=r.authorUrl;a.target='_blank';a.rel='noopener'}
        ft.appendChild(a);var s=document.createElement('span');s.className='stars';s.textContent=stars(r.rating);ft.appendChild(s);
        if(r.when){var w=document.createElement('span');w.textContent=r.when;ft.appendChild(w)}
        q.appendChild(ft);list.appendChild(q)});
      document.getElementById('g-attr').hidden=false;
      var sec=document.getElementById('opiniones');if(sec)sec.hidden=false;
    }).catch(function(){});
  }
  function stars(n){var r=Math.round(n);return '★★★★★'.slice(0,r)+'☆☆☆☆☆'.slice(0,5-r)}
  // Filtro de categorías del blog
  var cats=document.querySelector('.cats');
  if(cats)cats.addEventListener('click',function(e){var bt=e.target.closest('button');if(!bt)return;
    var c=bt.getAttribute('data-cat');cats.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===bt)});
    document.querySelectorAll('.posts .post-card').forEach(function(p){p.hidden=c&&p.getAttribute('data-cat')!==c})});
  // Copiar enlace
  var cp=document.querySelector('[data-copy]');
  if(cp)cp.addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText(location.href).then(function(){cp.textContent=cp.getAttribute('data-copied')})});
})();
