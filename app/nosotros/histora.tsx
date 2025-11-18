"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
  FaRegBuilding,
  FaChartLine,
  FaLaptop,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";
import { IconType } from "react-icons";

// (El array de hitos y el tipo Hito siguen igual)
type Hito = {
  year: string;
  title: string;
  description: string;
  icon: IconType;
};

const hitos: Hito[] = [
  {
    year: "2005",
    title: "Inicio de Casagrande Bienes y Raíces",
    description:
      "Comenzamos ayudando a familias de Ayacucho a encontrar su primer terreno y casa propia.",
    icon: FaRegBuilding,
  },
  {
    year: "2010",
    title: "Expansión de proyectos",
    description:
      "Sumamos nuevos proyectos de lotes urbanizados y viviendas en distintos distritos.",
    icon: FaChartLine,
  },
  {
    year: "2015",
    title: "Presencia digital",
    description:
      "Lanzamos nuestra plataforma web para publicar terrenos, casas y alquileres de forma simple.",
    icon: FaLaptop,
  },
  {
    year: "2020",
    title: "Cobertura a nivel regional",
    description:
      "Ampliamos nuestra cartera de propiedades con proyectos en varias regiones del país.",
    icon: FaGlobe,
  },
  {
    year: "2024",
    title: "Casagrande 100% inmobiliaria digital",
    description:
      "Integramos herramientas digitales para que compradores y propietarios gestionen todo en línea.",
    icon: FaUsers,
  },
];

const Timeline: React.FC = () => {
  const [activo, setActivo] = useState(2); // índice inicial (2015)

  const irAnterior = () => {
    setActivo((prev) => (prev === 0 ? hitos.length - 1 : prev - 1));
  };

  const irSiguiente = () => {
    setActivo((prev) => (prev === hitos.length - 1 ? 0 : prev + 1));
  };

  const hitoActual = hitos[activo];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 overflow-hidden">
        {/* Título */}
        <h2 className="mb-16 text-center text-3xl sm:text-4xl font-extrabold">
          <span style={{ color: '#FFB200' }}>Casagrande</span>{" "}
          <span style={{ color: '#01338C' }}>urbanizando historias</span>
        </h2>

        {/* CONTENEDOR DE LA LÍNEA DE TIEMPO */}
        <div className="relative flex items-center justify-between gap-4">
          {/* Botón izquierda */}
          <motion.button
            onClick={irAnterior}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full shadow-lg transition-all"
            style={{ backgroundColor: '#01338C', color: 'white' }}
            aria-label="Hito anterior"
          >
            <LuChevronLeft />
          </motion.button>

          {/* Línea y años (con scroll horizontal en móvil) */}
          <div className="flex-1 overflow-x-auto py-2">
            {/* Aumentamos el min-w para dar más espacio a los círculos grandes */}
            <div className="relative flex items-center justify-center sm:justify-between min-w-[500px] sm:min-w-[600px] px-4">
              {/* Línea de fondo */}
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-slate-300 z-0" />

              {/* Mapeo de los años (círculos) */}
              <div className="relative flex justify-between w-full">
                {hitos.map((hito, index) => {
                  const isActive = index === activo;
                  return (
                    <motion.button
                      key={hito.year}
                      onClick={() => setActivo(index)}
                      // --- CAMBIO: CÍRCULOS MÁS GRANDES ---
                      className="relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        '--tw-ring-color': isActive ? '#FFB200' : 'transparent' 
                      } as React.CSSProperties}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive ? "#FFB200" : "#01338C",
                        color: isActive ? "#01338C" : "#FFFFFF",
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      aria-label={`Ver año ${hito.year}`}
                    >
                      {hito.year}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* Botón derecha */}
          <motion.button
            onClick={irSiguiente}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full shadow-lg transition-all"
            style={{ backgroundColor: '#01338C', color: 'white' }}
            aria-label="Siguiente hito"
          >
            <LuChevronRight />
          </motion.button>
        </div>

        {/* --- TARJETA DE CONTENIDO (MEJORADA) --- */}
        <div className="mt-16 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={hitoActual.year}
              // Animación de entrada/salida más sutil
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              // Diseño de tarjeta "Premium"
              className="w-full max-w-2xl rounded-2xl bg-white p-8 sm:p-10 shadow-2xl border-t-4"
              style={{ borderColor: '#FFB200' }} // Borde de acento
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Icono más grande */}
                <div 
                  className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#FFB200' }}
                >
                  <hitoActual.icon 
                    className="h-8 w-8 sm:h-10 sm:w-10" 
                    style={{ color: '#01338C' }} 
                  />
                </div>
                {/* Contenido de texto (más grande) */}
                <div className="flex-1">
                  <h3 
                    className="text-2xl sm:text-3xl font-bold" 
                    style={{ color: '#01338C' }}
                  >
                    {hitoActual.title}
                  </h3>
                  <p className="mt-3 text-base sm:text-lg text-slate-600">
                    {hitoActual.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Timeline;