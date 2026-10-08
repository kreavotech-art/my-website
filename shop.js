/* Kreavo Tech shop page: catalogue, search, filters */
  // ====== SHOP SETTINGS (edit these) ======
  const PHOTO_BASE = 'img/'; // product photos load from this folder (see photo_shotlist.csv); '' turns photos off
  const PAGE = 24;         // products shown per "Load more"
  // ========================================

  const DATA = window.SHOP_DATA;
  const CATS = DATA.cats, BRANDS = DATA.brands;

  const ITEMS = DATA.rows.map((r,i) => {
    const brand = r[3] >= 0 ? BRANDS[r[3]] : '';
    return { id:i, sku:r[0], name:r[1], spec:r[2], brand, cat:CATS[r[4]], tag:r[5],
             h:(r[0]+' '+r[1]+' '+r[2]+' '+brand + ((brand==='Lenovo' && /\b[txlep]\d{2}[a-z]?\b/i.test(r[1]) && (CATS[r[4]]==='Laptops'||CATS[r[4]]==='Workstations')) ? ' thinkpad' : '') + ' ' + (r[1]+' '+r[2]).replace(/(\d+(?:\.\d+)?)\s?"/g,'$1 inch')).toLowerCase() };
  });

  const ORDER = ['Laptops','Monitors','Desktops','Workstations','Networking','Servers & Storage','Printers & Projectors','Meeting Rooms & Video','Headsets & Phones','Commercial Displays','Security & CCTV','Power & UPS','Accessories','Cables','Components','Tablets & Mobile','Cameras','Software'];
  const CAT_ORDER = ORDER.filter(c => CATS.includes(c)).concat(CATS.filter(c => !ORDER.includes(c)));
  const catRank = Object.fromEntries(CAT_ORDER.map((c,i)=>[c,i]));

  // ---- illustrations (placeholder until real photos are added) ----
  const P='#5B0E86', N='#1C2B6E', T='#0AA89B', A='#B5722E';
  const SH = {
    laptop:  c=>`<rect x="20" y="8" width="80" height="52" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="26" y="14" width="68" height="40" fill="${c}" opacity=".12"/><path d="M8 68h104l-8 12H16z" fill="${c}" opacity=".85"/>`,
    monitor: c=>`<rect x="14" y="8" width="92" height="58" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="20" y="14" width="80" height="46" fill="${c}" opacity=".12"/><rect x="52" y="66" width="16" height="12" fill="${c}" opacity=".85"/><rect x="38" y="78" width="44" height="4" rx="2" fill="${c}" opacity=".85"/>`,
    tower:   c=>`<rect x="34" y="6" width="52" height="78" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="60" cy="20" r="3" fill="${c}"/><rect x="42" y="36" width="36" height="34" fill="${c}" opacity=".12"/>`,
    router:  c=>`<rect x="20" y="40" width="80" height="28" rx="5" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="34" cy="54" r="3" fill="${c}"/><circle cx="46" cy="54" r="3" fill="${c}"/><circle cx="58" cy="54" r="3" fill="${c}"/><path d="M60 40V22M60 22l-14 8M60 22l14 8" stroke="${c}" stroke-width="2" fill="none"/>`,
    cam:     c=>`<circle cx="60" cy="38" r="24" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="60" cy="38" r="9" fill="${c}"/><rect x="38" y="66" width="44" height="10" rx="3" fill="${c}" opacity=".85"/>`,
    server:  c=>`<rect x="18" y="12" width="84" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="18" y="38" width="84" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="18" y="64" width="84" height="20" rx="3" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="30" cy="22" r="2.5" fill="${c}"/><circle cx="30" cy="48" r="2.5" fill="${c}"/><circle cx="30" cy="74" r="2.5" fill="${c}"/>`,
    printer: c=>`<rect x="34" y="12" width="52" height="24" fill="${c}" opacity=".12" stroke="${c}" stroke-width="2"/><rect x="18" y="34" width="84" height="32" rx="5" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="34" y="58" width="52" height="24" fill="#fff" stroke="${c}" stroke-width="2.5"/>`,
    bar:     c=>`<rect x="8" y="34" width="104" height="24" rx="12" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="60" cy="46" r="6" fill="${c}"/><circle cx="30" cy="46" r="2.5" fill="${c}" opacity=".6"/><circle cx="90" cy="46" r="2.5" fill="${c}" opacity=".6"/>`,
    headset: c=>`<path d="M28 54A32 32 0 0 1 92 54" fill="none" stroke="${c}" stroke-width="3"/><rect x="20" y="50" width="16" height="28" rx="6" fill="${c}" opacity=".85"/><rect x="84" y="50" width="16" height="28" rx="6" fill="${c}" opacity=".85"/>`,
    bolt:    c=>`<rect x="20" y="24" width="80" height="46" rx="6" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M64 30L50 50h10l-4 14 16-22H62z" fill="${c}"/>`,
    mouse:   c=>`<rect x="40" y="10" width="40" height="70" rx="20" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M60 10v26M40 36h40" stroke="${c}" stroke-width="2"/>`,
    cable:   c=>`<path d="M16 62C40 6 80 112 104 28" fill="none" stroke="${c}" stroke-width="3.5"/><rect x="6" y="56" width="14" height="12" rx="2" fill="${c}"/><rect x="100" y="22" width="14" height="12" rx="2" fill="${c}"/>`,
    chip:    c=>`<rect x="30" y="20" width="60" height="50" rx="4" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="42" y="31" width="36" height="28" fill="${c}" opacity=".14"/><path d="M90 32h10M90 45h10M90 58h10M20 32h10M20 45h10M20 58h10" stroke="${c}" stroke-width="2"/>`,
    tablet:  c=>`<rect x="30" y="8" width="60" height="74" rx="7" fill="none" stroke="${c}" stroke-width="2.5"/><rect x="36" y="16" width="48" height="54" fill="${c}" opacity=".12"/><circle cx="60" cy="76" r="2.5" fill="${c}"/>`,
    disc:    c=>`<circle cx="60" cy="45" r="30" fill="none" stroke="${c}" stroke-width="2.5"/><circle cx="60" cy="45" r="9" fill="${c}" opacity=".85"/>`,
  };
  const GROUP = {
    'Laptops':['laptop',P,'#E9DFF4,#D8C7EC'], 'Tablets & Mobile':['tablet',P,'#E9DFF4,#D8C7EC'], 'Desktops':['tower',P,'#E9DFF4,#D8C7EC'], 'Workstations':['tower',P,'#E9DFF4,#D8C7EC'],
    'Monitors':['monitor',N,'#DCE3F7,#C7D2F0'], 'Commercial Displays':['monitor',N,'#DCE3F7,#C7D2F0'], 'Servers & Storage':['server',N,'#DCE3F7,#C7D2F0'], 'Software':['disc',N,'#DCE3F7,#C7D2F0'],
    'Networking':['router',T,'#D8F5F1,#BEEDE6'], 'Security & CCTV':['cam',T,'#D8F5F1,#BEEDE6'], 'Meeting Rooms & Video':['bar',T,'#D8F5F1,#BEEDE6'],
    'Printers & Projectors':['printer',P,'#E9DFF4,#D8C7EC'], 'Headsets & Phones':['headset',P,'#E9DFF4,#D8C7EC'], 'Cameras':['cam',P,'#E9DFF4,#D8C7EC'],
    'Power & UPS':['bolt',A,'#F4E9DF,#EBD6C1'], 'Accessories':['mouse',A,'#F4E9DF,#EBD6C1'], 'Cables':['cable',A,'#F4E9DF,#EBD6C1'], 'Components':['chip',A,'#F4E9DF,#EBD6C1'],
  };
  function art(cat, w){
    const g = GROUP[cat] || GROUP['Components'];
    return `<div class="ph" style="background:linear-gradient(135deg,${g[2]})"><svg viewBox="0 0 120 90" width="${w||60}%">${SH[g[0]](g[1])}</svg></div>`;
  }

  // ---- state / filtering ----
  const S = { cat:'', brand:'', q:'', sort:'featured', shown:PAGE, list:[] };
  let searchTimer;

  function matches(p, ignoreCat){
    if(!ignoreCat && S.cat && p.cat !== S.cat) return false;
    if(S.brand && p.brand !== S.brand) return false;
    if(S.q){ for(const t of S.q) if(p.h.indexOf(t) === -1) return false; }
    return true;
  }
  function apply(){
    let list = ITEMS.filter(p => matches(p,false));
    S.fuzzy = false;
    if(!list.length && S.q && S.q.length > 1){
      const need = Math.ceil(S.q.length / 2), sc = new Map();
      for(const p of ITEMS){
        if((S.cat && p.cat !== S.cat) || (S.brand && p.brand !== S.brand)) continue;
        let n = 0; for(const t of S.q) if(p.h.indexOf(t) !== -1) n++;
        if(n >= need){ sc.set(p.id, n); list.push(p); }
      }
      list.sort((a,b)=> sc.get(b.id) - sc.get(a.id));
      S.fuzzy = list.length > 0;
    }
    const by = S.sort;
    if(S.fuzzy){} else if(by === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    else if(!S.fuzzy) list.sort((a,b)=> (a.tag?1:0)-(b.tag?1:0) || catRank[a.cat]-catRank[b.cat] || a.name.localeCompare(b.name));
    S.list = list; S.shown = PAGE;
    render();
  }
  function renderChips(){
    const counts = {}; let total = 0;
    for(const p of ITEMS){ if(matches(p,true)){ counts[p.cat] = (counts[p.cat]||0)+1; total++; } }
    let html = `<button class="chip ${S.cat===''?'on':''}" onclick="setCat('')">All<b>${total.toLocaleString()}</b></button>`;
    for(const c of CAT_ORDER){ if(!counts[c]) continue; html += `<button class="chip ${S.cat===c?'on':''}" onclick="setCat('${c.replace(/'/g,"\\'")}')">${esc(c)}<b>${counts[c].toLocaleString()}</b></button>`; }
    document.getElementById('chips').innerHTML = html;
  }
  function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''); }
  // photo lookup order: exact product, then brand + category, then category, then the illustration
  function photoChain(p){ return [PHOTO_BASE+'sku/'+encodeURIComponent(p.sku)+'.jpg', PHOTO_BASE+'brand/'+slug(p.brand||'other')+'-'+slug(p.cat)+'.jpg', PHOTO_BASE+'cat/'+slug(p.cat)+'.jpg']; }
  function nextPhoto(img){ const c = JSON.parse(img.dataset.c), i = (+img.dataset.i) + 1; if(i >= c.length){ img.remove(); return; } img.dataset.i = i; img.src = c[i]; }
  function card(p){
    const chain = photoChain(p);
    const photo = PHOTO_BASE ? `<img loading="lazy" alt="${esc(p.name)}" data-i="0" data-c="${esc(JSON.stringify(chain))}" src="${esc(chain[0])}" onerror="nextPhoto(this)">` : '';
    return `<div class="prod-card">
      <div class="prod-media">${art(p.cat)}${photo}<span class="prod-tag">${esc(p.brand || p.cat)}</span>${p.tag?`<span class="badge-t">${p.tag}</span>`:''}</div>
      <div class="prod-body">
        <h4 class="prod-name" title="${esc(p.name)}">${esc(p.name)}</h4>
        ${p.spec?`<div class="prod-spec" title="${esc(p.spec)}">${esc(p.spec)}</div>`:''}
        <div class="sku">SKU ${esc(p.sku)}</div>
        <div class="prod-row">
          <span class="price" style="font-size:12.5px;font-family:'IBM Plex Sans',sans-serif;font-weight:500;color:var(--purple)">Quote on request</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Add to quote</button>
        </div>
      </div></div>`;
  }
  function render(){
    renderChips();
    const grid = document.getElementById('prodGrid');
    const slice = S.list.slice(0, S.shown);
    grid.innerHTML = slice.length ? slice.map(card).join('') : '<div class="no-results">No products match that search. Try fewer words or another category.</div>';
    document.getElementById('resultCount').textContent = (S.fuzzy ? 'No exact match, showing closest results · ' : '') + `Showing ${slice.length.toLocaleString()} of ${S.list.length.toLocaleString()} products`;
    document.getElementById('moreBtn').style.display = S.shown < S.list.length ? '' : 'none';
  }
  function showMore(){ S.shown += PAGE; render(); }
  function setCat(c){ S.cat = c; apply(); }
  function goCat(c){ S.cat = c; S.q=''; document.getElementById('q').value=''; apply(); }
  function focusSearch(){ document.getElementById('shop').scrollIntoView({behavior:'smooth'}); setTimeout(()=>document.getElementById('q').focus(), 450); }
  function onSearch(){ clearTimeout(searchTimer); searchTimer = setTimeout(()=>{ S.q = document.getElementById('q').value.toLowerCase().split(/\s+/).filter(Boolean); if(S.q.length) S.cat=''; apply(); }, 180); }
  function onFilter(){ S.brand = document.getElementById('brandSel').value; S.sort = document.getElementById('sortSel').value; apply(); }


  function addToCart(id){ const p = ITEMS[id]; addToQuote({ sku:p.sku, name:p.name, cat:p.cat }); }

  (function init(){
    const bs = document.getElementById('brandSel');
    BRANDS.forEach(b => { const o = document.createElement('option'); o.value = b; o.textContent = b; bs.appendChild(o); });
    document.getElementById('shopIntro').textContent = ITEMS.length.toLocaleString() + ' products from Dell, HP, Lenovo, ASUS, Cisco, Ubiquiti and more. Add what you need and we will send you a quote.';
    const params = new URLSearchParams(location.search);
    if(params.get('cat') && CATS.includes(params.get('cat'))) S.cat = params.get('cat');
    if(params.get('q')){ document.getElementById('q').value = params.get('q'); S.q = params.get('q').toLowerCase().split(/\s+/).filter(Boolean); }
    apply();
    if(location.hash === '#search') setTimeout(()=>document.getElementById('q').focus(), 200);
  })();
