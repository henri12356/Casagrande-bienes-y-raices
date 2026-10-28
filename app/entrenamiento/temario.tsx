
"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Foto from "./foto";
import styles from "./secciones.module.css";

const temas = [
  {
    numero: "01",
    titulo: "IA para captar clientes",
    descripcion:
      "Aprende cómo utilizar herramientas de inteligencia artificial para organizar prospectos, desarrollar mensajes comerciales y mejorar el seguimiento.",
    imagen: "/entrenamiento/tema-01.webp",
    etiqueta: "INTELIGENCIA ARTIFICIAL",
  },
  {
    numero: "02",
    titulo: "Marca personal inmobiliaria",
    descripcion:
      "Descubre cómo comunicar tu propuesta de valor, generar confianza y diferenciarte como asesor en el mercado inmobiliario.",
    imagen: "/entrenamiento/tema-02.webp",
    etiqueta: "MARCA PERSONAL",
  },
  {
    numero: "03",
    titulo: "WhatsApp comercial",
    descripcion:
      "Conoce estrategias de contacto, conversación y seguimiento para convertir oportunidades en visitas y negociaciones.",
    imagen: "/entrenamiento/tema-03.webp",
    etiqueta: "WHATSAPP Y VENTAS",
  },
  {
    numero: "04",
    titulo: "Negociación y cierre",
    descripcion:
      "Trabaja la identificación de necesidades, el manejo de objeciones y las técnicas de cierre aplicadas a bienes raíces.",
    imagen: "/entrenamiento/tema-04.webp",
    etiqueta: "CIERRE DE VENTAS",
  },
  {
    numero: "05",
    titulo: "Mentalidad comercial",
    descripcion:
      "Fortalece tus hábitos de prospección, disciplina, constancia y organización para desarrollar una carrera comercial.",
    imagen: "/entrenamiento/tema-05.webp",
    etiqueta: "CRECIMIENTO COMERCIAL",
  },
];

export default function Temario() {
  return (
    <section
      className={styles.temario}
      id="temario"
      aria-labelledby="titulo-temario"
    >
      <div className={styles.contenedorGeneral}>
        <motion.div
          className={styles.temarioEncabezado}
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.etiquetaSeccion}>
            TU PRÓXIMO NIVEL COMERCIAL
          </span>

          <h2 id="titulo-temario">
            El mercado cambió.
            <br />
            <span>¿Estás listo para vender diferente?</span>
          </h2>

          <p>
            Cinco temas enfocados en desarrollar herramientas,
            habilidades y estrategias para el negocio inmobiliario.
          </p>
        </motion.div>

        <div className={styles.temarioGrid}>
          {temas.map((tema, indice) => (
            <motion.article
              key={tema.numero}
              className={styles.temarioCard}
              initial={{ opacity: 0, y: 55 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.65,
                delay: indice * 0.08,
              }}
            >
              <div className={styles.temarioImagen}>
                <Foto
                  src={tema.imagen}
                  alt={`Imagen ilustrativa de ${tema.titulo}`}
                  etiqueta={tema.etiqueta}
                  tono={
                    indice % 2 === 0 ? "azul" : "naranja"
                  }
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 20vw"
                />

                <span className={styles.temarioNumero}>
                  {tema.numero}
                </span>
              </div>

              <div className={styles.temarioCardContenido}>
                <h3>{tema.titulo}</h3>
                <p>{tema.descripcion}</p>
              </div>
            </motion.article>
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
          <ArrowUpRight size={19} />
        </motion.a>
      </div>
    </section>
  );
}
