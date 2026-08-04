"use client";

import { useEffect, useMemo, useState } from "react";

type EstadoLote = "disponible" | "reservado" | "vendido";

type CuotaMensual = {
  numero: number;
  fechaVencimiento: string;
  monto: number;
  pagada: boolean;
  fechaPago?: string;
};

type LoteLocal = {
  id: string;
  numero: string;
  area: number;
  precioLista: number;
  estado: EstadoLote;
  actualizadoEn?: string;
  cliente?: {
    nombres: string;
    dni: string;
    celular: string;
    asesor: string;
    observaciones: string;
  };
  operacion?: {
    fechaOperacion: string;
    precioVenta: number;
    inicial: number;
    saldo: number;
    modalidadPago: "Contado" | "Financiado";
    cuotas: number;
    cuotasMensuales?: CuotaMensual[];
    fechaLimiteReserva?: string;
    pagoInicialConfirmado?: boolean;
  };
};

type ProyectoLocal = {
  slug: string;
  titulo: string;
  ubicacion: string;
  imagen: string;
  areaTipica: number;
  precioDesde: number;
  lotes: LoteLocal[];
};

const STORAGE_KEY = "casagrande-panel-clientes-lotes-v3";

function leerProyectos(): ProyectoLocal[] {
  if (typeof window === "undefined") return [];

  try {
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (!guardado) return [];

    const datos: unknown = JSON.parse(guardado);
    return Array.isArray(datos) ? (datos as ProyectoLocal[]) : [];
  } catch (error) {
    console.error("No se pudo leer la disponibilidad local:", error);
    return [];
  }
}

/**
 * Lee la disponibilidad registrada por el panel comercial.
 *
 * IMPORTANTE:
 * - Se sincroniza entre páginas y pestañas del mismo navegador.
 * - No sincroniza computadoras distintas.
 * - Para sincronización global se necesita una fuente de datos compartida.
 */
export function useDisponibilidadLocal(slug: string) {
  const [proyectos, setProyectos] = useState<ProyectoLocal[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const actualizar = () => {
      setProyectos(leerProyectos());
      setCargando(false);
    };

    const manejarStorage = (evento: StorageEvent) => {
      if (evento.key === STORAGE_KEY) actualizar();
    };

    actualizar();
    window.addEventListener("storage", manejarStorage);
    window.addEventListener("focus", actualizar);

    return () => {
      window.removeEventListener("storage", manejarStorage);
      window.removeEventListener("focus", actualizar);
    };
  }, []);

  const proyecto = useMemo(
    () => proyectos.find((item) => item.slug === slug),
    [proyectos, slug],
  );

  const resumen = useMemo(() => {
    const lotes = proyecto?.lotes ?? [];

    return {
      total: lotes.length,
      disponibles: lotes.filter((lote) => lote.estado === "disponible").length,
      reservados: lotes.filter((lote) => lote.estado === "reservado").length,
      vendidos: lotes.filter((lote) => lote.estado === "vendido").length,
    };
  }, [proyecto]);

  return {
    proyecto,
    lotes: proyecto?.lotes ?? [],
    resumen,
    cargando,
  };
}