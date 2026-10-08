/* Kreavo Tech shared code: quote list, forms, menu */
const QUOTE_EMAIL = 'info@kreavotech.com';
const Q_KEY = 'kt_quote_v1';
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

let cart = [];   // quote list: [{sku, name, cat, qty}] kept in the browser so it follows the visitor between pages
try{ cart = JSON.parse(localStorage.getItem(Q_KEY) || '[]'); if(!Array.isArray(cart)) cart = []; }catch(e){ cart = []; }
function saveCart(){ try{ localStorage.setItem(Q_KEY, JSON.stringify(cart)); }catch(e){} }

function addToQuote(it){
  const ex = cart.find(i => i.sku === it.sku);
  if(ex) ex.qty++; else cart.push({ sku:it.sku, name:it.name, cat:it.cat || '', qty:1 });
  saveCart(); renderCart(); showToast('Added to quote list');
}
function changeQty(idx, d){
  const it = cart[idx]; if(!it) return;
  it.qty += d; if(it.qty <= 0) cart.splice(idx, 1);
  saveCart(); renderCart();
}
function renderCart(){
  const count = cart.reduce((s,i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge'); if(badge) badge.textContent = count;
  const wrap = document.getElementById('cartItems'); if(!wrap) return;
  if(!cart.length){ wrap.innerHTML = '<div class="cart-empty">Your quote list is empty.<br>Add products and we will send you pricing.</div>'; }
  else wrap.innerHTML = cart.map((i, idx) => `<div class="cart-item">
      <div class="cart-item-thumb"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg></div>
      <div class="cart-item-info">
        <h5>${esc(i.name)}</h5>
        <div class="sku">SKU ${esc(i.sku)}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">&minus;</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          <span class="remove-link" onclick="changeQty(${idx}, -${i.qty})">Remove</span>
        </div></div></div>`).join('');
  const note = document.getElementById('quoteItemsNote');
  if(note) note.textContent = cart.length ? (count + ' item(s) in your quote list') : '';
}
function openCart(){ document.getElementById('overlay').classList.add('show'); document.getElementById('cartDrawer').classList.add('show'); }
function checkout(){
  if(!cart.length){ showToast('Add a product first'); return; }
  document.getElementById('cartDrawer').classList.remove('show');
  document.getElementById('quoteSummary').innerHTML = cart.map(i => i.qty + ' x ' + esc(i.name)).join('<br>');
  document.getElementById('checkoutModal').classList.add('show');
}
function openQuote(service){
  document.getElementById('quoteService').value = service;
  document.getElementById('quoteSub').textContent = 'Requesting a quote for: ' + service;
  document.getElementById('overlay').classList.add('show');
  document.getElementById('quoteModal').classList.add('show');
}
function closeAll(){ ['overlay','cartDrawer','quoteModal','checkoutModal'].forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('show'); }); }
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeAll(); });

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast'); if(!t) return;
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function toggleNav(){ document.getElementById('navlinks').classList.toggle('open'); }
function goSearch(){
  const q = document.getElementById('q');
  if(q){ q.scrollIntoView({behavior:'smooth', block:'center'}); setTimeout(() => q.focus(), 450); }
  else location.href = 'shop.html#search';
}

/* ---- sending quote requests by email (via FormSubmit) ---- */
async function sendQuote(fields, btn){
  const label = btn.textContent; btn.disabled = true; btn.textContent = 'Sending...';
  const body = Object.assign({ _subject:'Quote request from kreavotech.com', _template:'table', _captcha:'false' }, fields);
  if(/@/.test(fields.contact || '')) body._replyto = fields.contact;
  try{
    const r = await fetch('https://formsubmit.co/ajax/' + QUOTE_EMAIL, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(body) });
    const j = await r.json();
    return j.success === true || j.success === 'true';
  }catch(err){ return false; }
  finally{ btn.disabled = false; btn.textContent = label; }
}
function emailFallback(fields){
  const text = Object.entries(fields).filter(([k]) => k[0] !== '_').map(([k,v]) => k + ': ' + v).join('\n');
  showToast("Couldn't send online, opening your email app...");
  setTimeout(() => { location.href = 'mailto:' + QUOTE_EMAIL + '?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(text.slice(0,1800)); }, 900);
}
async function handleForm(e, extra, onOk){
  e.preventDefault(); const form = e.target;
  const fields = Object.assign(Object.fromEntries(new FormData(form).entries()), extra || {});
  const ok = await sendQuote(fields, form.querySelector('button[type=submit]'));
  if(ok){ form.reset(); if(onOk) onOk(); closeAll(); showToast("Sent. We'll be in touch shortly."); } else emailFallback(fields);
}
function submitQuote(e){ return handleForm(e); }
function submitContact(e){ return handleForm(e, { _subject:'Website enquiry from kreavotech.com' }); }
function submitItemQuote(e){
  if(!cart.length){ e.preventDefault(); showToast('Add a product first'); return; }
  return handleForm(e, { items: cart.map(i => i.qty + ' x ' + i.name + ' (SKU ' + i.sku + ')').join('\n') }, () => { cart = []; saveCart(); renderCart(); });
}

renderCart();
