"use client";

import React, { useState, FC, ReactNode, ComponentProps } from "react";
import { motion } from "framer-motion";

// --- COMPONENTES SIMULADOS ---
interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
  className?: string;
}
interface InputProps extends ComponentProps<"input"> {
  className?: string;
}
interface CheckboxProps extends ComponentProps<"input"> {
  id: string;
  className?: string;
}
interface SelectProps extends ComponentProps<"div"> {
  children: ReactNode;
  placeholder: string;
  className?: string;
}
interface SelectItemProps {
  value: string;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`py-3 px-4 rounded-lg transition-colors font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input: FC<InputProps> = ({ className, ...props }) => (
  <input
    className={`w-full p-2 border-none rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#005BBB] focus:border-[#005BBB] transition-shadow ${className}`}
    {...props}
  />
);

const Checkbox: FC<CheckboxProps> = ({ id, className, ...props }) => (
  <input
    type="checkbox"
    id={id}
    className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-[#005BBB] focus:ring-[#005BBB] transition-colors ${className}`}
    {...props}
  />
);

const Select: FC<SelectProps> = ({ children, placeholder, className, ...props }) => {
  const [value, setValue] = useState<string>("");
  return (
    <div className={`relative ${className}`} {...props}>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-[#005BBB] focus:border-[#005BBB] transition-shadow appearance-none pr-8 bg-white"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23005BBB%22%20d%3D%22M287%2C130.6L154.7%2C8.4a5.1%2C5.1%2C0%2C0%2C0-7.3%2C0L5.4%2C130.6c-1.4%2C1.4-2.1%2C3.1-2.1%2C5s0.7%2C3.6%2C2.1%2C5l147%2C147c1.4%2C1.4%2C3.1%2C2.1%2C5%2C2.1s3.6-0.7%2C5-2.1l147-147c1.4-1.4%2C2.1-3.1%2C2.1-5s-0.7-3.6-2.1-5z%22/%3E%3C/svg%3E")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.7em center",
          backgroundSize: "0.65em auto",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
    </div>
  );
};

const SelectItem: FC<SelectItemProps> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// --- FORMULARIO ---
const Formulario = () => {
  const imageUrl = "/fondoformulario.webp";

  return (
    <section className="relative w-full min-h-[80vh] bg-white">
      {/* Contenedor principal para el texto y el formulario (arriba) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10  pb-20  ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* BLOQUE DE TEXTO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-black mt-4 lg:mt-0" // Texto ahora en color negro para contrastar con fondo blanco
          >
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Descubre lo que tenemos para cumplir tus sueños
            </h2>
          </motion.div>

          {/* BLOQUE DEL FORMULARIO */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#005BBB] text-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md lg:mt-0"
          >
            <h3 className="text-lg font-bold text-center mb-5 flex items-center justify-center">
             
              Quiero recibir información
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Nombre*" className="bg-white text-black text-sm" />
                <Input placeholder="Apellidos*" className="bg-white text-black text-sm" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Nro. doc.*"
                  className="bg-white text-black text-sm col-span-1"
                />
                <div className="col-span-2 flex items-center bg-white text-black rounded-lg text-sm h-9">
                  <span className="mr-1 text-gray-600 font-medium pl-2 border-r border-gray-300">
                    +51
                  </span>
                  <input
                    type="tel"
                    placeholder="Teléfono*"
                    className="flex-1 outline-none bg-transparent text-sm p-1.5"
                  />
                </div>
              </div>

              <Input
                placeholder="Correo electrónico*"
                className="bg-white text-black text-sm"
                type="email"
              />

              <Select placeholder="Ubicación" className="text-sm">
                <SelectItem value="ayacucho">Ayacucho</SelectItem>
                <SelectItem value="huamanga">Huamanga</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </Select>

              <div className="p-2 rounded-lg bg-gray-200 text-gray-600 text-sm font-medium text-center opacity-80">
                No hay proyectos disponibles
              </div>

              <div className="space-y-2 text-xs text-white pt-2">
                <label htmlFor="terms" className="flex items-start space-x-2 cursor-pointer">
                  <Checkbox
                    id="terms"
                    className="mt-0.5 border-white/50 bg-[#005BBB] checked:bg-[#FFD100] checked:border-[#FFD100] focus:ring-[#FFD100]"
                  />
                  <span className="leading-snug">
                    He leído y acepto el{" "}
                    <a
                      href="#"
                      className="underline font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
                    >
                      Tratamiento de mis datos personales
                    </a>.
                  </span>
                </label>

                <label htmlFor="policy" className="flex items-start space-x-2 cursor-pointer">
                  <Checkbox
                    id="policy"
                    className="mt-0.5 border-white/50 bg-[#005BBB] checked:bg-[#FFD100] checked:border-[#FFD100] focus:ring-[#FFD100]"
                  />
                  <span className="leading-snug">
                    He leído y acepto la{" "}
                    <a
                      href="#"
                      className="underline font-bold text-yellow-300 hover:text-yellow-200 transition-colors"
                    >
                      Política para envío de comunicaciones comerciales
                    </a>.
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFD100] text-[#005BBB] font-extrabold text-base uppercase mt-6 hover:bg-[#ffe14d]"
              >
                Solicitar información
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Imagen de fondo (abajo) */}
      <div
        className="absolute bottom-0 left-0 w-full h-[65vh] bg-cover bg-center" // La imagen se ancla al fondo
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    </section>
  );
};

export default Formulario;
