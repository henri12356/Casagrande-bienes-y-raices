
"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  CalendarDays,
} from "lucide-react";

import Foto from "./foto";
import styles from "./secciones.module.css";

const numeroWhatsapp = "51917702692";

const mensaje =
  "Hola, deseo recibir información para inscribirme al Mega Entrenamiento Inmobiliario de CIMENTA, el 30 de octubre en el Hotel Santa Rosa de Ayacucho.";

const whatsappUrl =
  `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

export default function Cierre() {
  return (
    <section
      className={styles.cierre}
      id="cierre"
      aria-labelledby="titulo-cierre"
    >
      {/* FONDO */}
      <div className={styles.cierreImagen}>
        <Foto
          src="/entrenamiento/cierre.webp"
          alt="Auditorio de capacitación inmobiliaria"
          etiqueta="MEGA ENTRENAMIENTO"
          tono="oscuro"
          sizes="100vw"
        />
      </div>

      <div className={styles.cierreOverlay} />

      {/* CONTENIDO */}
      <motion.div
        className={styles.cierreContenido}
        initial={{ opacity: 0, y: 55 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.85 }}
      >
        <span className={styles.cierreEtiqueta}>
          CIMENTA · MEGA ENTRENAMIENTO 2026
        </span>

        <h2 id="titulo-cierre">
          Nos vemos el 30 de
          <br />
          octubre <span>en Ayacucho.</span>
        </h2>

        <p>
          Sé parte del Mega Entrenamiento Inmobiliario.
          Solicita información para participar en el evento.
        </p>

        <div className={styles.cierreDatos}>
          <span>
            <CalendarDays size={17} />
            Viernes 30 de octubre de 2026
          </span>

          <span>
            <MapPin size={17} />
            Hotel Santa Rosa, Ayacucho
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.botonBlanco}
        >
          Quiero inscribirme
          <ArrowUpRight size={19} />
        </a>
      </motion.div>
    </section>
  );
}
