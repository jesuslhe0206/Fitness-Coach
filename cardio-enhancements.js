(()=>{
  const mode=document.getElementById('cardio_mode');
  const minutes=document.getElementById('cardio_minutes');
  const hr=document.getElementById('cardio_hr');
  const rpe=document.getElementById('cardio_rpe');
  const discomfort=document.getElementById('cardio_discomfort');
  const done=document.getElementById('cardio_done');
  if(!mode||!minutes||!hr||!rpe||!discomfort)return;

  const style=document.createElement('style');
  style.textContent=`
    .cardio-subblock{padding:12px;border:1px solid var(--line);border-radius:12px;background:#f8fafc;margin:10px 0}
    .cardio-subblock-title{font-size:13px;font-weight:800;margin-bottom:9px}
    .cardio-mode-chips{display:flex;gap:7px;overflow-x:auto;padding:2px 0 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .cardio-mode-chips::-webkit-scrollbar{display:none}
    .cardio-mode-chip{flex:0 0 auto;padding:9px 11px;border:1px solid #d7dce2;border-radius:999px;background:#fff;color:#111827;font-size:12px;font-weight:700}
    .cardio-mode-chip.active{background:#111827;color:#fff;border-color:#111827}
    .cardio-rpe-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:5px;margin-top:8px}
    .cardio-rpe-btn{padding:8px 0;border:1px solid #d7dce2;border-radius:9px;background:#fff;color:#111827;font-size:12px;font-weight:800}
    .cardio-rpe-btn.active{background:#111827;color:#fff;border-color:#111827}
    .cardio-prev{font-size:11px;color:var(--muted);margin-top:4px}
    .cardio-summary{font-size:12px;color:var(--muted);font-weight:600;margin-left:7px}
    @media(max-width:620px){.cardio-rpe-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const section=mode.closest('section.card');
  const details=mode.closest('details.section-collapse')||section?.querySelector('details.section-collapse');
  if(!section||!details)return;

  const grid=mode.closest('.grid');
  if(grid&&!document.getElementById('cardio_activity_block')){
    const activity=document.createElement('div');
    activity.id='cardio_activity_block';
    activity.className='cardio-subblock';
    activity.innerHTML='<div class="cardio-subblock-title">Actividad</div><div class="cardio-mode-chips" id="cardio_mode_chips"></div>';
    grid.insertAdjacentElement('beforebegin',activity);

    const intensity=document.createElement('div');
    intensity.id='cardio_intensity_block';
    intensity.className='cardio-subblock';
    intensity.innerHTML='<div class="cardio-subblock-title">Intensidad y tolerancia</div>';
    grid.insertAdjacentElement('afterend',intensity);

    const rpeParent=rpe.closest('div');
    const discomfortParent=discomfort.closest('div');
    if(rpeParent)intensity.appendChild(rpeParent);
    if(discomfortParent)intensity.appendChild(discomfortParent);
  }

  function recordValue(r,keys){
    for(const k of keys){
      if(r&&r[k]!==undefined&&r[k]!==null&&String(r[k]).trim()!=='')return r[k];
    }
    return '';
  }
  function previousCardio(){
    try{
      if(typeof getRecords!=='function')return null;
      const records=getRecords().slice().sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
      return records.find(r=>recordValue(r,['cardio_modalidad','cardio_mode','modalidad_cardio'])||recordValue(r,['cardio_minutos','cardio_minutes','minutos_cardio']))||null;
    }catch{return null;}
  }

  const prev=previousCardio();
  const prevMinutes=recordValue(prev,['cardio_minutos','cardio_minutes','minutos_cardio']);
  const prevHr=recordValue(prev,['cardio_fc_promedio','cardio_hr','fc_promedio_cardio']);
  if(prevMinutes&&minutes.parentElement&&!minutes.parentElement.querySelector('.cardio-prev')){
    const x=document.createElement('div');x.className='cardio-prev';x.textContent=`Anterior: ${prevMinutes} min`;minutes.insertAdjacentElement('afterend',x);
  }
  if(prevHr&&hr.parentElement&&!hr.parentElement.querySelector('.cardio-prev')){
    const x=document.createElement('div');x.className='cardio-prev';x.textContent=`Anterior: ${prevHr} lpm`;hr.insertAdjacentElement('afterend',x);
  }

  const defaultModes=['Caminata','Bicicleta','Elíptica','Remo'];
  const recentModes=[];
  try{
    if(typeof getRecords==='function'){
      getRecords().slice().sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')).forEach(r=>{
        const v=String(recordValue(r,['cardio_modalidad','cardio_mode','modalidad_cardio'])||'').trim();
        if(v&&!recentModes.some(x=>x.toLowerCase()===v.toLowerCase()))recentModes.push(v);
      });
    }
  }catch{}
  const modes=[...recentModes,...defaultModes].filter((v,i,a)=>a.findIndex(x=>x.toLowerCase()===v.toLowerCase())===i).slice(0,8);
  const chipRoot=document.getElementById('cardio_mode_chips');
  function syncModeChips(){
    chipRoot?.querySelectorAll('.cardio-mode-chip').forEach(b=>b.classList.toggle('active',b.dataset.value.toLowerCase()===mode.value.trim().toLowerCase()));
  }
  if(chipRoot){
    modes.forEach(v=>{
      const b=document.createElement('button');b.type='button';b.className='cardio-mode-chip';b.dataset.value=v;b.textContent=v;
      b.onclick=()=>{mode.value=v;if(done)done.checked=true;syncModeChips();updateSummary();};chipRoot.appendChild(b);
    });
  }
  mode.addEventListener('input',()=>{syncModeChips();updateSummary();});
  syncModeChips();

  const rpeInputParent=rpe.parentElement;
  if(rpeInputParent&&!document.getElementById('cardio_rpe_buttons')){
    const box=document.createElement('div');box.id='cardio_rpe_buttons';box.className='cardio-rpe-grid';
    for(let i=1;i<=10;i++){
      const b=document.createElement('button');b.type='button';b.className='cardio-rpe-btn';b.dataset.value=String(i);b.textContent=String(i);
      b.onclick=()=>{rpe.value=String(i);if(done)done.checked=true;syncRpe();updateSummary();};box.appendChild(b);
    }
    rpe.insertAdjacentElement('afterend',box);
  }
  function syncRpe(){
    document.querySelectorAll('#cardio_rpe_buttons .cardio-rpe-btn').forEach(b=>b.classList.toggle('active',b.dataset.value===rpe.value));
  }
  rpe.addEventListener('input',()=>{syncRpe();updateSummary();});
  syncRpe();

  const summary=details.querySelector(':scope > summary');
  let summaryText=document.getElementById('cardio_summary_text');
  if(summary&&!summaryText){summaryText=document.createElement('span');summaryText.id='cardio_summary_text';summaryText.className='cardio-summary';summary.appendChild(summaryText);}
  function updateSummary(){
    if(!summaryText)return;
    const parts=[];
    if(mode.value.trim())parts.push(mode.value.trim());
    if(minutes.value)parts.push(`${minutes.value} min`);
    if(hr.value)parts.push(`${hr.value} lpm`);
    if(rpe.value)parts.push(`RPE ${rpe.value}`);
    summaryText.textContent=parts.length?'· '+parts.join(' · '):'';
  }
  [minutes,hr].forEach(el=>el.addEventListener('input',updateSummary));
  updateSummary();
})();
