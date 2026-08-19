(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .section-collapse{border:0}
    .section-collapse>summary{font-size:17px;font-weight:750;padding:2px 0;cursor:pointer}
    .section-collapse>summary::marker{font-size:1.05em}
    .section-collapse[open]>summary{margin-bottom:14px}
    .measure-block+.measure-block{margin-top:16px;padding-top:16px;border-top:1px solid var(--line)}
    .quick-repeat{white-space:nowrap}
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
})();
