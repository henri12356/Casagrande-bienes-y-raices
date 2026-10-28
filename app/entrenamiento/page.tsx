
import AnimacionEntrenamiento from "./animacion";

import Temario from "./temario";
import Mosaico from "./mosaico";
import Expositor from "./expositor";
import Cierre from "./cierre";

// ==========================================
// MEGA ENTRENAMIENTO INMOBILIARIO
// CIMENTA - AYACUCHO 2026
// ==========================================

// Los metadatos SEO, Open Graph y Twitter
// se configuran en ./layout.tsx

export default function EntrenamientoPage() {
  return (
    <AnimacionEntrenamiento>
      {/* PROGRAMA DE FORMACIÓN */}
      <Temario />

      {/* EXPERIENCIA VISUAL ANIMADA */}
      <Mosaico />

      {/* INFORMACIÓN DEL EXPOSITOR */}
      <Expositor />

      {/* INSCRIPCIÓN Y CIERRE */}
      <Cierre />
    </AnimacionEntrenamiento>
  );
}
