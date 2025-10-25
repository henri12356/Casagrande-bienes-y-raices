"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { Bebas_Neue } from "next/font/google";
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const Gana = () => {
  return (
    <section className="bg-[#01338C] text-white py-16">
      <div className="max-w-[1500px] mx-auto flex  flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-10 gap-12">
        
        {/* --- TEXTO --- */}
        <motion.div
          className="flex flex-col text-center lg:text-left max-w-xl"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={`${bebas.className} text-4xl md:text-[65px] leading-tight mb-4 text-white drop-shadow-lg`}>
            <span className="text-yellow-300">REFIERE A FAMILIARES Y AMIGOS,</span> Y PODRAS GANAR S/1,000
          </h2>
          

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[18px] cursor-pointer text-[#01338C] font-semibold px-20 py-5 rounded-2xl shadow-lg hover:bg-yellow-300 hover:text-red-800 transition-colors duration-300 w-fit mx-auto lg:mx-0"
          >
            ¡Refiere aquí!
          </motion.button>
        </motion.div>

        {/* --- IMAGEN --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Image
            src="/gana.svg"
            alt="Persona refiriendo amigos"
            width={500}
            height={400}
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Gana;
