
"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Foto from "./foto";
import styles from "./secciones.module.css";

const informacion = [
  {
    numero: "01",
    titulo: "Experiencia en el sector",
    descripcion:
      "Presentaremos su trayectoria y experiencia profesional.",
  },
  {
    numero: "02",
    titulo: "Conocimientos prácticos",
    descripcion:
      "Conocerás el enfoque y las herramientas que compartirá durante el entrenamiento.",
  },
  {
    numero: "03",
    titulo: "Formación y crecimiento",
    descripcion:
      "Descubrirás qué podrás aprender de su participación.",
  },
];

export default function Expositor() {
  return (
    <section
      className={styles.expositor}
      id="expositor"
      aria-labelledby="titulo-expositor"
    >
      <motion.div
        className={styles.expositorImagen}
        initial={{ opacity: 0, x: -65 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <Foto
          src="/entrenamiento/expositor.webp"
          alt="Fotografía del expositor del Mega Entrenamiento"
          etiqueta="PRÓXIMAMENTE"
          tono="oscuro"
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </motion.div>

      <div className={styles.expositorContenido}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75 }}
        >
          <span className={styles.etiquetaSeccion}>
            CONOCE A QUIEN TE ENTRENARÁ
          </span>

          <h2 id="titulo-expositor">
            La experiencia
            <br />
            <span>detrás del escenario.</span>
          </h2>

          <h3 className={styles.expositorNombre}>
            Expositor por anunciar
          </h3>

          <p className={styles.expositorDescripcion}>
            Próximamente compartiremos el nombre, la
            trayectoria y la experiencia del expositor
            que participará en nuestro Mega Entrenamiento
            Inmobiliario de Ayacucho.
          </p>
        </motion.div>

        <div className={styles.expositorLista}>
          {informacion.map((item, indice) => (
            <motion.div
              key={item.numero}
              className={styles.expositorItem}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: indice * 0.1,
              }}
            >
              <span className={styles.expositorNumero}>
                {item.numero}
              </span>

              <div>
                <strong>{item.titulo}</strong>
                <p>{item.descripcion}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.a
          href="#cierre"
          className={styles.botonNegro}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Quiero participar
          <ArrowUpRight size={18} />
        </motion.a>
      </div>
    </section>
  );
}
