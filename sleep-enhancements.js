(()=>{
  const sleep=document.getElementById('sleep_hours');
  if(!sleep)return;

  const details=sleep.closest('details.section-collapse');
  if(!details)return;

  const style=document.createElement('style');
  style.textContent=`
    .sleep-layout{display:grid;gap:14px}
    .sleep-subsection{border:1px solid var(--line);border-radius:12px;padding:12px;background:#f8fafc}
    .sleep-subsection h3{font-size:14px;margin:0 0 10px}
    .sleep-subgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .sleep-scale{grid-column:1/-1}
    .sleep-scale-buttons{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin-top:7px}
    .sleep-scale-buttons button{padding:9px 0;border:1px solid #d5dae0;background:#fff;border-radius:8px;font-size:12px;font-weight:700}
    .sleep-scale-buttons button.selected{background:var(--accent);color:#fff;border-color:var(--accent)}
    .sleep-scale input[type=number]{max-width:90px}
    .previous-value{font-size:11px;color:var(--muted);margin-top:4px}
    .sleep-summary{display:block;font-size:11px;color:var(--muted);font-weight:500;margin-top:4px;line-height:1.35}
    @media(max-width:620px){
      .sleep-subgrid{grid-template-columns:1fr}
      .sleep-scale{grid-column:auto}
      .sleep-scale-buttons{grid-template-columns:repeat(5,1fr)}
    }
  `;
  document.head.appendChild(style);

  const grid=details.querySelector(':scope > .grid');
  if(!grid)return;

  const fieldBox=id=>document.getElementById(id)?.parentElement;
  const sleepIds=['sleep_hours','sleep_quality','sleep_score'];
  const recoveryIds=['energy','physical_fatigue','mental_fatigue','hrv','resting_hr','body_battery'];

  const layout=document.createElement('div');
  layout.className='sleep-layout';

  function makeGroup(title,ids){
    const group=document.createElement('div');
    group.className='sleep-subsection';
    const h=document.createElement('h3');
    h.textContent=title;
    const sub=document.createElement('div');
    sub.className='sleep-subgrid';
    group.append(h,sub);
    ids.forEach(id=>{
      const box=fieldBox(id);
      if(box)sub.appendChild(box);
    });
    return group;
  }

  layout.append(makeGroup('Sueño',sleepIds),makeGroup('Recuperación',recoveryIds));
  grid.replaceWith(layout);

  const scaleIds=['sleep_quality','energy','physical_fatigue','mental_fatigue'];
  scaleIds.forEach(id=>{
    const input=document.getElementById(id);
    const box=input?.parentElement;
    if(!input||!box)return;
    box.classList.add('sleep-scale');
    const row=document.createElement('div');
    row.className='sleep-scale-buttons';
    const buttons=[];
    for(let n=1;n<=10;n++){
      const b=document.createElement('button');
      b.type='button';
      b.textContent=String(n);
      b.onclick=()=>{
        input.value=String(n);
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.dispatchEvent(new Event('change',{bubbles:true}));
        sync();
      };
      row.appendChild(b);
      buttons.push(b);
    }
    const sync=()=>buttons.forEach((b,i)=>b.classList.toggle('selected',String(i+1)===input.value));
    input.addEventListener('input',sync);
    input.addEventListener('change',sync);
    input.insertAdjacentElement('afterend',row);
    sync();
  });

  const previousMap={
    sleep_hours:['sueno_horas','sueño_horas','sleep_hours','sueño','sueno'],
    sleep_quality:['calidad_sueno','calidad_sueño','sleep_quality'],
    energy:['energia','energía','energy'],
    physical_fatigue:['fatiga_fisica','fatiga_física','physical_fatigue'],
    mental_fatigue:['fatiga_mental','mental_fatigue'],
    hrv:['hrv','vfc'],
    resting_hr:['fc_reposo','resting_hr','frecuencia_cardiaca_reposo'],
    sleep_score:['sleep_score','puntaje_sueno','puntaje_sueño'],
    body_battery:['body_battery']
  };

  function previousRecord(){
    try{
      if(typeof getRecords!=='function')return null;
      const current=document.getElementById('date')?.value||'';
      const records=getRecords().filter(r=>!current||(r.fecha||r.date||'')<current).sort((a,b)=>String(b.fecha||b.date||'').localeCompare(String(a.fecha||a.date||'')));
      return records[0]||null;
    }catch{return null;}
  }

  const prev=previousRecord();
  if(prev){
    Object.entries(previousMap).forEach(([id,keys])=>{
      const input=document.getElementById(id);
      if(!input)return;
      let value='';
      for(const k of keys){if(prev[k]!==undefined&&prev[k]!==null&&String(prev[k]).trim()!==''){value=prev[k];break;}}
      if(value==='')return;
      const note=document.createElement('div');
      note.className='previous-value';
      note.textContent=`Anterior: ${value}`;
      input.parentElement.appendChild(note);
    });
  }

  const summary=details.querySelector(':scope > summary');
  let summaryLine=document.createElement('span');
  summaryLine.className='sleep-summary';
  summary.appendChild(summaryLine);

  function updateSummary(){
    const vals=[];
    const hours=document.getElementById('sleep_hours')?.value;
    const score=document.getElementById('sleep_score')?.value;
    const hrv=document.getElementById('hrv')?.value;
    const energy=document.getElementById('energy')?.value;
    if(hours)vals.push(`${hours} h`);
    if(score)vals.push(`Sleep ${score}`);
    if(hrv)vals.push(`HRV ${hrv}`);
    if(energy)vals.push(`Energía ${energy}`);
    summaryLine.textContent=vals.join(' · ');
  }

  ['sleep_hours','sleep_score','hrv','energy','sleep_quality','physical_fatigue','mental_fatigue','resting_hr','body_battery'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.addEventListener('input',updateSummary);el.addEventListener('change',updateSummary);}
  });
  details.addEventListener('toggle',()=>{if(!details.open)updateSummary();});
  updateSummary();
})();
