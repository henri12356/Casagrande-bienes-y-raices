"use client"; 

// 1. Importamos 'Variants' junto a 'motion'
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FaSearch, FaRegClock, FaHome, FaMedal, FaSign, FaRegHandshake } from 'react-icons/fa';
import { IconType } from 'react-icons';

// ... (El resto de tu interfaz y array de 'features' sigue igual)
interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FaSearch,
    title: 'Encuentra tu propiedad ideal',
    description: 'Explora nuestra cartera exclusiva de terrenos, casas y alquileres. Usa nuestros filtros para hallar lo que buscas.'
  },
  {
    icon: FaSign, // Icono de "letrero" (Venta/Alquiler)
    title: 'Publica con nosotros',
    description: 'Confíanos tu propiedad. Nos encargamos de la gestión y la conectamos con miles de compradores potenciales.'
  },
  {
    icon: FaRegHandshake, // Icono de "acuerdo"
    title: 'Asesoría de principio a fin',
    description: 'Tanto si compras, vendes o alquilas, nuestro equipo de expertos te acompaña en todo el proceso legal y comercial.'
  },
  {
    icon: FaMedal,
    title: 'Somos tus expertos de confianza',
    description: 'Años de experiencia en el mercado local y cientos de clientes satisfechos nos respaldan como tu mejor aliado.'
  },
];
// ...

// 2. Aplicamos el tipo 'Variants' a nuestra constante
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Proceso = () => {
  return (
    // 3. Actualizamos la clase de Tailwind
    <section className="bg-linear-to-b from-gray-50 to-gray-100 py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Título de la sección */}
        <h2 
          className="text-4xl sm:text-5xl font-extrabold text-[#01338C] text-center mb-16 relative"
        >
          <span className="relative z-10">Te acompañamos en cada paso</span>
          <span className="absolute bottom-0 left-1/2 w-3/4 h-3 bg-[#FFB200] opacity-50 transform -translate-x-1/2 z-0 rounded-full"></span>
        </h2>

        {/* Contenedor de las tarjetas */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-100"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                transition: { duration: 0.2 } 
              }}
            >
              {/* Círculo contenedor del icono */}
              <div className="bg-[#FFB200] bg-opacity-20 rounded-full p-5 mb-6 inline-block transform transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="text-4xl text-[#01338C]" />
              </div>
              
              {/* Título de la tarjeta */}
              <h3 className="text-2xl font-semibold text-[#01338C] mb-3">
                {feature.title}
              </h3>
              
              {/* Descripción de la tarjeta */}
              <p className="text-gray-700 text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Proceso;