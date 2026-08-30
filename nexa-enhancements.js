(()=>{
  const $=id=>document.getElementById(id);
  const escx=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toastx=(a,b='')=>{const n=$('notice');if(!n)return;n.innerHTML='<b>'+escx(a)+'</b><br>'+escx(b);n.style.display='block';clearTimeout(window.__nexat);window.__nexat=setTimeout(()=>n.style.display='none',4500)};
  const key=()=>window.peer?'nexa_wa_'+window.peer.id:null;
  const getPhone=()=>key()?localStorage.getItem(key())||'':'';
  const normalize=v=>{let p=String(v||'').replace(/\D/g,'');if(p.startsWith('00'))p=p.slice(2);if(p.startsWith('0'))p='92'+p.slice(1);return p};
  async function saveWa(){if(!window.peer)return toastx('WhatsApp','Pehle chat open karo.');const old=getPhone();const v=prompt('WhatsApp number country code ke sath likho. Example: 923001234567',old||'');if(v===null)return;const p=normalize(v);if(!/^\d{10,15}$/.test(p))return toastx('Invalid number','Example: 923001234567');localStorage.setItem(key(),p);toastx('WhatsApp number saved',p+' — ab WA mode mein message bhejo.');}
  async function waSend(){const t=$('text')?.value.trim();if(!t||!window.peer)return;let p=getPhone()||window.peer.whatsapp_phone||'';if(!p){await saveWa();p=getPhone();if(!p)return;}p=normalize(p);const {data}=await window.db?.auth?.getSession?.()||{};const session=data?.session;if(!session)return toastx('Session expired','Dobara sign in karo.');$('send').disabled=true;try{const rr=await fetch('https://hldkkxrlvprnufeoyzlf.supabase.co/functions/v1/send-whatsapp',{method:'POST',headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify({to:p,message:t})});const wd=await rr.json().catch(()=>({}));if(!rr.ok){let detail=typeof wd.error==='string'?wd.error:(wd.error?.message||wd.message||JSON.stringify(wd.meta||wd));return toastx('WhatsApp send failed',detail)}$('text').value='';toastx('WhatsApp sent','Sent to +'+p)}catch(e){toastx('WhatsApp send failed',e?.message||'Network error')}finally{$('send').disabled=false}}
  function wire(){
    if(!$('whatsappMode')||!$('whatsappNumber'))return;
    $('whatsappNumber').onclick=saveWa;
    $('whatsappMode').onclick=()=>{window.nexaSendMode=window.nexaSendMode==='whatsapp'?'nexa':'whatsapp';$('whatsappMode').classList.toggle('wa-active',window.nexaSendMode==='whatsapp');$('whatsappMode').textContent=window.nexaSendMode==='whatsapp'?'WA ✓':'WA';$('text').placeholder=window.nexaSendMode==='whatsapp'?'WhatsApp message…':'Message…';toastx(window.nexaSendMode==='whatsapp'?'WhatsApp mode ON':'Nexa mode ON',window.nexaSendMode==='whatsapp'?(getPhone()?'Number linked: +'+getPhone():'WA# dabakar recipient number save karo'):'Message will stay inside NEXA')};
    const send=$('send');if(send)send.onclick=()=>window.nexaSendMode==='whatsapp'?waSend():window.__nexaOriginalSend?.();
    const text=$('text');if(text)text.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();send?.click()}};
  }
  function capture(){
    if(typeof window.send==='function'&&!window.__nexaOriginalSend){window.__nexaOriginalSend=window.send;}
    if(typeof window.openChat==='function'&&!window.__nexaOpenChat){window.__nexaOpenChat=window.openChat;}
    if(typeof window.loadChats==='function'&&!window.__nexaLoadChats){window.__nexaLoadChats=window.loadChats;}
    if(window.peer&&window.__nexaOriginalSend)wire();
  }
  const timer=setInterval(()=>{capture();if(window.peer&&$('chat'))wire();},700);
  window.addEventListener('beforeunload',()=>clearInterval(timer));
})();