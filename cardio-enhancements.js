(()=>{
  const mode=document.getElementById('cardio_mode');
  const minutes=document.getElementById('cardio_minutes');
  const hr=document.getElementById('cardio_hr');
  const rpe=document.getElementById('cardio_rpe');
  const discomfort=document.getElementById('cardio_discomfort');
  const done=document.getElementById('cardio_done');
  if(!mode||!minutes||!hr||!rpe||!discomfort)return;

  const CARDIO_LIBRARY=[
    {category:'En casa / sin equipo',name:'Jumping Jacks',intensity:'Media',calories:'~260 kcal',level:'Bajo',muscles:'Pantorrillas, hombros y core',impact:'Medio',equipment:'Sin equipo',precaution:'Tobillos',image:'/cardio/en-casa/jumping-jacks.png'},
    {category:'En casa / sin equipo',name:'Burpees',intensity:'Muy alta',calories:'~350 kcal',level:'Alto',muscles:'Pectorales, tríceps, hombros y core',impact:'Alto',equipment:'Sin equipo',precaution:'Zona lumbar y muñecas',image:'/cardio/en-casa/burpees.png'},
    {category:'En casa / sin equipo',name:'Mountain Climbers',intensity:'Media-alta',calories:'~280 kcal',level:'Medio',muscles:'Core, hombros y flexores de cadera',impact:'Bajo-Medio',equipment:'Sin equipo',precaution:'Muñecas y hombros',image:'/cardio/en-casa/mountain-climbers.png'},
    {category:'En casa / sin equipo',name:'High Knees',intensity:'Alta',calories:'~310 kcal',level:'Bajo',muscles:'Flexores de cadera, core y pantorrillas',impact:'Alto',equipment:'Sin equipo',precaution:'Tobillos y postura',image:'/cardio/en-casa/high-knees.png'},
    {category:'En casa / sin equipo',name:'Saltos en tijera',intensity:'Media-alta',calories:'~290 kcal',level:'Medio',muscles:'Cuádriceps, glúteos, pantorrillas y core',impact:'Alto',equipment:'Sin equipo',precaution:'Rodillas y tobillos',image:'/cardio/en-casa/saltos-en-tijera.png'},
    {category:'En casa / sin equipo',name:'Talones al glúteo',intensity:'Media',calories:'~220 kcal',level:'Bajo',muscles:'Isquiotibiales, pantorrillas y core',impact:'Bajo',equipment:'Sin equipo',precaution:'Tendón de la corva y coordinación',image:'/cardio/en-casa/talones-al-gluteo.png'},
    {category:'Aire libre / máquinas',name:'Correr (10 km/h)',intensity:'Alta',calories:'~370 kcal',level:'Bajo',muscles:'Abdomen, pantorrillas, glúteos y cuádriceps',impact:'Alto',equipment:'Espacio para correr o caminadora',precaution:'Rodillas y tobillos',image:'/cardio/aire-libre-maquinas/correr-10-kmh.png'},
    {category:'Aire libre / máquinas',name:'Saltar la cuerda',intensity:'Muy alta',calories:'~400 kcal',level:'Medio-alto',muscles:'Pantorrillas, hombros, antebrazos y core',impact:'Alto',equipment:'Cuerda',precaution:'Tobillos y tendones',image:'/cardio/aire-libre-maquinas/saltar-la-cuerda.png'},
    {category:'Aire libre / máquinas',name:'Máquina elíptica',intensity:'Media',calories:'~300 kcal',level:'Bajo',muscles:'Glúteos, cuádriceps, isquiotibiales y brazos',impact:'Bajo',equipment:'Máquina elíptica',precaution:'Sobrecarga por volumen',image:'/cardio/aire-libre-maquinas/maquina-eliptica.png'},
    {category:'Aire libre / máquinas',name:'Ciclismo (>20 km/h)',intensity:'Media-alta',calories:'~330 kcal',level:'Bajo-Medio',muscles:'Cuádriceps, glúteos, pantorrillas y core',impact:'Bajo',equipment:'Bicicleta',precaution:'Zona lumbar y cuello',image:'/cardio/aire-libre-maquinas/ciclismo-20-kmh.png'},
    {category:'Aire libre / máquinas',name:'Remo (máquina)',intensity:'Alta',calories:'~310 kcal',level:'Alto',muscles:'Espalda, core, bíceps y piernas',impact:'Bajo',equipment:'Máquina de remo',precaution:'Técnica lumbar',image:'/cardio/aire-libre-maquinas/remo-maquina.png'},
    {category:'Aire libre / máquinas',name:'Subir escaleras',intensity:'Alta',calories:'~340 kcal',level:'Bajo',muscles:'Glúteos, cuádriceps, pantorrillas y core',impact:'Medio-Alto',equipment:'Escaleras o escaladora',precaution:'Rodillas',image:'/cardio/aire-libre-maquinas/subir-escaleras.png'},
    {category:'Deportes / dinámicas',name:'Boxeo de sombra',intensity:'Media-alta',calories:'~260 kcal',level:'Medio',muscles:'Hombros, espalda, core y piernas',impact:'Bajo',equipment:'Sin equipo (opcional guantes)',precaution:'Hombros y técnica',image:'/cardio/deportes-dinamicas/boxeo-de-sombra.png'},
    {category:'Deportes / dinámicas',name:'Natación (crol)',intensity:'Alta',calories:'~370 kcal',level:'Alto',muscles:'Dorsales, hombros, core, glúteos y piernas',impact:'Bajo',equipment:'Alberca',precaution:'Hombros y técnica respiratoria',image:'/cardio/deportes-dinamicas/natacion-crol.png'},
    {category:'Deportes / dinámicas',name:'Bailar (intenso)',intensity:'Media',calories:'~240 kcal',level:'Medio',muscles:'Core, pantorrillas, glúteos y piernas',impact:'Medio',equipment:'Espacio libre (opcional música)',precaution:'Control de intensidad',image:'/cardio/deportes-dinamicas/bailar-intenso.png'},
    {category:'Deportes / dinámicas',name:'Pádel',intensity:'Media-alta',calories:'~235 kcal',level:'Medio-bajo',muscles:'Glúteos, core, pantorrillas y hombros',impact:'Medio',equipment:'Raqueta, pelotas y cancha',precaution:'Giros y frenados bruscos',image:'/cardio/deportes-dinamicas/padel.png'},
    {category:'Deportes / dinámicas',name:'Tenis (individual)',intensity:'Alta',calories:'~270 kcal',level:'Alto',muscles:'Hombros, antebrazos, core y piernas',impact:'Medio-Alto',equipment:'Raqueta, pelotas y cancha',precaution:'Codo y sobreuso',image:'/cardio/deportes-dinamicas/tenis-individual.png'}
  ];

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
    .cardio-library-launch{width:100%;margin-top:10px}
    .cardio-library-list{display:grid;gap:14px}
    .cardio-library-group h4{margin:0 0 8px;font-size:14px}
    .cardio-library-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .cardio-library-item{border:1px solid var(--line);border-radius:11px;padding:10px;background:#fff}
    .cardio-library-item strong{display:block;font-size:13px;margin-bottom:4px}
    .cardio-library-meta{font-size:11px;color:var(--muted);line-height:1.4}
    .cardio-library-actions{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
    .cardio-library-actions button{padding:7px 8px;font-size:11px;flex:1 1 auto}
    .cardio-card-image{width:100%;height:auto;border-radius:12px;border:1px solid var(--line);display:block}
    .cardio-card-meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
    .cardio-card-meta div{border:1px solid var(--line);border-radius:10px;padding:9px;background:#f8fafc}
    .cardio-card-meta b{display:block;font-size:11px;margin-bottom:3px}
    .cardio-card-meta span{font-size:12px;color:#374151}
    .cardio-estimate-note{font-size:11px;color:var(--muted);line-height:1.45;margin-top:10px}
    @media(max-width:620px){.cardio-rpe-grid{grid-template-columns:repeat(5,minmax(0,1fr))}.cardio-library-grid,.cardio-card-meta{grid-template-columns:1fr}}
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
    activity.innerHTML='<div class="cardio-subblock-title">Actividad</div><div class="cardio-mode-chips" id="cardio_mode_chips"></div><button type="button" class="primary cardio-library-launch" id="open_cardio_library">Ver biblioteca de cardio</button>';
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

  function createModal(id,title){
    let modal=document.getElementById(id);
    if(modal)return modal;
    modal=document.createElement('div');
    modal.className='modal';
    modal.id=id;
    modal.innerHTML=`<div class="modal-card"><div class="modal-head"><h3>${title}</h3><button type="button" class="secondary close-btn">Cerrar</button></div><div class="modal-body"></div></div>`;
    modal.querySelector('.close-btn').onclick=()=>modal.classList.remove('open');
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
    document.body.appendChild(modal);
    return modal;
  }

  function selectCardio(item){
    mode.value=item.name;
    if(done)done.checked=true;
    syncModeChips();
    updateSummary();
    const outer=mode.closest('details.section-collapse');
    if(outer)outer.open=true;
    if(typeof showStatus==='function')showStatus(`${item.name} seleccionado como modalidad de cardio.`);
  }

  const libraryModal=createModal('cardio_library_modal','Biblioteca de cardio');
  const cardModal=createModal('cardio_card_modal','Ficha de cardio');

  function renderLibrary(){
    const body=libraryModal.querySelector('.modal-body');
    body.innerHTML='<div class="cardio-estimate-note" style="margin-bottom:12px">Los valores de gasto calórico son estimados de referencia para 30 min en una persona de ~70 kg; pueden variar según peso, intensidad, técnica y condición física.</div><div class="cardio-library-list"></div>';
    const root=body.querySelector('.cardio-library-list');
    [...new Set(CARDIO_LIBRARY.map(x=>x.category))].forEach(category=>{
      const group=document.createElement('div');
      group.className='cardio-library-group';
      group.innerHTML=`<h4>${category}</h4><div class="cardio-library-grid"></div>`;
      const grid=group.querySelector('.cardio-library-grid');
      CARDIO_LIBRARY.filter(x=>x.category===category).forEach(item=>{
        const card=document.createElement('div');
        card.className='cardio-library-item';
        card.innerHTML=`<strong>${item.name}</strong><div class="cardio-library-meta">${item.intensity} · ${item.calories} · Impacto ${item.impact}</div><div class="cardio-library-actions"></div>`;
        const actions=card.querySelector('.cardio-library-actions');
        const select=document.createElement('button');
        select.type='button';select.className='primary';select.textContent='Seleccionar';
        select.onclick=()=>{selectCardio(item);libraryModal.classList.remove('open');};
        const view=document.createElement('button');
        view.type='button';view.className='secondary';view.textContent='Ver ficha';
        view.onclick=()=>openCard(item);
        actions.append(select,view);
        grid.appendChild(card);
      });
      root.appendChild(group);
    });
  }

  function openCard(item){
    const body=cardModal.querySelector('.modal-body');
    body.innerHTML=`
      <img class="cardio-card-image" src="${item.image}" alt="Ficha de ${item.name}">
      <div class="cardio-card-meta">
        <div><b>Intensidad</b><span>${item.intensity}</span></div>
        <div><b>Gasto calórico estimado</b><span>${item.calories} / 30 min / ~70 kg</span></div>
        <div><b>Nivel técnico</b><span>${item.level}</span></div>
        <div><b>Músculos involucrados</b><span>${item.muscles}</span></div>
        <div><b>Impacto articular</b><span>${item.impact}</span></div>
        <div><b>Equipo</b><span>${item.equipment}</span></div>
        <div class="full"><b>Precaución principal</b><span>${item.precaution}</span></div>
      </div>
      <div class="cardio-estimate-note">Valores estimados de referencia; pueden variar según peso, intensidad, técnica y condición física.</div>
      <button type="button" class="primary" id="select_cardio_from_card" style="width:100%;margin-top:12px">Seleccionar ${item.name}</button>`;
    body.querySelector('#select_cardio_from_card').onclick=()=>{selectCardio(item);cardModal.classList.remove('open');libraryModal.classList.remove('open');};
    cardModal.querySelector('.modal-head h3').textContent=item.name;
    cardModal.classList.add('open');
  }

  const openLibrary=document.getElementById('open_cardio_library');
  if(openLibrary)openLibrary.onclick=()=>{renderLibrary();libraryModal.classList.add('open');};
})();
