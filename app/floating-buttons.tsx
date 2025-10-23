"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaArrowRight, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineDotsVertical, HiOutlineMail } from "react-icons/hi";

interface SocialFloatingButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  target?: string;
  bgColor: string;
  hoverBgColor: string;
  className?: string;
}

interface MoreOption {
  text: string;
  href: string;
  icon: React.ReactNode;
}

// 💬 Botón individual con mensaje de WhatsApp animado
const SocialFloatingButton: React.FC<SocialFloatingButtonProps> = ({
  icon,
  label,
  href,
  target = "_blank",
  bgColor,
  hoverBgColor,
  className,
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Aparece el mensaje después de 2 segundos
    const showTimer = setTimeout(() => setShowMessage(true), 2000);
    // Desaparece después de 20 segundos
    const hideTimer = setTimeout(() => setShowMessage(false), 22000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="relative group">
      <motion.a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white text-xl transition-all duration-300 transform hover:scale-110 ${bgColor} ${hoverBgColor} ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={label}
      >
        {icon}
      </motion.a>

      {/* Burbuja de mensaje solo en desktop */}
      {label.toLowerCase().includes("asesoría") && (
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="hidden md:block absolute right-full mr-3 bottom-2 bg-green-100/90 text-gray-800 text-sm px-4 py-2 rounded-2xl shadow-lg border border-green-200 backdrop-blur-sm whitespace-nowrap"
            >
              💬 ¡Hola! 👋 ¿Necesitas ayuda?
              {/* Triángulo del globo */}
              <div className="absolute -right-2 bottom-3 w-0 h-0 border-l-8 border-l-green-100/90 border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// Botón de más opciones
const MoreOptionItem: React.FC<MoreOption> = ({ text, href, icon }) => (
  <motion.a
    href={href}
    className="flex items-center justify-between w-[calc(100vw-8rem)] max-w-full md:w-72 p-4 bg-black text-white text-base rounded-md shadow-md transition-colors duration-200 hover:bg-[#E60012] group"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    layout
  >
    <span className="font-semibold">{text}</span>
    <motion.span
      className="text-red-500 group-hover:text-white transition-colors duration-200"
      initial={{ x: 0 }}
      whileHover={{ x: 5 }}
    >
      {icon}
    </motion.span>
  </motion.a>
);

const FloatingButtons: React.FC = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const moreOptionsData: MoreOption[] = [
    { text: "Inicio", href: "/", icon: <FaArrowRight /> },
    { text: "Nosotros", href: "/nosotros", icon: <FaArrowRight /> },
    { text: "Servicios", href: "/servicios", icon: <FaArrowRight /> },
    { text: "Proyectos", href: "/proyectos", icon: <FaArrowRight /> },
    { text: "Blog", href: "/blog", icon: <FaArrowRight /> },
    { text: "Contacto", href: "/contacto", icon: <FaArrowRight /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <>
      {/* --- Desktop Buttons --- */}
      <div className="hidden md:flex fixed bottom-6 right-6 flex-col space-y-4 z-50">
        <SocialFloatingButton
          icon={<FaWhatsapp />}
          label="Necesitas Asesoría?"
          href="https://api.whatsapp.com/send?phone=51945513323&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios."
          bgColor="bg-green-400"
          hoverBgColor="hover:bg-green-500"
        />

        <SocialFloatingButton
          icon={<FaLinkedinIn />}
          label="LinkedIn"
          href="https://www.linkedin.com/company/casagrande-geotecnia-y-concreto/about/"
          bgColor="bg-blue-700"
          hoverBgColor="hover:bg-[#0A66C2]"
        />

        <SocialFloatingButton
          icon={<HiOutlineMail />}
          label="Correo"
          href="mailto:comercial@casagrandegeotecnia.com.pe"
          bgColor="bg-red-500"
          hoverBgColor="hover:bg-red-600"
        />

        {/* Botón Más opciones */}
        <motion.div className="relative">
          <motion.button
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white text-xl bg-gray-700 hover:bg-gray-800 transition-all duration-300"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            <HiOutlineDotsVertical />
          </motion.button>
          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full right-0 mb-4 flex flex-col space-y-2"
              >
                {moreOptionsData.map((option, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <MoreOptionItem {...option} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- Mobile Buttons --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-3 px-4 flex justify-around items-center shadow-lg z-50">
        <SocialFloatingButton
          icon={<FaWhatsapp />}
          label="Asesoría"
          href="https://api.whatsapp.com/send?phone=51945513323&text=Hola!%20Estoy%20interesado%20en%20sus%20servicios."
          bgColor="bg-green-400"
          hoverBgColor="hover:bg-green-500"
          className="w-10 h-10 text-lg"
        />
        <SocialFloatingButton
          icon={<FaLinkedinIn />}
          label="LinkedIn"
          href="https://www.linkedin.com/in/henri-delacruz/"
          bgColor="bg-blue-700"
          hoverBgColor="hover:bg-blue-800"
          className="w-10 h-10 text-lg"
        />
        <SocialFloatingButton
          icon={<HiOutlineMail />}
          label="Correo"
          href="mailto:comercial@casagrandegeotecnia.com.pe"
          bgColor="bg-red-500"
          hoverBgColor="hover:bg-red-600"
          className="w-10 h-10 text-lg"
        />
        <motion.div className="relative">
          <motion.button
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg text-white text-lg bg-gray-700 hover:bg-gray-800 transition-all duration-300"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            <HiOutlineDotsVertical />
          </motion.button>
          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute bottom-full mb-3 flex flex-col space-y-2 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm"
              >
                {moreOptionsData.map((option, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <MoreOptionItem {...option} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default FloatingButtons;
