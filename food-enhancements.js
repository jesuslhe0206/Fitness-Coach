(()=>{
  const FOOD_IDS=['breakfast','midmorning','lunch','afternoon_snack','dinner','other_food','drinks','caloric_supplements'];
  const FOOD_LABELS={breakfast:'Desayuno',midmorning:'Colación / media mañana',lunch:'Comida / almuerzo',afternoon_snack:'Colación / media tarde',dinner:'Cena',other_food:'Otros alimentos',drinks:'Bebidas',caloric_supplements:'Suplementos con calorías'};
  const style=document.createElement('style');
  style.textContent=`
    .food-quickbox{margin:12px 0 14px;padding:12px;border:1px solid var(--line);border-radius:12px;background:#f8fafc}
    .food-quick-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:8px}
    .food-quick-head strong{font-size:13px}.food-quick-head small{font-size:11px;color:var(--muted)}
    .food-target-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-bottom:8px}
    .food-target-row select{min-width:0}.food-target-row button{padding:10px 12px;white-space:nowrap}
    .food-chip-list{display:flex;gap:7px;overflow-x:auto;padding:2px 0 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .food-chip-list::-webkit-scrollbar{display:none}
    .food-chip{flex:0 0 auto;padding:9px 11px;border:1px solid #d7dce2;border-radius:999px;background:#fff;color:#111827;font-size:12px;font-weight:700}
    .food-chip:active{transform:scale(.98)}
    .food-empty{font-size:12px;color:var(--muted)}
    @media(max-width:620px){.food-target-row{grid-template-columns:1fr}.food-target-row button{width:100%}}
  `;
  document.head.appendChild(style);

  function frequentFoods(){
    try{
      if(typeof getFrequentFoods==='function')return getFrequentFoods();
      const x=JSON.parse(localStorage.getItem('calibracion14_comidas_frecuentes_v1')||'[]');
      return Array.isArray(x)?x:[];
    }catch{return[];}
  }

  function foodSection(){return document.getElementById('breakfast')?.closest('section.card')||null;}
  function openFoodSection(){const d=document.getElementById('breakfast')?.closest('details.section-collapse');if(d)d.open=true;}
  function insertInto(id,text){
    const el=document.getElementById(id);if(!el)return;
    el.value=el.value.trim()?el.value.trim()+'\n'+text:text;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    openFoodSection();
  }

  function renderQuickFoods(){
    const section=foodSection();if(!section)return;
    let box=document.getElementById('food_quickbox');
    if(!box){
      box=document.createElement('div');box.id='food_quickbox';box.className='food-quickbox';
      const first=document.getElementById('breakfast');
      const grid=first?.closest('.grid');
      if(grid)grid.insertAdjacentElement('beforebegin',box);else section.querySelector('details.section-collapse')?.appendChild(box);
    }
    const items=frequentFoods();
    box.innerHTML='<div class="food-quick-head"><strong>Registro rápido</strong><small>Elige destino y toca una comida</small></div><div class="food-target-row"><select id="food_quick_target"></select><button type="button" class="secondary" id="repeat_last_food">↻ Repetir alimentación anterior</button></div><div class="food-chip-list" id="food_chip_list"></div>';
    const sel=box.querySelector('#food_quick_target');
    FOOD_IDS.forEach(id=>{const o=document.createElement('option');o.value=id;o.textContent=FOOD_LABELS[id];sel.appendChild(o);});
    const list=box.querySelector('#food_chip_list');
    if(!items.length){list.innerHTML='<span class="food-empty">Guarda comidas frecuentes para ver accesos rápidos aquí.</span>';}
    else items.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='food-chip';b.textContent=`+ ${item.name}`;b.onclick=()=>{insertInto(sel.value,item.text);if(typeof showStatus==='function')showStatus(`${item.name} añadido a ${FOOD_LABELS[sel.value]}.`);};list.appendChild(b);});
    box.querySelector('#repeat_last_food').onclick=repeatLastFood;
  }

  function firstValue(obj,keys){for(const k of keys){if(obj&&obj[k]!=null&&String(obj[k]).trim()!=='')return String(obj[k]);}return '';}
  function repeatLastFood(){
    try{
      if(typeof getRecords!=='function')throw new Error('records');
      const current=document.getElementById('date')?.value||'';
      const records=getRecords().filter(r=>(r.fecha||r.date)!==current).sort((a,b)=>String(b.fecha||b.date||'').localeCompare(String(a.fecha||a.date||'')));
      const map={
        breakfast:['desayuno','breakfast'],
        midmorning:['colacion_media_manana','colacion_manana','midmorning'],
        lunch:['comida_almuerzo','almuerzo','comida','lunch'],
        afternoon_snack:['colacion_media_tarde','colacion_tarde','afternoon_snack'],
        dinner:['cena','dinner'],
        other_food:['otros_alimentos','otros_alimentos_snacks_postres','other_food'],
        drinks:['bebidas','drinks'],
        caloric_supplements:['suplementos_calorias','suplementos_con_calorias','caloric_supplements']
      };
      const source=records.find(r=>Object.values(map).some(keys=>firstValue(r,keys)))||null;
      if(!source){if(typeof showStatus==='function')showStatus('Todavía no hay una alimentación anterior para reutilizar.',false);return;}
      const hasCurrent=FOOD_IDS.some(id=>document.getElementById(id)?.value.trim());
      if(hasCurrent&&!confirm('Esto reemplazará los alimentos que ya capturaste hoy. ¿Continuar?'))return;
      let filled=0;
      FOOD_IDS.forEach(id=>{const el=document.getElementById(id);if(!el)return;const v=firstValue(source,map[id]);el.value=v;if(v)filled++;});
      openFoodSection();
      if(typeof showStatus==='function')showStatus(filled?`Alimentación del ${source.fecha||source.date||'registro anterior'} cargada para editar.`:'No se encontraron campos de alimentación reutilizables.',!!filled);
    }catch{
      if(typeof showStatus==='function')showStatus('No se pudo cargar la alimentación anterior.',false);
    }
  }

  renderQuickFoods();
  document.addEventListener('click',e=>{
    if(e.target.closest('.frequent-save')||e.target.closest('#frequent_list .mini'))setTimeout(renderQuickFoods,80);
  });
})();
