"use client";

import React, { useState, FC, ReactNode, ComponentProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// --- Interfaces ---
interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
  className?: string;
  isLoading?: boolean; // Nuevo prop para manejar la carga
}
interface InputProps extends ComponentProps<"input"> {
  className?: string;
}
interface CheckboxProps extends ComponentProps<"input"> {
  id: string;
  className?: string;
}
interface SelectProps extends Omit<ComponentProps<"div">, "onChange"> {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

// --- Componentes ---
const Button: FC<ButtonProps> = ({ children, className, isLoading = false, disabled, ...props }) => (
  <button
    className={`py-3 px-4 rounded-lg transition-colors font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className} ${
      (disabled || isLoading) ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"
    } flex justify-center items-center gap-2`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && (
      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    )}
    {!isLoading && children}
  </button>
);

const Input: FC<InputProps> = ({ className, ...props }) => (
  <input
    className={`w-full p-3 border-none rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#005BBB] focus:border-[#005BBB] transition-shadow ${className}`}
    {...props}
  />
);

const Checkbox: FC<CheckboxProps> = ({ id, className, ...props }) => (
  <input
    type="checkbox"
    id={id}
    className={`appearance-none w-5 h-5 rounded-full border-2 border-white checked:bg-yellow-300 checked:border-yellow-300 transition-all duration-200 cursor-pointer shrink-0 aspect-square ${className}`}
    {...props}
  />
);

const Select: FC<SelectProps> = ({
  placeholder,
  value,
  onChange,
  options,
  className,
  ...props
}) => (
  <div className={`relative ${className}`} {...props}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#005BBB] focus:border-[#005BBB] transition-shadow appearance-none pr-10 bg-white"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23005BBB' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.8em center",
        backgroundSize: "1em",
      }}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Componente de Mensaje de Éxito
const SuccessMessage: FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    className="flex flex-col items-center justify-center h-full text-center p-6"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: 360 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      className="bg-yellow-300 text-[#005BBB] rounded-full p-4 mb-6 shadow-xl"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9.5l-8 8z"/>
      </svg>
    </motion.div>
    <h3 className="text-3xl font-bold mb-4">¡Gracias por tu interés!</h3>
    <p className="text-lg leading-relaxed">
      Hemos recibido tus datos con éxito. En breve, nuestro equipo comercial se pondrá en contacto contigo para ofrecerte la mejor información.
    </p>
  </motion.div>
);

// Función de envío simulada
const simulateApiCall = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simula 2 segundos de latencia de red
  });
};


