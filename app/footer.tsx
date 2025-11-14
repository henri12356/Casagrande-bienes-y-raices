"use client";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaChevronUp, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

import { SiFacebook } from "react-icons/si";

const Footer = () => {
  // Data for "Acerca de" section links

  // Data for "Conecta con EDteam" sections
  const connectLinks = [
    {
      title: "Soporte al cliente",
      links: [
        { name: "(+51) 945 513 323", href: "tel:+51945513323" },
        {
          name: "comercial@casagrandegeotecnia.com.pe",
          href: "https://mail.google.com/mail/?view=cm&to=comercial@casagrandegeotecnia.com.pe",
        },
        {
          name: "Redes sociales",
          href: "https://wa.me/51927545815?text=Hola%20quiero%hacerme%20vip",
        },
      ],
    },
  ];

  // Data for "Nuestros productos" section links
  const productLinks = [
    { name: "Nosotros", href: "#" },
    { name: "Marca", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Libros", href: "#" },
  ];

  // Data for social media links
  const socialLinks = [
    {
      icon: SiFacebook,
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=100077864046528&locale=es_LA",
    },
    {
      icon: FaInstagram ,
      name: "Instagram",
      href: "https://www.instagram.com/casagrandegeotecnia/",
    },
    {
      icon: FaTiktok ,
      name: "TikTok",
      href: "https://www.tiktok.com/@casagrandegeotecnia?lang=es-419",
    },
    {
      icon: FaLinkedin ,
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/david-guerra-4a9b44385/",
    },
    {
      icon: FaYoutube ,
      name: "YouTube",
      href: "https://www.youtube.com/channel/UCIuOx9lfSBKoJ5QsRlQjA7Q",
    },
  ];

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#01338C] border-t max-md:pb-20 border-whi text-white">
      <div className="max-w-8xl container mx-auto px-4 py-8  ">
        {/* Top section: Logo and back to top */}
        <div className="hidden md:flex justify-between items-center">
          <Link
            href="/"
            className="flex items-start group relative h-12 w-48 md:h-16 md:w-64 lg:w-80 xl:w-60"
          >
            <motion.div
              className="relative h-full w-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Image
                src="/logofooter.svg"
                alt="Logo de casagrande geotecnia"
                fill
                sizes="(max-width: 768px) 192px, (max-width: 1200px) 256px, 384px"
                className="object-contain object-left transition-transform group-hover:scale-105"
                priority
              />
            </motion.div>
          </Link>
          <button
            onClick={scrollToTop}
            className="flex items-center text-sm font-medium text-white hover:text-blue-700 transition-colors group cursor-pointer"
            aria-label="Volver arriba"
          >
            Volver arriba
            <FaChevronUp className="ml-2 w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Logo */}
        <div className="flex flex-col items-center mb-6 md:hidden">
          <div className="flex items-center justify-center w-full max-w-xs">
            <Link
              href="/"
              className="flex items-center group relative h-16 md:h-12 w-full"
            >
              <motion.div
                className="relative h-full w-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <Image
                  src="/logofooter.svg"
                  alt="logo de casagrande geotecnia"
                  fill
                  sizes="100vw"
                  className="object-contain px-2 transition-transform group-hover:scale-105"
                  priority
                />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Main Grid Layout for Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-y-10 lg:gap-x-12 mb-8 sm:mb-12">
          <div className="py-8 flex flex-col md:items-start items-center">
            <div className="flex gap-3 mt-auto">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-[#01338C]  bg-white hover:text-[#0d70af] transition-colors p-2 rounded-xl hover:scale-110 transform"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={25} />
                </Link>
              ))}
            </div>
          </div>

          <div className="py-2">
            <h2 className="text-lg font-bold mb-4 text-white">
              Conecta con Nosotros
            </h2>
            <nav className="space-y-4 sm:space-y-6">
              {connectLinks.map((section) => (
                <div key={section.title}>
                  <h3 className="font-medium mb-2 sm:mb-3 text-white text-base">
                    {section.title}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white hover:text-red-600 hover:underline transition-colors flex items-center text-sm group"
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            link.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-2 flex-shrink-0 group-hover:bg-red-600 transition-colors"></span>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Section: Nuestros productos */}
          <div className="py-2">
            <h2 className="text-lg font-bold mb-4 text-white">
              Nuestros productos
            </h2>
            <nav>
              <ul className="space-y-2 sm:space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white hover:text-red-600 hover:underline transition-colors flex items-center text-sm group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-2 flex-shrink-0 group-hover:bg-red-500 transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* About description and Social Media (Desktop Only) */}
          <div className="hidden md:flex flex-col items-start py-2">
            <p className="text-white mb-4 sm:mb-6 text-sm leading-relaxed">
              Más de 20 años asegurando estabilidad y eficiencia en proyectos de
              ingeniería
            </p>
          </div>
        </div>

        {/* Social media for mobile */}
        <div className="md:hidden flex justify-center gap-4 mb-6 sm:mb-8">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              className="text-white hover:text-[#0d70af] transition-colors p-2 sm:p-3 rounded-full hover:scale-110 transform "
              aria-label={social.name}
            >
              <social.icon size={22} className="w-6 h-6" />
            </Link>
          ))}
        </div>

        <Separator className="my-4 sm:my-6 bg-gray-300" />

        {/* Copyright and Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-2 sm:pt-4">
          <div className="text-white text-xs sm:text-sm mb-3 md:mb-0 text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} Casagrande Geotecnia. Todos los
            derechos reservados.
          </div>
          <nav className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 items-center">
            <Link
              href="/terminos"
              className="text-white hover:text-[#0a5c8a] text-xs sm:text-sm whitespace-nowrap"
            >
              Términos de servicio
            </Link>
            <span className="hidden sm:inline text-gray-400">|</span>
            <Link
              href="/politica"
              className="text-white hover:text-[#0a5c8a] text-xs sm:text-sm whitespace-nowrap"
            >
              Política de privacidad
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
