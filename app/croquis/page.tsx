import type { Metadata } from "next";
import CroquisClient from "./croquis-client";

export const metadata: Metadata = {
  title: "Mapa satelital de proyectos",
  description:
    "Mapa satelital interactivo con rutas, distancias y tiempos hacia los proyectos de Casagrande Bienes y Raíces en Ccorihuillca, Ayacucho.",
  alternates: {
    canonical: "/croquis",
  },
};

export default function CroquisPage() {
  return <CroquisClient />;
}