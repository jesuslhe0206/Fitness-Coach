(()=>{
  const form=document.getElementById('form');
  if(!form)return;

  const style=document.createElement('style');
  style.textContent=`
    .section-head-meta{display:inline-flex;align-items:center;gap:7px;flex-wrap:wrap;margin-left:8px;vertical-align:middle}
    .section-status-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 7px;border-radius:999px;font-size:10px;font-weight:800;line-height:1.25;white-space:nowrap}
    .section-status-badge.complete{background:#ecfdf3;color:#166534;border:1px solid #bbf7d0}
    .section-status-badge.pending{background:#fff7ed;color:#9a3412;border:1px solid #fed7aa}
    .section-status-badge.optional{background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb}
    .section-mini-summary{font-size:11px;color:var(--muted);font-weight:600;line-height:1.35}
    @media(max-width:620px){
      .section-head-meta{display:flex;margin:5px 0 0 20px;gap:6px}
      .section-mini-summary{width:100%}
    }
  `;
  document.head.appendChild(style);

  const val=id=>(document.getElementById(id)?.value||'').trim();
  const checked=id=>!!document.getElementById(id)?.checked;
  const filled=id=>val(id)!=='';
  const short=(s,n=52)=>s.length>n?s.slice(0,n-1)+'…':s;

  function exerciseCount(){
    const root=document.getElementById('exercises');
    if(!root)return 0;
    return root.querySelectorAll('.exercise').length || root.children.length;
  }

  const configs=[
    {
      key:'measures', selector:'#weight',
      state(){return filled('weight')?'complete':'pending'},
      label(){return filled('weight')?'Completa':'Pendiente'},
      summary(){const p=[];if(filled('weight'))p.push(`Peso ${val('weight')} kg`);if(filled('waist'))p.push(`Cintura ${val('waist')} cm`);return p.join(' · ')||'Falta peso de hoy';}
    },
    {
      key:'food', selector:'#breakfast',
      state(){const n=['breakfast','lunch','dinner'].filter(filled).length;return n===3?'complete':'pending'},
      label(){const n=['breakfast','lunch','dinner'].filter(filled).length;return n===3?'Completa':`Pendiente ${n}/3`},
      summary(){const n=['breakfast','lunch','dinner'].filter(filled).length;return `${n}/3 comidas principales registradas`;}
    },
    {
      key:'strength', selector:'#strength_done',
      state(){const n=exerciseCount();if(checked('strength_done')||n){return n?'complete':'pending'}return 'optional'},
      label(){const n=exerciseCount();if(checked('strength_done')||n)return n?'Registrada':'Pendiente';return 'Opcional hoy'},
      summary(){const n=exerciseCount();if(n)return `${n} ejercicio${n===1?'':'s'}`;return checked('strength_done')?'Falta añadir ejercicios':'Sin entrenamiento registrado';}
    },
    {
      key:'cardio', selector:'#cardio_done',
      state(){const active=checked('cardio_done')||filled('cardio_mode')||filled('cardio_minutes')||filled('cardio_rpe');if(!active)return 'optional';return ['cardio_mode','cardio_minutes','cardio_rpe'].every(filled)?'complete':'pending'},
      label(){const active=checked('cardio_done')||filled('cardio_mode')||filled('cardio_minutes')||filled('cardio_rpe');if(!active)return 'Opcional hoy';return ['cardio_mode','cardio_minutes','cardio_rpe'].every(filled)?'Registrada':'Pendiente'},
      summary(){const p=[];if(filled('cardio_mode'))p.push(val('cardio_mode'));if(filled('cardio_minutes'))p.push(`${val('cardio_minutes')} min`);if(filled('cardio_hr'))p.push(`${val('cardio_hr')} lpm`);if(filled('cardio_rpe'))p.push(`RPE ${val('cardio_rpe')}`);return p.join(' · ')||'Sin cardio registrado';}
    },
    {
      key:'steps', selector:'#steps',
      state(){return filled('steps')?'complete':'pending'},
      label(){return filled('steps')?'Completa':'Pendiente'},
      summary(){return filled('steps')?`${Number(val('steps')).toLocaleString('es-MX')} pasos`:'Faltan pasos de hoy';}
    },
    {
      key:'sleep', selector:'#sleep_hours',
      state(){const ids=['sleep_hours','sleep_quality','energy','physical_fatigue','mental_fatigue','hrv','resting_hr','sleep_score','body_battery'];return ids.every(filled)?'complete':'pending'},
      label(){const ids=['sleep_hours','sleep_quality','energy','physical_fatigue','mental_fatigue','hrv','resting_hr','sleep_score','body_battery'];const n=ids.filter(filled).length;return n===ids.length?'Completa':`Pendiente ${n}/${ids.length}`},
      summary(){const p=[];if(filled('sleep_hours'))p.push(`${val('sleep_hours')} h`);if(filled('sleep_score'))p.push(`Sleep ${val('sleep_score')}`);if(filled('hrv'))p.push(`HRV ${val('hrv')}`);if(filled('energy'))p.push(`Energía ${val('energy')}`);return p.join(' · ')||'Faltan datos de sueño y recuperación';}
    },
    {
      key:'pain', selector:'#wrist_pain',
      state(){return filled('wrist_pain')&&filled('foot_pain')?'complete':'pending'},
      label(){return filled('wrist_pain')&&filled('foot_pain')?'Completa':'Pendiente'},
      summary(){const p=[];if(filled('wrist_pain'))p.push(`Muñeca ${val('wrist_pain')}/10`);if(filled('foot_pain'))p.push(`Pie ${val('foot_pain')}/10`);return p.join(' · ')||'Falta registrar dolor de hoy';}
    },
    {
      key:'bp', selector:'#bp1_sys',
      state(){const ids=['bp1_sys','bp1_dia','bp2_sys','bp2_dia'];const n=ids.filter(filled).length;return n===0?'optional':n===4?'complete':'pending'},
      label(){const ids=['bp1_sys','bp1_dia','bp2_sys','bp2_dia'];const n=ids.filter(filled).length;return n===0?'Según protocolo':n===4?'Registrada':`Pendiente ${n}/4`},
      summary(){if(['bp1_sys','bp1_dia','bp2_sys','bp2_dia'].every(filled))return `${val('bp1_sys')}/${val('bp1_dia')} · ${val('bp2_sys')}/${val('bp2_dia')} mmHg`;return ['bp1_sys','bp1_dia','bp2_sys','bp2_dia'].some(filled)?'Lecturas incompletas':'No corresponde todos los días';}
    },
    {
      key:'notes', selector:'#notes',
      state(){return filled('notes')?'complete':'optional'},
      label(){return filled('notes')?'Registrada':'Opcional'},
      summary(){return filled('notes')?short(val('notes')):'Sin notas del día';}
    }
  ];

  function detailsFor(selector){
    const el=document.querySelector(selector);
    return el?.closest('details.section-collapse')||el?.closest('section.card')?.querySelector('details.section-collapse')||null;
  }

  function ensureMeta(cfg){
    const details=detailsFor(cfg.selector);if(!details)return null;
    const summary=details.querySelector(':scope > summary');if(!summary)return null;
    let meta=summary.querySelector(`.section-head-meta[data-key="${cfg.key}"]`);
    if(!meta){
      meta=document.createElement('span');meta.className='section-head-meta';meta.dataset.key=cfg.key;
      meta.innerHTML='<span class="section-status-badge"></span><span class="section-mini-summary"></span>';
      summary.appendChild(meta);
    }
    return meta;
  }

  function refresh(){
    configs.forEach(cfg=>{
      const meta=ensureMeta(cfg);if(!meta)return;
      const badge=meta.querySelector('.section-status-badge');
      const mini=meta.querySelector('.section-mini-summary');
      const state=cfg.state();
      badge.className=`section-status-badge ${state}`;
      badge.textContent=(state==='complete'?'✓ ':state==='pending'?'! ':'')+cfg.label();
      mini.textContent=cfg.summary();
    });
  }

  form.addEventListener('input',refresh);
  form.addEventListener('change',refresh);
  form.addEventListener('click',()=>setTimeout(refresh,30));
  const ex=document.getElementById('exercises');
  if(ex)new MutationObserver(refresh).observe(ex,{childList:true,subtree:true});
  setTimeout(refresh,0);
  setTimeout(refresh,250);
})();
