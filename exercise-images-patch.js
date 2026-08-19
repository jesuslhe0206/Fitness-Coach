const EXERCISE_IMAGES={
  "Hombro::Press militar":"/ejercicios/hombro/press-militar.png",
  "Hombro::Elevaciones laterales":"/ejercicios/hombro/elevaciones-laterales.png",
  "Hombro::Elevaciones frontales":"/ejercicios/hombro/elevaciones-frontales.png",
  "Hombro::Face pull":"/ejercicios/hombro/face-pull.png",
  "Hombro::Encogimientos (shrugs)":"/ejercicios/hombro/encogimientos-shrugs.png",

  "Espalda::Dominadas":"/ejercicios/espalda/dominadas.png",
  "Espalda::Remo con barra":"/ejercicios/espalda/remo-con-barra.png",
  "Espalda::Jalón al pecho":"/ejercicios/espalda/jalon-al-pecho.png",
  "Espalda::Remo sentado":"/ejercicios/espalda/remo-sentado.png",
  "Espalda::Pullover":"/ejercicios/espalda/pullover.png",

  "Pecho::Press de banca":"/ejercicios/pecho/press-banca.webp",
  "Pecho::Press inclinado":"/ejercicios/pecho/press-inclinado.webp",
  "Pecho::Aperturas":"/ejercicios/pecho/aperturas.webp",
  "Pecho::Fondos en paralelas":"/ejercicios/pecho/fondos-paralelas.webp",
  "Pecho::Press con mancuernas":"/ejercicios/pecho/press-mancuernas.webp",

  "Piernas::Sentadilla":"/ejercicios/piernas/sentadilla.png",
  "Piernas::Prensa de piernas":"/ejercicios/piernas/prensa-de-piernas.png",
  "Piernas::Extensión de piernas":"/ejercicios/piernas/extension-de-piernas.png",
  "Piernas::Curl femoral":"/ejercicios/piernas/curl-femoral.png",
  "Piernas::Elevación de talones":"/ejercicios/piernas/elevacion-de-talones.png",

  "Glúteos::Hip thrust":"/ejercicios/gluteos/hip-thrust.png",
  "Glúteos::Sentadilla búlgara":"/ejercicios/gluteos/sentadilla-bulgara.png",
  "Glúteos::Peso muerto rumano":"/ejercicios/gluteos/peso-muerto-rumano.png",
  "Glúteos::Patada de glúteo en polea":"/ejercicios/gluteos/patada-de-gluteo.png",
  "Glúteos::Abducción de cadera":"/ejercicios/gluteos/abduccion-de-cadera.png",

  "Bíceps::Curl de bíceps con barra":"/ejercicios/biceps/curl-biceps-con-barra.png",
  "Bíceps::Curl alterno con mancuernas":"/ejercicios/biceps/curl-alterno-con-mancuernas.png",
  "Bíceps::Curl martillo":"/ejercicios/biceps/curl-martillo.png",
  "Bíceps::Curl concentrado":"/ejercicios/biceps/curl-concentrado.png",
  "Bíceps::Curl en polea baja":"/ejercicios/biceps/curl-en-polea-baja.png",

  "Tríceps::Press francés":"/ejercicios/triceps/press-frances.png",
  "Tríceps::Fondos en banco":"/ejercicios/triceps/fondos-en-banco.png",
  "Tríceps::Extensión en polea alta":"/ejercicios/triceps/extension-en-polea-alta.png",
  "Tríceps::Patada de tríceps":"/ejercicios/triceps/patada-de-triceps.png",
  "Tríceps::Rompecráneos (skull crushers)":"/ejercicios/triceps/rompecraneos.png",

  "Abdomen / Core::Plancha frontal":"/ejercicios/abdomen-core/plancha-frontal.png",
  "Abdomen / Core::Elevación de piernas":"/ejercicios/abdomen-core/elevacion-de-piernas.png",
  "Abdomen / Core::Crunch abdominal":"/ejercicios/abdomen-core/crunch-abdominal.png",
  "Abdomen / Core::Plancha lateral":"/ejercicios/abdomen-core/plancha-lateral.png",
  "Abdomen / Core::Russian twist":"/ejercicios/abdomen-core/russian-twist.png",

  "Trapecio::Encogimientos con barra":"/ejercicios/trapecio/encogimientos-con-barra.png",
  "Trapecio::Encogimientos con mancuernas":"/ejercicios/trapecio/encogimientos-con-mancuernas.png",
  "Trapecio::Face pull":"/ejercicios/trapecio/face-pull.png",
  "Trapecio::Remo al mentón":"/ejercicios/trapecio/remo-al-menton.png",
  "Trapecio::Farmer's walk":"/ejercicios/trapecio/farmers-walk.png",

  "Pantorrillas::Elevación de talones de pie":"/ejercicios/pantorrillas/elevacion-talones-de-pie.png",
  "Pantorrillas::Elevación de talones sentado":"/ejercicios/pantorrillas/elevacion-talones-sentado.png",
  "Pantorrillas::Elevación en prensa":"/ejercicios/pantorrillas/elevacion-en-prensa.png",
  "Pantorrillas::Elevación a una pierna":"/ejercicios/pantorrillas/elevacion-a-una-pierna.png",
  "Pantorrillas::Saltos de pantorrilla":"/ejercicios/pantorrillas/saltos-de-pantorrilla.png"
};

const exerciseImageKey=ex=>`${ex.group||""}::${ex.name||""}`;

if(typeof BASE_EXERCISES!=="undefined"){
  BASE_EXERCISES.forEach(ex=>{
    const image=EXERCISE_IMAGES[exerciseImageKey(ex)];
    if(image)ex.image=image;
  });
}

try{
  const key="calibracion14_ejercicios_frecuentes_v1";
  const saved=JSON.parse(localStorage.getItem(key)||"[]");
  if(Array.isArray(saved)){
    let changed=false;
    saved.forEach(ex=>{
      const image=EXERCISE_IMAGES[exerciseImageKey(ex)];
      if(image&&ex.image!==image){
        ex.image=image;
        changed=true;
      }
    });
    if(changed)localStorage.setItem(key,JSON.stringify(saved));
  }
}catch{}