// --- Formulario ---
const Formulario = () => {
  const imageUrl = "/fondoformulario.webp";

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [vivienda, setVivienda] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const [errors, setErrors] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    telefono: "",
    correo: "",
    vivienda: "",
    proyecto: "",
    terms: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Nuevo estado
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Proyectos según la ciudad
  const proyectosPorCiudad: Record<string, { value: string; label: string }[]> = {
    ayacucho: [
      { value: "proyecto1", label: "Proyecto 1 Ayacucho" },
      { value: "proyecto2", label: "Proyecto 2 Ayacucho" },
    ],
    huamanga: [
      { value: "proyectoA", label: "Proyecto A Huamanga" },
      { value: "proyectoB", label: "Proyecto B Huamanga" },
    ],
    otros: [
      { value: "proyectoX", label: "Proyecto X" },
      { value: "proyectoY", label: "Proyecto Y" },
    ],
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      nombre: nombre ? "" : "Debes ingresar tu nombre",
      apellidos: apellidos ? "" : "Debes ingresar tus apellidos",
      documento:
        documento.length === 8 && /^\d+$/.test(documento)
          ? ""
          : "Ingresa un DNI válido de 8 números",
      telefono:
        telefono.length === 9 && /^\d+$/.test(telefono)
          ? ""
          : "Ingresa un teléfono válido de 9 números",
      correo:
      correo && !correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ? "Ingresa un correo válido"
        : "", // <-- Si correo está vacío, no hay error
      vivienda: vivienda ? "" : "Debes seleccionar una opción",
      proyecto: proyecto ? "" : "Debes seleccionar un proyecto",
      terms: termsChecked ? "" : "Debes aceptar el tratamiento de datos",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Si la validación es exitosa
    setIsLoading(true);
    
    // Aquí iría tu lógica real de API/Base de datos
    console.log("Datos a enviar:", { nombre, apellidos, documento, telefono, correo, vivienda, proyecto, termsChecked });
    
    await simulateApiCall(); // Espera la simulación de envío
    
    setIsLoading(false);
    setIsSubmitted(true); // Muestra el mensaje de éxito
    
    // Opcional: podrías limpiar el formulario aquí si quisieras,
    // pero es mejor dejarlo para que el usuario vea los datos que envió.
  };

  return (
    <section className={`${poppins.className} relative w-full min-h-[80vh] bg-white`}>
      <div className="relative z-10 max-w-7xl px-4 2xl:max-w-[1500px] mx-auto pb-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-[#0c3f99] mt-4 lg:mt-0 font-black"
          >
            <h2 className="text-4xl md:text-[40px] font-bold leading-tight">
              Descubre lo que tenemos para cumplir tus sueños
            </h2>
          </motion.div>

          {/* Contenedor del Formulario/Mensaje */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#005BBB] text-white p-4 md:p-8 rounded-4xl shadow-2xl w-full max-w-[460px] min-h-[600px] lg:mt-0"
          >
            <h3 className="text-[26px] font-semibold text-center mb-6">
              Quiero recibir información
            </h3>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                // 1. Mensaje de éxito
                <SuccessMessage key="success" />
              ) : (
                // 2. Formulario visible
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={handleSubmit}
                >
                  {/* Nombre y Apellidos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Nombre*"
                        className="bg-white text-black text-sm py-3.5"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                      {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                    </div>
                    <div>
                      <Input
                        placeholder="Apellidos*"
                        className="bg-white text-black text-sm py-3.5"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                      />
                      {errors.apellidos && <p className="text-red-400 text-sm mt-1">{errors.apellidos}</p>}
                    </div>
                  </div>

                  {/* Documento y Teléfono (solo números) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Nro. documento*"
                        className="bg-white text-black text-sm py-3.5"
                        value={documento}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) setDocumento(val);
                        }}
                        maxLength={8}
                        inputMode="numeric"
                        pattern="\d*"
                      />
                      {errors.documento && <p className="text-red-400 text-sm mt-1">{errors.documento}</p>}
                    </div>
                    <div>
                      <Input
                        placeholder="Teléfono*"
                        className="bg-white text-black text-sm py-3.5"
                        value={telefono}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) setTelefono(val);
                        }}
                        maxLength={9}
                        inputMode="numeric"
                        pattern="\d*"
                      />
                      {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
                    </div>
                  </div>

                  {/* Correo */}
                  <div>
                    <Input
                      placeholder="Correo electrónico*"
                      className="bg-white text-black text-md py-3.5"
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                    {errors.correo && <p className="text-red-400 text-sm mt-1">{errors.correo}</p>}
                  </div>

                  {/* Select ciudad */}
                  <div>
                    <Select
                      placeholder="¿Dónde quieres vivir?"
                      value={vivienda}
                      onChange={(val) => {
                        setVivienda(val);
                        setProyecto("");
                      }}
                      options={[
                        { value: "ayacucho", label: "Ayacucho" },
                        { value: "huamanga", label: "Huamanga" },
                        { value: "otros", label: "Otros" },
                      ]}
                    />
                    {errors.vivienda && <p className="text-red-400 text-sm mt-1">{errors.vivienda}</p>}
                  </div>

                  {/* Select proyecto dinámico */}
                  {vivienda && proyectosPorCiudad[vivienda] && (
                    <div>
                      <Select
                        placeholder="Selecciona un proyecto"
                        value={proyecto}
                        onChange={setProyecto}
                        options={proyectosPorCiudad[vivienda]}
                        className="mt-2"
                      />
                      {errors.proyecto && <p className="text-red-400 text-sm mt-1">{errors.proyecto}</p>}
                    </div>
                  )}

                  {/* Checkbox términos */}
                  <div className="space-y-5 text-sm text-white pt-2">
                    <label
                      htmlFor="terms"
                      className="flex items-start gap-2 cursor-pointer select-none"
                    >
                      <Checkbox
                        id="terms"
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                      />
                      <span className="leading-snug">
                        He leído y acepto el{" "}
                        <a
                          href="#"
                          className="underline font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
                        >
                          Tratamiento de mis datos personales
                        </a>
                        .
                      </span>
                    </label>
                    {errors.terms && <p className="text-red-400 text-sm mt-1">{errors.terms}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#FFD100] text-[#005BBB] font-extrabold text-base uppercase mt-6 hover:bg-[#ffe14d]"
                    isLoading={isLoading} // Muestra el spinner de carga
                  >
                    {isLoading ? "Enviando..." : "Solicitar información"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Fondo */}
      <div
        className="absolute bottom-0 left-0 w-full h-[65vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 "></div>
      </div>
    </section>
  );
};

export default Formulario;
