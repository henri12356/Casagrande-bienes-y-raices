"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  Variants,
} from "framer-motion";

import { LuMenu, LuX, LuMapPin } from "react-icons/lu";
import { IconType } from "react-icons";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

// --- Data Configuration ---
interface NavLink {
  href: string;
  label: string;
}

interface SocialLink {
  href: string;
  label: string;
  Icon: IconType;
}

interface ContactInfoItemProps {
  text: string;
  href: string;
}

const navLinks: NavLink[] = [
  { href: "/proyectos", label: " Proyectos" },
  { href: "/terrenos", label: "Terrenos" },
  { href: "/casas", label: "Casas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Refiere y Gana" },
];

const socialLinks: SocialLink[] = [
  {
    href: "https://www.facebook.com/profile.php?id=100077864046528&locale=es_LA",
    label: "Facebook",
    Icon: FaFacebook,
  },
  {
    href: "https://www.linkedin.com/in/david-guerra-4a9b44385/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  {
    href: "https://www.youtube.com/channel/UCIuOx9lfSBKoJ5QsRlQjA7Q",
    label: "YouTube",
    Icon: FaYoutube,
  },
  {
    href: "https://www.instagram.com/casagrandegeotecnia/",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://www.tiktok.com/@casagrandegeotecnia?lang=es-419",
    label: "TikTok",
    Icon: FaTiktok,
  },
];

const contactInfo: ContactInfoItemProps[] = [
  {
    text: "Blog",
    href: "/blog",
  },
  {
    text: "Vende tu Terreno",
    href: "https://wa.me/51945513323?text=Quiero%20mayor%20información",
  },
  {
    text: "Ubicacion",
    href: "https://maps.app.goo.gl/87csZHznG2rnQQgV9",
  },
  {
    text: "Invierte aqui",
    href: "https://maps.app.goo.gl/87csZHznG2rnQQgV9",
  },
];

// --- Sub-Components ---
const ContactInfoItem = ({ text, href }: ContactInfoItemProps) => (
  <a
    href={href}
    className="flex items-center gap-2 text-[15px] text-white transition-opacity hover:opacity-80 font-bold"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>{text}</span>
  </a>
);

const SocialLinks = ({ className = "text-white" }: { className?: string }) => (
  <div className="flex items-center gap-4 ">
    {socialLinks.map(({ href, label, Icon }) => (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`transition-opacity hover:opacity-80 ${className}`}
      >
        <Icon className="h-5 w-5" />
      </a>
    ))}
  </div>
);

const TopBar = () => (
  <div className="hidden bg-[#01338C] text-white md:block ">
    <div className="container  flex h-13 items-center justify-between px-4 max-w-8xl mx-auto">
      <SocialLinks />
      <div className="flex items-center gap-6">
        {contactInfo.map((item) => (
          <ContactInfoItem key={item.text} {...item} />
        ))}
      </div>
    </div>
  </div>
);

const DesktopMenu = ({
  pathname,
  hoverVariants,
}: {
  pathname: string;
  hoverVariants: Variants;
}) => (
  <nav className="hidden items-center md:flex lg:flex gap-4">
    {navLinks.map((link) => (
      <motion.div
        key={link.href}
        initial="initial"
        whileHover="hover"
        variants={hoverVariants}
      >
        <Link
          href={link.href}
          className={`relative px-4 py-2 font-semibold text-[#01338C] transition-colors duration-300 ${
            pathname === link.href
              ? "font-bold text-[#01338C]"
              : "hover:text-sky-950"
          }`}
        >
          {link.label}
          {pathname === link.href && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 left-0 h-0.5 w-full bg-[#01338C]"
              transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
            />
          )}
        </Link>
      </motion.div>
    ))}
    <div className="hidden items-center space-x-4 md:flex lg:flex">
      <a
        href="https://wa.me/51945513323?text=Hola,%20quiero%20una%20cotización"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          size="lg"
          className="bg-[#FFB200] cursor-pointer text-white font-bold py-6 px-4 rounded-3xl shadow-md transition duration-300 border-2 ease-in-out hover:bg-[#01338C] hover:text-white hover:border-[#01338C] border-[#FFB200]"
        >
          Conctactanos
        </Button>
      </a>
    </div>
  </nav>
);

const MobileMenuButton = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => (
  <motion.button
    className="z-[100] rounded-md p-2 text-[#01338C] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-[#373737] md:hidden"
    onClick={toggle}
    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    whileTap={{ scale: 0.9 }}
  >
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={isOpen ? "x" : "menu"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <LuX className="h-7 w-7" /> : <LuMenu className="h-7 w-7" />}
      </motion.div>
    </AnimatePresence>
  </motion.button>
);

// --- Main Navbar Component ---

const Navbar = () => {
  const pathname = usePathname() || "";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (mobileMenuOpen) return;
    const isAtTop = latest < 50;
    const isScrollingUp = latest < prevScrollY;
    setIsVisible(isAtTop || isScrollingUp);
    setPrevScrollY(latest);
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // --- Framer Motion Variants ---
  const navbarVariants: Variants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
    hidden: {
      y: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const mobileMenuContainerVariants: Variants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    closed: {
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut", when: "afterChildren" },
    },
  };

  const mobileMenuItemVariants: Variants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const linkHoverVariants: Variants = {
    hover: { scale: 1.05 },
    initial: { scale: 1 },
  };

  const overlayVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50  bg-white shadow-sm backdrop-blur-md"
        variants={navbarVariants}
        animate={isVisible ? "visible" : "hidden"}
        initial="hidden"
      >
        <TopBar />
        <div className="  max-w-8xl container mx-auto flex h-20 items-center justify-between md:h-22 ">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/logo.svg"
                alt="Logo de Casagrande Geotecnia"
                width={100}
                height={48}
                className="h-11 w-auto md:h-12 max-md:px-2"
              />
            </motion.div>
          </Link>

          {/* Menú de escritorio en el centro */}
          <DesktopMenu pathname={pathname} hoverVariants={linkHoverVariants} />

          {/* Botones de acción en el escritorio */}

          {/* Botón para abrir el menú móvil */}
          <MobileMenuButton
            isOpen={mobileMenuOpen}
            toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </motion.header>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              variants={mobileMenuContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 z-50 flex h-full w-4/5 max-w-sm flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b p-4">
                <span className="font-bold text-[#01338C]">Menú</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="rounded-md p-1 text-[#01338C] transition-colors cursor-pointer hover:bg-gray-100 hover:text-[#373737]"
                >
                  <LuX className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-grow space-y-2 overflow-y-auto p-4">
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={mobileMenuItemVariants}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-4 py-3 text-base font-bold transition-colors ${
                        pathname === link.href
                          ? "bg-gray-300 text-black"
                          : "text-[#01338C] hover:bg-gray-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="space-y-4 border-t p-4 pb-20 text-sm">
                {/* Botones de acción en el menú móvil */}
                <motion.div
                  variants={mobileMenuItemVariants}
                  className="w-full space-y-2 text-4xl"
                >
                  {/* Botón WhatsApp Cotización */}
                  <a
                    href="https://wa.me/51945513323?text=Hola,%20quiero%20una%20cotización"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-[#01338C] cursor-pointer text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-[#373737]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ¡COTIZAR AHORA!
                    </Button>
                  </a>
                </motion.div>

                <div className="space-y-3">
                  {contactInfo.map((item) => (
                    <a
                      key={item.text}
                      href={item.href}
                      className="flex items-center gap-3 text-[#01338C] transition-colors hover:text-red-600"
                    >
                      <span>{item.text}</span>
                    </a>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <SocialLinks className="text-[#01338C]" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
