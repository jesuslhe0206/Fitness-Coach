(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .section-collapse{border:0}
    .section-collapse>summary{font-size:17px;font-weight:750;padding:2px 0;cursor:pointer}
    .section-collapse>summary::marker{font-size:1.05em}
    .section-collapse[open]>summary{margin-bottom:14px}
    .measure-block+.measure-block{margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
    .quick-repeat{white-space:nowrap}
    .strength-shortcuts{margin:12px 0 4px;padding:12px;border:1px solid var(--line);border-radius:12px;background:#f8fafc}
    .strength-shortcuts-title{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
    .strength-shortcuts-title strong{font-size:13px}
    .strength-shortcuts-title small{font-size:11px;color:var(--muted)}
    .strength-chip-list{display:flex;gap:7px;overflow-x:auto;padding:2px 0 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .strength-chip-list::-webkit-scrollbar{display:none}
    .strength-chip{flex:0 0 auto;padding:9px 11px;border:1px solid #d7dce2;border-radius:999px;background:#fff;color:#111827;font-size:12px;font-weight:700}
    .strength-chip:active{transform:scale(.98)}
    .library-helper{font-size:12px;color:var(--muted);margin:-2px 0 10px;line-height:1.4}
    .library-item.added{border-color:#86a58f;background:#f3faf5}
    .library-item .added-label{font-size:11px;color:var(--ok);font-weight:700;margin-top:5px;display:block}
    @media(max-width:620px){.library-bar>.primary,.library-bar>.secondary{flex:1 1 calc(50% - 4px)}.library-bar .quick-repeat{flex-basis:100%}}
  `;
  document.head.appendChild(style);

  function makeCollapsible(section,title,contentNodes){
    const oldH=section.querySelector(':scope > h2');
    if(oldH)oldH.remove();
    const details=document.createElement('details');
    details.className='section-collapse';
    const summary=document.createElement('summary');
    summary.textContent=title;
    details.appendChild(summary);
    (contentNodes||[...section.childNodes]).forEach(n=>details.appendChild(n));
    section.appendChild(details);
    return details;
  }

  const form=document.getElementById('form');
  if(!form)return;
  const sections=[...form.querySelectorAll(':scope > section.card')];
  const weightSection=sections.find(s=>s.querySelector('#weight'));
  const waistSection=sections.find(s=>s.querySelector('#waist'));

  if(weightSection&&waistSection){
    const combined=document.createElement('section');
    combined.className='card';
    const details=document.createElement('details');
    details.className='section-collapse';
    const summary=document.createElement('summary');
    summary.textContent='1. Medidas corporales';
    details.appendChild(summary);

    [weightSection,waistSection].forEach(sec=>{
      const block=document.createElement('div');
      block.className='measure-block';
      [...sec.childNodes].forEach(n=>{
        if(n.nodeType===1&&n.tagName==='H2')return;
        block.appendChild(n);
      });
      details.appendChild(block);
    });

    combined.appendChild(details);
    weightSection.replaceWith(combined);
    waistSection.remove();
  }

  const titles=[
    ['#breakfast','2. Alimentación'],
    ['#strength_done','3. Entrenamiento de fuerza'],
    ['#cardio_done','4. Cardio'],
    ['#steps','5. Pasos'],
    ['#sleep_hours','6. Sueño y recuperación'],
    ['#wrist_pain','7. Dolor y lesiones'],
    ['#bp1_sys','8. Presión arterial'],
    ['#notes','9. Notas del día']
  ];

  titles.forEach(([selector,title])=>{
    const section=[...form.querySelectorAll(':scope > section.card')].find(s=>s.querySelector(selector));
    if(!section||section.querySelector(':scope > details.section-collapse'))return;

    const inner=section.querySelector(':scope > details#strength_details, :scope > details#cardio_details');
    if(inner){
      const nodes=[...inner.childNodes].filter(n=>!(n.nodeType===1&&n.tagName==='SUMMARY'));
      const h=section.querySelector(':scope > h2');
      if(h)h.remove();
      inner.remove();
      makeCollapsible(section,title,nodes);
    }else{
      makeCollapsible(section,title);
    }
  });

  const bar=document.querySelector('.library-bar');
  if(bar&&!document.getElementById('repeat_last_strength')){
    const btn=document.createElement('button');
    btn.type='button';
    btn.id='repeat_last_strength';
    btn.className='secondary quick-repeat';
    btn.textContent='↻ Repetir última sesión';
    btn.onclick=()=>{
      try{
        if(typeof getRecords!=='function'||typeof addExercise!=='function')throw new Error('Funciones no disponibles');
        const records=getRecords().filter(r=>Array.isArray(r.fuerza_ejercicios)&&r.fuerza_ejercicios.length).sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
        if(!records.length){
          if(typeof showStatus==='function')showStatus('Todavía no hay una sesión de fuerza anterior para reutilizar.',false);
          return;
        }
        const root=document.getElementById('exercises');
        if(root.children.length&&!confirm('Esto reemplazará los ejercicios que ya agregaste hoy. ¿Continuar?'))return;
        root.innerHTML='';
        records[0].fuerza_ejercicios.forEach(ex=>{
          let base=null;
          if(typeof BASE_EXERCISES!=='undefined')base=BASE_EXERCISES.find(x=>x.name.toLowerCase()===(ex.name||'').toLowerCase());
          addExercise({...base,...ex});
        });
        const done=document.getElementById('strength_done');
        if(done)done.checked=true;
        const outer=document.querySelector('#strength_done')?.closest('details.section-collapse');
        if(outer)outer.open=true;
        if(typeof showStatus==='function')showStatus(`Sesión de fuerza del ${records[0].fecha} cargada para reutilizar.`);
      }catch(e){
        if(typeof showStatus==='function')showStatus('No se pudo cargar la sesión anterior.',false);
      }
    };
    bar.appendChild(btn);
  }

  function resolveExerciseImage(item){
    if(item.image)return item.image;
    if(typeof BASE_EXERCISES!=='undefined'){
      const base=BASE_EXERCISES.find(x=>x.name.toLowerCase()===(item.name||'').toLowerCase());
      return base?.image||null;
    }
    return null;
  }

  function addQuickExercise(item){
    if(typeof addExercise!=='function')return;
    const data={...item,image:resolveExerciseImage(item)};
    addExercise(data);
    const done=document.getElementById('strength_done');
    if(done)done.checked=true;
    const outer=done?.closest('details.section-collapse');
    if(outer)outer.open=true;
    if(typeof showStatus==='function')showStatus(`${item.name} añadido.`);
  }

  function renderStrengthShortcuts(){
    if(!bar||typeof getFrequentExercises!=='function')return;
    let box=document.getElementById('strength_shortcuts');
    const items=getFrequentExercises();
    if(!items.length){if(box)box.remove();return;}
    if(!box){
      box=document.createElement('div');
      box.id='strength_shortcuts';
      box.className='strength-shortcuts';
      bar.insertAdjacentElement('afterend',box);
    }
    box.innerHTML='<div class="strength-shortcuts-title"><strong>Ejercicios frecuentes</strong><small>1 toque para añadir</small></div><div class="strength-chip-list"></div>';
    const list=box.querySelector('.strength-chip-list');
    items.forEach(item=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='strength-chip';
      b.textContent=`+ ${item.name}`;
      b.onclick=()=>addQuickExercise(item);
      list.appendChild(b);
    });
  }
  renderStrengthShortcuts();

  // Refresca los accesos rápidos después de guardar o eliminar un ejercicio frecuente.
  document.addEventListener('click',e=>{
    if(e.target.closest('.save-exercise-frequent')||e.target.closest('#exercise_frequent_list .mini')){
      setTimeout(renderStrengthShortcuts,50);
    }
  });

  function renderLibraryOptimized(){
    const group=document.getElementById('library_group')?.value||'Todos';
    const q=(document.getElementById('library_search')?.value||'').trim().toLowerCase();
    const root=document.getElementById('library_results');
    if(!root||typeof BASE_EXERCISES==='undefined')return;

    const frequent=typeof getFrequentExercises==='function'?getFrequentExercises().map(x=>({...x,group:'Frecuentes',_priority:0})):[];
    const recent=typeof getRecentExercises==='function'?getRecentExercises().map(x=>({...x,_priority:1})):[];
    const base=BASE_EXERCISES.map(x=>({...x,_priority:2}));
    let items=[...frequent,...recent,...base];

    if(group!=='Todos')items=items.filter(x=>x.group===group);
    if(q)items=items.filter(x=>(x.name||'').toLowerCase().includes(q));
    items.sort((a,b)=>a._priority-b._priority);

    const seen=new Set();
    items=items.filter(x=>{
      const key=x.group+'|'+(x.name||'').toLowerCase();
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    });

    root.innerHTML='';
    if(!items.length){root.innerHTML='<div class="hint">No hay ejercicios que coincidan.</div>';return;}

    items.forEach(i=>{
      const c=document.createElement('div');
      c.className='library-item';
      c.innerHTML=`<strong>${typeof escAttr==='function'?escAttr(i.name):i.name}</strong><small>${typeof escAttr==='function'?escAttr(i.group):i.group}</small>`;
      const a=document.createElement('div');
      a.className='item-actions';
      const add=document.createElement('button');
      add.type='button';
      add.className='primary';
      add.textContent='Añadir';
      add.onclick=()=>{
        addQuickExercise(i);
        c.classList.add('added');
        add.textContent='Añadido ✓';
        add.disabled=true;
        if(!c.querySelector('.added-label')){
          const label=document.createElement('span');
          label.className='added-label';
          label.textContent='Puedes seguir añadiendo ejercicios sin cerrar la biblioteca.';
          c.appendChild(label);
        }
        setTimeout(()=>{add.disabled=false;add.textContent='Añadir otro';},650);
      };
      a.appendChild(add);
      const image=resolveExerciseImage(i);
      if(image&&typeof openTechnique==='function'){
        const t=document.createElement('button');
        t.type='button';
        t.className='secondary';
        t.textContent='Ver técnica';
        t.onclick=()=>openTechnique(i.name,image);
        a.appendChild(t);
      }
      c.appendChild(a);
      root.appendChild(c);
    });
  }

  const modalCard=document.querySelector('#library_modal .modal-card');
  if(modalCard&&!modalCard.querySelector('.library-helper')){
    const helper=document.createElement('div');
    helper.className='library-helper';
    helper.textContent='Añade varios ejercicios seguidos; la biblioteca permanecerá abierta hasta que tú la cierres.';
    const results=document.getElementById('library_results');
    if(results)results.insertAdjacentElement('beforebegin',helper);
  }

  const openLibrary=document.getElementById('open_library');
  if(openLibrary)openLibrary.onclick=()=>{renderLibraryOptimized();if(typeof openModal==='function')openModal('library_modal')};
  const groupSelect=document.getElementById('library_group');
  const searchInput=document.getElementById('library_search');
  if(groupSelect)groupSelect.onchange=renderLibraryOptimized;
  if(searchInput)searchInput.oninput=renderLibraryOptimized;
})();
