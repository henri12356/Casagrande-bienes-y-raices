"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
// Iconos nuevos que reflejan mejor las "ventajas"
import {FaMegaport, FaSearchPlus, FaShieldAlt, FaUserTie } from 'react-icons/fa';
import { IconType } from 'react-icons';

// Definimos el tipo para cada beneficio
interface Beneficio {
  icon: IconType;
  title: string;
  description: string;
}

// Contenido adaptado 100% a tu negocio
const beneficios: Beneficio[] = [
  {
    icon: FaMegaport,
    title: 'Publicamos tu propiedad',
    description: 'Confíanos tu casa, terreno o local. Nosotros nos encargamos de la fotografía, promoción y gestión para venderlo o alquilarlo.'
  },
  {
    icon: FaSearchPlus,
    title: 'El catálogo más completo',
    description: 'Encuentra exactamente lo que buscas. Tenemos la cartera más amplia de propiedades verificadas en la región.'
  },
  {
    icon: FaShieldAlt,
    title: 'Gestión 100% segura',
    description: 'Con años de experiencia en el rubro, te garantizamos un proceso transparente y seguro, tanto si vendes como si compras.'
  },
  {
    icon: FaUserTie,
    title: 'Asesoría experta',
    description: 'Un equipo de asesores inmobiliarios y legales te acompaña en cada paso, desde la primera visita hasta la firma del contrato.'
  },
];

// Variante de animación para los items (aparecen desde la izquierda)
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const Beneficios = () => {
  return (
    // Fondo blanco como en la imagen de ejemplo
    <section className="bg-white py-16 sm:py-24 ">
      <div className="container mx-auto px-4 max-w-6xl pt-28">
        
        {/* Título de la sección */}
        <motion.h2 
          className="text-4xl sm:text-5xl font-extrabold text-[#01338C] text-center mb-16 uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          ¡DESCUBRE POR QUÉ SOMOS TU MEJOR OPCIÓN!
        </motion.h2>

        {/* Contenedor de los beneficios (Grid) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2, // Cada item aparece uno después del otro
              },
            },
          }}
        >
          
          {beneficios.map((item, index) => (
            // Cada item de beneficio
            <motion.div
              key={index}
              className="flex items-start gap-5" // Layout de icono + texto
              variants={itemVariants}
            >
              {/* Círculo del icono (Color de acento) */}
              <div className="flex-shrink-0 bg-[#FFB200] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-md">
                <item.icon className="text-[#01338C] text-3xl sm:text-4xl" />
              </div>
              
              {/* Contenido de texto */}
              <div className="flex-grow pt-1">
                <h3 className="text-2xl font-bold text-[#01338C] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Beneficios;