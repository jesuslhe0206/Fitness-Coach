const CHEST_EXERCISE_IMAGES={
  "Press de banca":"/ejercicios/pecho/press-banca.webp",
  "Press inclinado":"/ejercicios/pecho/press-inclinado.webp",
  "Aperturas":"/ejercicios/pecho/aperturas.webp",
  "Fondos en paralelas":"/ejercicios/pecho/fondos-paralelas.webp",
  "Press con mancuernas":"/ejercicios/pecho/press-mancuernas.webp"
};

if(typeof BASE_EXERCISES!=="undefined"){
  BASE_EXERCISES.forEach(ex=>{
    if(ex.group==="Pecho"&&CHEST_EXERCISE_IMAGES[ex.name]){
      ex.image=CHEST_EXERCISE_IMAGES[ex.name];
    }
  });
}

try{
  const key="calibracion14_ejercicios_frecuentes_v1";
  const saved=JSON.parse(localStorage.getItem(key)||"[]");
  if(Array.isArray(saved)){
    let changed=false;
    saved.forEach(ex=>{
      if(CHEST_EXERCISE_IMAGES[ex.name]&&ex.image!==CHEST_EXERCISE_IMAGES[ex.name]){
        ex.image=CHEST_EXERCISE_IMAGES[ex.name];
        changed=true;
      }
    });
    if(changed)localStorage.setItem(key,JSON.stringify(saved));
  }
}catch{}
