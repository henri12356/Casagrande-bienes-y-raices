
"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./secciones.module.css";

type FotoProps = {
  src: string;
  alt: string;
  etiqueta?: string;
  className?: string;
  tono?: "azul" | "naranja" | "oscuro";
  sizes?: string;
};

export default function Foto({
  src,
  alt,
  etiqueta = "CIMENTA",
  className = "",
  tono = "azul",
  sizes = "(max-width: 768px) 100vw, 33vw",
}: FotoProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={[
        styles.foto,
        styles[`foto_${tono}`],
        className,
      ].join(" ")}
    >
      {error ? (
        <div
          className={styles.fotoRespaldo}
          role="img"
          aria-label={alt}
        >
          <span className={styles.fotoMarca}>
            CIMENTA
          </span>

          <span className={styles.fotoEtiqueta}>
            {etiqueta}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={styles.fotoImagen}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
