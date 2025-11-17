"use client";

import React from 'react';
import { motion } from 'framer-motion';
// Importamos Next/Image para optimizar la imagen PNG
import Image from 'next/image';

const Hero = () => {
  return (
    <section 
      // Fondo azul sólido de tu marca
      className="bg-[#01338C] pt-28"
    >
      <div className="container mx-auto px-4 py-24 sm:py-32 max-w-7xl ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Columna de Texto --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
              ENCUENTRA EL HOGAR 
              <br />
              DE TUS <span className="text-[#FFB200]">SUEÑOS</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-lg">
              Casas, terrenos y alquileres. Explora nuestra cartera de propiedades y déjate asesorar por expertos.
            </p>
            <motion.button
              className="mt-10 bg-[#FFB200] text-[#01338C] font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Propiedades
            </motion.button>
          </motion.div>

          {/* --- Columna de Imagen --- */}
          <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
     
            <Image 
                src="/heronosotros.png" 
                alt="Pareja feliz con su nueva propiedad" 
                width={800} // Ancho real de tu imagen
                height={600} // Alto real de tu imagen
                priority={true} // Carga la imagen más rápido (importante para el Hero)
                className="max-w-full h-auto"
            />
            
           

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;