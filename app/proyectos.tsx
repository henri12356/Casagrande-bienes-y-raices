/* eslint-disable @next/next/no-img-element */
"use client";

import React, { FC, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// --- INTERFACES, DATOS E ICONOS (Sin cambios) ---

interface Proyecto {
  id: number;
  nombre: string;
  subtitulo: string;
  ubicacion: string;
  precioDesdeSol: string;
  precioDesdeDolar: string;
  imagenSrc: string;
  etiqueta: string;
  servicios: string[];
}

const proyectosData: Proyecto[] = [
  // ... (Tus datos de proyectos van aquí)
  {
    id: 1,
    nombre: "Chilca",
    subtitulo: "Alameda Lima Sur",
    ubicacion: "KM. 61.5 Panamericana Sur",
    precioDesdeSol: "S/ 1,213",
    precioDesdeDolar: "$ 311",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 2,
    nombre: "Asia",
    subtitulo: "La Arboleda de Asia",
    ubicacion: "KM 98 Panamericana Sur",
    precioDesdeSol: "S/ 1,131",
    precioDesdeDolar: "$ 290",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 3,
    nombre: "Cañete",
    subtitulo: "La Planicie de Cañete",
    ubicacion: "Av. Mariscal Benavides (Altura Av. Huancaré, a 1 min. del Megaplaza)",
    precioDesdeSol: "S/ 991",
    precioDesdeDolar: "$ 259",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 4,
    nombre: "Carabayllo",
    subtitulo: "Los Ficus de Carabayllo",
    ubicacion: "Alt. Km 30 Pan. Norte - Av. Jose Baego Rejas 545, Esquina Paradero Lark",
    precioDesdeSol: "S/ 1,931",
    precioDesdeDolar: "$ 495",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 5,
    nombre: "Lurín",
    subtitulo: "Los Pájaros de Lurín",
    ubicacion: "KM. 32 Panamericana Sur",
    precioDesdeSol: "S/ 1,450",
    precioDesdeDolar: "$ 372",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 6,
    nombre: "Pachacámac",
    subtitulo: "Las Lomas de Pachacámac",
    ubicacion: "KM. 25 Panamericana Sur",
    precioDesdeSol: "S/ 1,750",
    precioDesdeDolar: "$ 449",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 7,
    nombre: "Chorrillos",
    subtitulo: "Miramar Chorrillos",
    ubicacion: "Av. Costanera 1234",
    precioDesdeSol: "S/ 2,100",
    precioDesdeDolar: "$ 538",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 8,
    nombre: "Villa El Salvador",
    subtitulo: "Parque Industrial",
    ubicacion: "Av. Central Mz. F Lt. 12",
    precioDesdeSol: "S/ 1,320",
    precioDesdeDolar: "$ 338",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
  {
    id: 9,
    nombre: "San Juan de Miraflores",
    subtitulo: "Los Jardines de San Juan",
    ubicacion: "Av. Los Héroes 567",
    precioDesdeSol: "S/ 1,680",
    precioDesdeDolar: "$ 431",
    imagenSrc: "proyecto.webp",
    etiqueta: "LOTES",
    servicios: ["Crédito directo", "PRE VENTA"],
  },
];

const IconLocation: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const IconCredit: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-3-8h-2V7h-3v3h2v1h-2v3h3v-1h2v-2zm-9 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const IconSale: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z"/>
  </svg>
);

const ProjectCard: FC<{ proyecto: Proyecto }> = ({ proyecto }) => {
  return (
    <motion.div
      initial={{ opacity: 0,  }}
      whileInView={{ opacity: 1,  }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-xl overflow-hidden relative group h-full flex flex-col w-full"
    >
      {/* Imagen con etiqueta flotante */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={proyecto.imagenSrc}
          alt={`Imagen del lote ${proyecto.nombre}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/800x500/CCCCCC/000000?text=Imagen+no+disponible";
          }}
        />
        <div className="absolute top-4 left-4 bg-[#FFD100] text-[#005BBB] font-extrabold text-xs uppercase px-4 py-2 rounded-full shadow-lg">
          {proyecto.etiqueta}
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-[#005BBB] text-white px-5 py-4 flex flex-col justify-between grow">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold leading-tight">{proyecto.nombre}</h3>
          <p className="text-sm text-yellow-300 font-semibold">{proyecto.subtitulo}</p>

          <div className="flex items-start gap-2">
            <IconLocation />
            <p className="text-sm leading-snug">{proyecto.ubicacion}</p>
          </div>

          {proyecto.servicios.map((servicio, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {servicio.includes("Crédito") ? <IconCredit /> : <IconSale />}
              <p className="text-sm leading-snug">{servicio}</p>
            </div>
          ))}
        </div>

        {/* Precio como botón flotante */}
        <div className="mt-3 pt-2 pb-2">
          <div className="inline-block bg-[#FFD100] text-[#005BBB] px-5 py-3 font-extrabold rounded-full shadow-lg text-sm cursor-pointer hover:scale-105 transition-transform duration-200">
            <span className="text-sm font-normal">Cuota desde: </span>{proyecto.precioDesdeDolar} <span className="text-xs font-normal">o</span> {proyecto.precioDesdeSol}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPONENTE PRINCIPAL (ACTUALIZADO) ---

const Proyectos = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  
  // **MEJORA**: Estado para el 'gap' y 'minWidth' dinámico
  const [gap, setGap] = useState(24);
  const [minCardWidth, setMinCardWidth] = useState('auto');
  const [isMobile, setIsMobile] = useState(false);


  // **MEJORA**: useEffect robusto basado en breakpoints
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 640) { // móvil (breakpoint 'sm' de Tailwind)
        setCardsToShow(1);
        setGap(16); // Coincide con gap-4
        setMinCardWidth('280px');
        setIsMobile(true);
      } else if (width < 768) { // tablet pequeña (breakpoint 'md')
        setCardsToShow(2);
        setGap(24); // Coincide con sm:gap-6
        setMinCardWidth('auto');
        setIsMobile(true);
      } else if (width < 1024) { // tablet (breakpoint 'lg')
        setCardsToShow(3);
        setGap(24); // Coincide con sm:gap-6
        setMinCardWidth('auto');
        setIsMobile(false);
      } else { // desktop
        setCardsToShow(4);
        setGap(24); // Coincide con sm:gap-6
        setMinCardWidth('auto');
        setIsMobile(false);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const maxIndex = Math.max(0, proyectosData.length - cardsToShow);

  // Scroll a posición específica
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    if (container.children.length === 0) return;

    const cardElement = container.children[0] as HTMLElement;
    const cardWidth = cardElement.offsetWidth;
    
    // **MEJORA**: Usar 'gap' del estado
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const scrollLeft = () => {
    scrollToIndex(currentIndex - 1);
  };

  const scrollRight = () => {
    scrollToIndex(currentIndex + 1);
  };

  // Drag con mouse
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollContainerRef.current.scrollLeft = scrollStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      if (container.children.length === 0) return;

      const cardElement = container.children[0] as HTMLElement;
      const cardWidth = cardElement.offsetWidth;
      const scrollPos = container.scrollLeft;
      
      // **MEJORA**: Usar 'gap' del estado
      const newIndex = Math.round(scrollPos / (cardWidth + gap));
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
    }
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      {/* **CAMBIO**: Padding restaurado al contenedor principal */}
      <div className="2xl:max-w-[1650px] max-w-[1550px] mx-auto px-4 sm:px-6">
        
        {/* Header con título y controles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#005BBB] border-l-4 border-[#FFD100] pl-4 inline-block">
            Nuestras recomendaciones para ti
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <Link 
              href="/proyectos"
              className="bg-[#005BBB] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-[#004a9b] transition-all duration-300 shadow-lg flex items-center gap-2 hover:scale-105 text-sm sm:text-base whitespace-nowrap"
            >
              <span>Ver más recomendaciones</span>
            
            </Link>
          </div>
        </div>

        {/* Carrusel horizontal responsive */}
        <div className="relative">
          
          {/* **CAMBIO**: Botón izquierdo, posicionado 'left-0' (dentro del padding) */}
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            aria-label="Anterior"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 left-[-15px] w-12 h-12 bg-[#005BBB] text-white rounded-full items-center justify-center hover:bg-[#004a9b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          {/* **CAMBIO**: Wrapper del carrusel con 'md:mx-16' para hacer espacio a los botones */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2  overflow-x-auto pb-4 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing md:mx-7"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {proyectosData.map((proyecto) => (
              <div 
                key={proyecto.id} 
                className="flex-shrink-0"
                // **MEJORA**: Estilo usa 'gap' y 'cardsToShow' del estado
                style={{ 
                  width: `calc((100% - ${(cardsToShow - 1) * gap}px) / ${cardsToShow})`,
                  minWidth: minCardWidth
                }}
              >
                <ProjectCard proyecto={proyecto} />
              </div>
            ))}
          </div>

          {/* **CAMBIO**: Botón derecho, posicionado 'right-0' (dentro del padding) */}
          <button
            onClick={scrollRight}
            disabled={currentIndex >= maxIndex}
            aria-label="Siguiente"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 right-0 w-12 h-12 bg-[#005BBB] text-white rounded-full items-center justify-center hover:bg-[#004a9b] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-lg border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Indicadores de posición */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                aria-label={`Ir al slide ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#005BBB] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Proyectos;