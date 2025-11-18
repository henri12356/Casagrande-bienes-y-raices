"use client";

// 1. Importamos useState y AnimatePresence
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'; // Icono para cerrar

// --- DATOS DE LA LEYENDA (Sin cambios) ---
const leyenda = [
  { color: '#10B981', label: 'Casas en Venta' }, 
  { color: '#F59E0B', label: 'Terrenos' }, 
  { color: '#3B82F6', label: 'Alquileres' }, 
  { color: '#8B5CF6', label: 'Oficinas' },
];

// --- 2. DATOS DE LOS PROYECTOS (MARCADORES) ---
// Aquí defines tus proyectos. 
// 'imageUrl' es la foto que se mostrará.
// 'position' es donde irá el punto en el mapa (usa % para que sea responsivo).
interface Proyecto {
  id: string;
  title: string;
  type: 'casa' | 'terreno' | 'alquiler' | 'oficina';
  imageUrl: string; // Ruta a la imagen del proyecto
  position: { top: string; left: string; }; // Posición CSS
  color: string;
}

const proyectos: Proyecto[] = [
  { 
    id: 'p1', 
    title: 'Residencial Los Álamos', 
    type: 'casa', 
    imageUrl: '/proyectos/casa-ejemplo.jpg', // Cambia esta imagen
    position: { top: '35%', left: '40%' }, 
    color: '#10B981' 
  },
  { 
    id: 'p2', 
    title: 'Lote Industrial San Juan', 
    type: 'terreno', 
    imageUrl: '/proyectos/terreno-ejemplo.jpg', // Cambia esta imagen
    position: { top: '50%', left: '25%' }, 
    color: '#F59E0B' 
  },
  { 
    id: 'p3', 
    title: 'Oficinas Céntricas', 
    type: 'oficina', 
    imageUrl: '/proyectos/casa-ejemplo.jpg', // Cambia esta imagen
    position: { top: '65%', left: '60%' }, 
    color: '#8B5CF6' 
  },
];
// ---------------------------------------------

const Mapa = () => {
  // --- 3. ESTADO PARA EL MODAL ---
  // Guardará el proyecto seleccionado para mostrarlo
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  // ---------------------------------

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Columna de Texto (Sin cambios) --- */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span 
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: '#FFB200' }}
            >
              NUESTRA COBERTURA
            </span>
            <h2 
              className="text-4xl sm:text-5xl font-extrabold mt-3"
              style={{ color: '#01338C' }}
            >
              Presentes en las Mejores Zonas del País
            </h2>
            <p className="text-gray-600 text-lg mt-5">
              Conectamos a compradores y vendedores con las mejores oportunidades inmobiliarias.
            </p>
            <motion.div 
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-gray-500 text-sm">Propiedades Activas</span>
              <p 
                className="text-4xl font-bold"
                style={{ color: '#01338C' }}
              >
                +500 Propiedades
              </p>
            </motion.div>
          </motion.div>

          {/* --- Columna de Mapa y Leyenda --- */}
          <motion.div 
            className="relative" // Contenedor 'relative' es clave
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            
            {/* Leyenda (Sin cambios) */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-4 z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h4 className="font-bold text-gray-800 text-sm mb-3">Tipo de Propiedad</h4>
              <div className="space-y-2">
                {leyenda.map((item) => (
                  <div key={item.label} className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-gray-700 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Imagen del Mapa (Base) */}
            <Image
              src="/mapa.svg" 
              alt="Mapa de cobertura nacional"
              width={450} // Proporción 4:3 (ajusta si es necesario)
              height={200} // Proporción 4:3
              className="  h-auto" // Se ajustará al contenedor
            />

            {/* --- 4. MARCADORES (SEÑALES) --- */}
            {/* Mapeamos los proyectos y los posicionamos de forma absoluta */}
            {proyectos.map((proyecto) => (
              <motion.button
                key={proyecto.id}
                className="absolute z-0 flex items-center justify-center"
                style={{
                  top: proyecto.position.top,
                  left: proyecto.position.left,
                  transform: 'translate(-50%, -50%)', // Centra el punto
                }}
                onClick={() => setSelectedProject(proyecto)} // Abre el modal
                whileHover={{ scale: 1.5 }}
                aria-label={`Ver ${proyecto.title}`}
              >
                {/* Punto interior sólido */}
                <span 
                  className="relative inline-flex rounded-full h-4 w-4"
                  style={{ backgroundColor: proyecto.color }}
                ></span>
                {/* Animación de pulso */}
                <span 
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ backgroundColor: proyecto.color }}
                ></span>
              </motion.button>
            ))}
            {/* ---------------------------------- */}
            
          </motion.div>
        </div>
      </div>

      {/* --- 5. MODAL (VENTANA EMERGENTE) --- */}
      {/* Aparece cuando 'selectedProject' no es nulo */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Fondo oscuro con clic para cerrar */}
            <motion.div 
              className="absolute inset-0 bg-black/70"
              onClick={() => setSelectedProject(null)}
            ></motion.div>
            
            {/* Contenido del Modal */}
            <motion.div 
              className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {/* Botón de Cerrar */}
              <button 
                onClick={() => setSelectedProject(null)} 
                className="absolute top-3 right-3 bg-[#FFB200] text-[#01338C] rounded-full p-2 z-10"
                aria-label="Cerrar"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              
              {/* Imagen del Proyecto */}
              <div className="w-full h-auto max-h-[70vh]">
                <Image 
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Título y Detalles */}
              <div className="p-6">
                <h3 className="text-2xl font-bold" style={{ color: '#01338C' }}>
                  {selectedProject.title}
                </h3>
                <span 
                  className="text-sm font-semibold p-1 rounded text-white" 
                  style={{ backgroundColor: selectedProject.color }}
                >
                  {selectedProject.type}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---------------------------------- */}

    </section>
  );
};

export default Mapa;