(()=>{
 const SB_URL='https://hldkkxrlvprnufeoyzlf.supabase.co',SB_KEY='sb_publishable_7DVCUy_mDYoDzhMZvt-OQg_R9xpWwWQ',dbx=supabase.createClient(SB_URL,SB_KEY),$=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
 const toast=(a,b='')=>{const n=$('notice');if(!n)return;n.innerHTML='<b>'+esc(a)+'</b><br>'+esc(b);n.style.display='block';clearTimeout(window.__nx);window.__nx=setTimeout(()=>n.style.display='none',4500)};
 const normalize=v=>{let p=String(v||'').replace(/\D/g,'');if(p.startsWith('00'))p=p.slice(2);if(p.startsWith('0'))p='92'+p.slice(1);return p};
 const currentId=()=>{const s=$('chatId')?.textContent||'',m=s.match(/(\d{6})\s*$/);return m?.[1]||''};
 const phoneKey=id=>'nexa_wa_'+id;
 async function save(){const id=currentId();if(!id)return toast('WhatsApp','Pehle NEXA user ki chat open karo.');const old=localStorage.getItem(phoneKey(id))||'';const v=prompt('WhatsApp number country code ke sath likho. Example: 923001234567',old);if(v===null)return;const p=normalize(v);if(!/^\d{10,15}$/.test(p))return toast('Invalid number','Example: 923001234567');localStorage.setItem(phoneKey(id),p);toast('WhatsApp number saved','+'+p);}
 async function send(){const t=$('text')?.value.trim();if(!t)return;const id=currentId();if(!id)return toast('WhatsApp','Pehle chat open karo.');let p=localStorage.getItem(phoneKey(id))||'';if(!p){await save();p=localStorage.getItem(phoneKey(id))||'';if(!p)return;}const {data}=await dbx.auth.getSession();if(!data?.session)return toast('Session expired','Dobara sign in karo.');$('send').disabled=true;try{const rr=await fetch(SB_URL+'/functions/v1/send-whatsapp',{method:'POST',headers:{Authorization:'Bearer '+data.session.access_token,'Content-Type':'application/json'},body:JSON.stringify({to:p,message:t})});const d=await rr.json().catch(()=>({}));if(!rr.ok){const e=typeof d.error==='string'?d.error:(d.error?.message||d.message||JSON.stringify(d));return toast('WhatsApp send failed',e)}$('text').value='';toast('WhatsApp sent','Message +'+p+' par bhej diya gaya.')}catch(e){toast('WhatsApp send failed',e.message||'Network error')}finally{$('send').disabled=false}}
 function messageAfterAdd(id){
   const result=$('result'); if(!result)return;
   const add=document.getElementById('addBtn');
   if(!add||add.dataset.msgFlow)return;
   add.dataset.msgFlow='1';
   const watch=new MutationObserver(()=>{
     const contact=document.querySelector('[data-c="'+CSS.escape(id)+'"]');
     if(contact){watch.disconnect();const b=document.createElement('button');b.className='sm';b.textContent='💬 Message';b.type='button';b.onclick=()=>contact.click();result.appendChild(b);}
   });
   watch.observe(result,{childList:true,subtree:true});
   setTimeout(()=>{
     watch.disconnect();
     if(!result.querySelector('[data-message-now]')){
       const b=document.createElement('button');b.className='sm';b.textContent='💬 Message';b.type='button';b.dataset.messageNow='1';b.onclick=async()=>{const c=await dbx.from('contacts').select('contact_id').eq('user_id',window.__nexaMeId||'').eq('contact_id',id).maybeSingle();if(c.data){const el=document.querySelector('[data-c="'+CSS.escape(id)+'"]');if(el)el.click();else toast('Added','People → My Contacts mein user mil jayega.')}};result.appendChild(b);
     }
   },1600);
 }
 function watchAdd(){const r=$('result');if(!r)return;const b=$('addBtn');if(!b||b.dataset.nxBound)return;if(b.textContent.includes('Added')||b.disabled)return;b.dataset.nxBound='1';const old=b.onclick;b.onclick=async e=>{if(old)await old.call(b,e);const item=b.closest('.item');const small=item?.querySelector('small')?.textContent||'';const m=small.match(/(\d{6})/);if(m){const pr=await dbx.from('profiles').select('id').eq('chat_id',m[1]).maybeSingle();if(pr.data){window.__nexaMeId=window.__nexaMeId||'';messageAfterAdd(pr.data.id);}}};}
 function wire(){const w=$('whatsappMode'),n=$('whatsappNumber'),s=$('send');if(w&&n&&s){n.onclick=save;if(!s.__nxOld)s.__nxOld=s.onclick;w.onclick=()=>{window.__nxWa=!window.__nxWa;w.classList.toggle('wa-active',window.__nxWa);w.textContent=window.__nxWa?'WA ✓':'WA';$('text').placeholder=window.__nxWa?'WhatsApp message…':'Message…';toast(window.__nxWa?'WhatsApp mode ON':'Nexa mode ON',window.__nxWa?'WA# se recipient number save karo':'Message NEXA mein jayega')};s.onclick=()=>window.__nxWa?send():s.__nxOld?.()};watchAdd()}
 setInterval(wire,400);
})();