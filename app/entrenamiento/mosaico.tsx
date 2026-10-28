
"use client";

import { useRef } from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import Foto from "./foto";
import styles from "./secciones.module.css";

type Tarjeta =
  | {
      id: string;
      tipo: "foto";
      imagen: string;
      etiqueta: string;
      tono?: "azul" | "naranja" | "oscuro";
    }
  | {
      id: string;
      tipo: "texto";
      etiqueta: string;
      titulo: string;
      estilo: "claro" | "naranja" | "oscuro";
    };

const filas: Tarjeta[][] = [
  [
    {
      id: "f1-t1",
      tipo: "texto",
      etiqueta: "MODALIDAD",
      titulo: "Entrenamiento presencial",
      estilo: "oscuro",
    },
    {
      id: "f1-i1",
      tipo: "foto",
      imagen: "/entrenamiento/evento-01.webp",
      etiqueta: "APRENDIZAJE",
      tono: "azul",
    },
    {
      id: "f1-t2",
      tipo: "texto",
      etiqueta: "CIUDAD",
      titulo: "Ayacucho, Perú",
      estilo: "claro",
    },
    {
      id: "f1-i2",
      tipo: "foto",
      imagen: "/entrenamiento/evento-02.webp",
      etiqueta: "CONEXIONES",
      tono: "naranja",
    },
    {
      id: "f1-t3",
      tipo: "texto",
      etiqueta: "EVENTO",
      titulo: "30 de octubre",
      estilo: "oscuro",
    },
  ],
  [
    {
      id: "f2-i1",
      tipo: "foto",
      imagen: "/entrenamiento/evento-03.webp",
      etiqueta: "NEGOCIOS",
      tono: "oscuro",
    },
    {
      id: "f2-t1",
      tipo: "texto",
      etiqueta: "ENFOQUE",
      titulo: "Aprende. Conecta. Crece.",
      estilo: "naranja",
    },
    {
      id: "f2-i2",
      tipo: "foto",
      imagen: "/entrenamiento/evento-04.webp",
      etiqueta: "CAPACITACIÓN",
      tono: "azul",
    },
    {
      id: "f2-t2",
      tipo: "texto",
      etiqueta: "LUGAR",
      titulo: "Hotel Santa Rosa",
      estilo: "claro",
    },
    {
      id: "f2-i3",
      tipo: "foto",
      imagen: "/entrenamiento/evento-05.webp",
      etiqueta: "EXPERIENCIAS",
      tono: "naranja",
    },
  ],
  [
    {
      id: "f3-t1",
      tipo: "texto",
      etiqueta: "VISIÓN",
      titulo: "Nuevas oportunidades",
      estilo: "claro",
    },
    {
      id: "f3-i1",
      tipo: "foto",
      imagen: "/entrenamiento/evento-06.webp",
      etiqueta: "COMUNIDAD",
      tono: "azul",
    },
    {
      id: "f3-t2",
      tipo: "texto",
      etiqueta: "SECTOR",
      titulo: "Mercado inmobiliario",
      estilo: "oscuro",
    },
    {
      id: "f3-i2",
      tipo: "foto",
      imagen: "/entrenamiento/evento-01.webp",
      etiqueta: "FORMACIÓN",
      tono: "naranja",
    },
    {
      id: "f3-t3",
      tipo: "texto",
      etiqueta: "CIMENTA",
      titulo: "Construye tu futuro",
      estilo: "naranja",
    },
  ],
];

function TarjetaMosaico({
  tarjeta,
}: {
  tarjeta: Tarjeta;
}) {
  if (tarjeta.tipo === "foto") {
    return (
      <div className={styles.mosaicoTarjeta}>
        <Foto
          src={tarjeta.imagen}
          alt={`Imagen ilustrativa: ${tarjeta.etiqueta}`}
          etiqueta={tarjeta.etiqueta}
          tono={tarjeta.tono}
          sizes="(max-width: 640px) 210px, 320px"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        styles.mosaicoTarjeta,
        styles.mosaicoTexto,
        styles[`mosaico_${tarjeta.estilo}`],
      ].join(" ")}
    >
      <span>{tarjeta.etiqueta}</span>

      <strong>{tarjeta.titulo}</strong>
    </div>
  );
}

export default function Mosaico() {
  const seccionRef = useRef<HTMLElement>(null);
  const reducido = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start end", "end start"],
  });

  const movimientoUno = useTransform(
    scrollYProgress,
    [0, 1],
    [-180, 180]
  );

  const movimientoDos = useTransform(
    scrollYProgress,
    [0, 1],
    [180, -180]
  );

  const movimientoTres = useTransform(
    scrollYProgress,
    [0, 1],
    [-140, 140]
  );

  const movimientos = [
    movimientoUno,
    movimientoDos,
    movimientoTres,
  ];

  return (
    <section
      ref={seccionRef}
      className={styles.mosaico}
      aria-label="Experiencia del Mega Entrenamiento"
    >
      <div className={styles.mosaicoFondo} />

      <div className={styles.mosaicoTitular}>
        <motion.span
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          MÁS QUE UNA CAPACITACIÓN
        </motion.span>
      </div>

      <div className={styles.mosaicoVentana}>
        <div className={styles.mosaicoTablero}>
          {filas.map((fila, indice) => (
            <motion.div
              key={`fila-${indice}`}
              className={styles.mosaicoFila}
              style={
                reducido
                  ? undefined
                  : { x: movimientos[indice] }
              }
            >
              {fila.map((tarjeta) => (
                <TarjetaMosaico
                  key={tarjeta.id}
                  tarjeta={tarjeta}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.mosaicoOscurecer} />

      <div className={styles.mosaicoPie}>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Una experiencia para aprender,
          conectar y crecer.
        </motion.p>
      </div>
    </section>
  );
}
