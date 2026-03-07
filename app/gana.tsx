"use client";
import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";
import Image from "next/image";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const WHATSAPP_NUMBER = "51916194372";

const Gana = () => {
  const mensaje = `Hola Casagrande Bienes y Raíces, quiero participar en el programa de referidos.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    mensaje
  )}`;

  return (
    <section className="bg-[#01338C] py-16 text-white">
      <div className="mx-auto flex max-w-[1500px] flex-col-reverse items-center justify-between gap-12 px-6 lg:flex-row lg:px-10">
        <motion.div
          className="flex max-w-xl flex-col text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2
            className={`${bebas.className} mb-4 text-4xl leading-tight text-white drop-shadow-lg md:text-[65px]`}
          >
            <span className="text-yellow-300">
              REFIERE A FAMILIARES Y AMIGOS,
            </span>{" "}
            Y PODRÁS GANAR HASTA S/1,000
          </h2>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mx-auto w-fit cursor-pointer rounded-2xl bg-white px-20 py-5 text-[18px] font-semibold text-[#01338C] shadow-lg transition-colors duration-300 hover:bg-yellow-300 hover:text-red-800 lg:mx-0"
          >
            ¡Refiere aquí!
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Image
            src="/MASCOTA.svg"
            alt="Persona refiriendo amigos"
            width={400}
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