"use client";

import {
  AlarmClock,
  AlertTriangle,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileClock,
  FileUp,
  Filter,
  History,
  LockKeyhole,
  MapPin,
  Pencil,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type EstadoLote = "disponible" | "reservado" | "vendido" | "bloqueado";
type ModalidadPago = "Contado" | "Financiado";
type Vista = "lotes" | "clientes";
type AccionMovimiento =
  | "reserva"
  | "venta"
  | "bloqueo"
  | "actualizacion"
  | "liberacion"
  | "vencimiento";

type Cliente = {
  nombres: string;
  dni: string;
  celular: string;
  direccion: string;
  asesor: string;
  observaciones: string;
};

type Operacion = {
  fechaOperacion: string;
  precioVenta: number;
  montoReserva: number;
  inicial: number;
  saldo: number;
  modalidadPago: ModalidadPago;
  cuotas: number;
  fechaLimiteReserva?: string;
  pagoReservaConfirmado?: boolean;
  fechaPagoReserva?: string;
  liberacionAutomatica?: boolean;
};

type MovimientoLote = {
  id: string;
  fecha: string;
  accion: AccionMovimiento;
  descripcion: string;
  cliente?: Cliente;
  operacion?: Operacion;
};

type Lote = {
  id: string;
  numero: string;
  area: number;
  precioLista: number;
  estado: EstadoLote;
  cliente?: Cliente;
  operacion?: Operacion;
  movimientos?: MovimientoLote[];
  actualizadoEn?: string;
};

type Proyecto = {
  slug: string;
  titulo: string;
  ubicacion: string;
  imagen: string;
  areaTipica: number;
  precioDesde: number;
  lotes: Lote[];
};

type ProyectoBase = Omit<Proyecto, "lotes"> & {
  cantidadLotes: number;
  prefijo: string;
};

type FormularioFicha = {
  estado: EstadoLote;
  nombres: string;
  dni: string;
  celular: string;
  direccion: string;
  asesor: string;
  observaciones: string;
  fechaOperacion: string;
  precioVenta: string;
  montoReserva: string;
  inicial: string;
  modalidadPago: ModalidadPago;
  cuotas: string;
  fechaLimiteReserva: string;
  pagoReservaConfirmado: boolean;
  fechaPagoReserva: string;
  liberacionAutomatica: boolean;
};

const STORAGE_KEY = "casagrande-panel-clientes-lotes-v2";
const STORAGE_KEY_ANTERIOR = "casagrande-panel-clientes-lotes-v1";
const DIAS_RESERVA_POR_DEFECTO = 3;
const MAX_MOVIMIENTOS_POR_LOTE = 50;

const PROYECTO_SLUG_ALIASES: Record<string, string> = {
  "machayhuycco-ayacucho02": "el-mirador-de-ccorihuillca-ayacucho",
};

const PROYECTOS_BASE: ProyectoBase[] = [
  {
    slug: "el-golf-de-ccorihuillca-ayacucho",
    titulo: "EL GOLF DE CCORIHUILLCA",
    ubicacion: "Al lado de Ccorihuillca Chico, en el mismo pueblo",
    imagen: "/ELGOLF/ELGOLF01.webp",
    areaTipica: 180,
    precioDesde: 24000,
    cantidadLotes: 20,
    prefijo: "G",
  },
  {
    slug: "la-planicie-ayacucho",
    titulo: "LA PLANICIE",
    ubicacion: "A 10 minutos de La Picota – Ccorihuillca, Ayacucho",
    imagen: "/LAPLANICIE/LAPLANICIE01.webp",
    areaTipica: 180,
    precioDesde: 18000,
    cantidadLotes: 24,
    prefijo: "L",
  },
  {
    slug: "machayhuycco-ayacucho",
    titulo: "CAMPO REAL",
    ubicacion: "Machayhuaycco, Huamanga – Ayacucho",
    imagen: "/MACHAYHUAYCCO/MACHAYHUAYCCOHERO.webp",
    areaTipica: 200,
    precioDesde: 15000,
    cantidadLotes: 12,
    prefijo: "C",
  },
  {
    slug: "el-mirador-de-ccorihuillca-ayacucho",
    titulo: "EL MIRADOR",
    ubicacion: "Ccorihuillca Chico, Huamanga – Ayacucho",
    imagen: "/MACHAYHUAYCCO/MACHAYHUAYCCOHERO.webp",
    areaTipica: 500,
    precioDesde: 15000,
    cantidadLotes: 12,
    prefijo: "M",
  },
];

const ESTADO_CONFIG: Record<
  EstadoLote,
  { label: string; card: string; dot: string; badge: string }
> = {
  disponible: {
    label: "Disponible",
    card: "border-emerald-200 bg-emerald-50 hover:border-emerald-400",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  reservado: {
    label: "Reservado",
    card: "border-amber-200 bg-amber-50 hover:border-amber-400",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800",
  },
  vendido: {
    label: "Vendido",
    card: "border-rose-200 bg-rose-50 hover:border-rose-400",
    dot: "bg-rose-500",
    badge: "bg-rose-100 text-rose-800",
  },
  bloqueado: {
    label: "Bloqueado",
    card: "border-slate-300 bg-slate-100 hover:border-slate-500",
    dot: "bg-slate-500",
    badge: "bg-slate-200 text-slate-800",
  },
};

function fechaActualISO() {
  const fecha = new Date();
  const offset = fecha.getTimezoneOffset();
  return new Date(fecha.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

function sumarDiasISO(fechaISO: string, dias: number) {
  const fecha = new Date(`${fechaISO}T12:00:00`);
  fecha.setDate(fecha.getDate() + dias);
  const offset = fecha.getTimezoneOffset();
  return new Date(fecha.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

function diasHasta(fechaISO?: string) {
  if (!fechaISO) return null;
  const hoy = new Date(`${fechaActualISO()}T12:00:00`).getTime();
  const objetivo = new Date(`${fechaISO}T12:00:00`).getTime();
  return Math.round((objetivo - hoy) / 86_400_000);
}

function fechaEsValida(valor?: string) {
  return Boolean(valor && /^\d{4}-\d{2}-\d{2}$/.test(valor));
}

function idSeguro() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clonarCliente(cliente?: Cliente): Cliente | undefined {
  return cliente ? { ...cliente } : undefined;
}

function clonarOperacion(operacion?: Operacion): Operacion | undefined {
  return operacion ? { ...operacion } : undefined;
}

function crearMovimiento(
  accion: AccionMovimiento,
  descripcion: string,
  cliente?: Cliente,
  operacion?: Operacion,
): MovimientoLote {
  return {
    id: idSeguro(),
    fecha: new Date().toISOString(),
    accion,
    descripcion,
    cliente: clonarCliente(cliente),
    operacion: clonarOperacion(operacion),
  };
}

function agregarMovimiento(lote: Lote, movimiento: MovimientoLote) {
  return [...(lote.movimientos ?? []), movimiento].slice(
    -MAX_MOVIMIENTOS_POR_LOTE,
  );
}

function moneda(valor: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(valor) ? valor : 0);
}

function textoFecha(valor?: string) {
  if (!valor) return "Sin fecha";
  const fecha = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return "Fecha inválida";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(fecha);
}

function textoFechaHora(valor?: string) {
  if (!valor) return "Sin fecha";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return "Fecha inválida";
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
}

function crearProyectosIniciales(): Proyecto[] {
  return PROYECTOS_BASE.map((proyecto) => ({
    slug: proyecto.slug,
    titulo: proyecto.titulo,
    ubicacion: proyecto.ubicacion,
    imagen: proyecto.imagen,
    areaTipica: proyecto.areaTipica,
    precioDesde: proyecto.precioDesde,
    lotes: Array.from({ length: proyecto.cantidadLotes }, (_, indice) => {
      const correlativo = String(indice + 1).padStart(2, "0");
      return {
        id: `${proyecto.slug}-${correlativo}`,
        numero: `${proyecto.prefijo}${correlativo}`,
        area: proyecto.areaTipica,
        precioLista: proyecto.precioDesde,
        estado: "disponible" as EstadoLote,
        movimientos: [],
      };
    }),
  }));
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function respaldoValido(valor: unknown): valor is Proyecto[] {
  return (
    Array.isArray(valor) &&
    valor.length > 0 &&
    valor.every(
      (proyecto) =>
        esObjeto(proyecto) &&
        typeof proyecto.slug === "string" &&
        typeof proyecto.titulo === "string" &&
        Array.isArray(proyecto.lotes) &&
        proyecto.lotes.every(
          (lote) =>
            esObjeto(lote) &&
            typeof lote.id === "string" &&
            typeof lote.numero === "string" &&
            typeof lote.estado === "string",
        ),
    )
  );
}

function normalizarLoteGuardado(lote: Lote): Lote {
  const estado: EstadoLote = [
    "disponible",
    "reservado",
    "vendido",
    "bloqueado",
  ].includes(lote.estado)
    ? lote.estado
    : "disponible";

  return {
    ...lote,
    estado,
    area: Number(lote.area) || 0,
    precioLista: Number(lote.precioLista) || 0,
    movimientos: Array.isArray(lote.movimientos) ? lote.movimientos : [],
    operacion: lote.operacion
      ? {
          ...lote.operacion,
          precioVenta: Number(lote.operacion.precioVenta) || 0,
          montoReserva: Number(lote.operacion.montoReserva) || 0,
          inicial: Number(lote.operacion.inicial) || 0,
          saldo: Number(lote.operacion.saldo) || 0,
          cuotas: Number(lote.operacion.cuotas) || 0,
          pagoReservaConfirmado:
            lote.operacion.pagoReservaConfirmado ?? false,
          liberacionAutomatica:
            lote.operacion.liberacionAutomatica ?? true,
        }
      : undefined,
  };
}

function fusionarProyectosGuardados(guardados: Proyecto[]): Proyecto[] {
  const proyectosActuales = crearProyectosIniciales();
  const guardadosNormalizados = guardados.map((proyecto) => ({
    ...proyecto,
    slug: PROYECTO_SLUG_ALIASES[proyecto.slug] ?? proyecto.slug,
    lotes: Array.isArray(proyecto.lotes)
      ? proyecto.lotes.map(normalizarLoteGuardado)
      : [],
  }));
  const guardadosPorSlug = new Map(
    guardadosNormalizados.map((proyecto) => [proyecto.slug, proyecto]),
  );

  const proyectosFusionados = proyectosActuales.map((proyectoActual) => {
    const proyectoGuardado = guardadosPorSlug.get(proyectoActual.slug);
    if (!proyectoGuardado) return proyectoActual;

    const lotesGuardadosPorId = new Map(
      proyectoGuardado.lotes.map((lote) => [lote.id, lote]),
    );
    const idsLotesActuales = new Set(proyectoActual.lotes.map((lote) => lote.id));

    const lotesFusionados = proyectoActual.lotes.map((loteActual) => {
      const loteGuardado = lotesGuardadosPorId.get(loteActual.id);
      return loteGuardado
        ? {
            ...loteActual,
            ...loteGuardado,
            id: loteActual.id,
            numero: loteActual.numero,
          }
        : loteActual;
    });

    const lotesAntiguosConDatos = proyectoGuardado.lotes.filter(
      (lote) =>
        !idsLotesActuales.has(lote.id) &&
        (lote.estado !== "disponible" ||
          lote.cliente ||
          lote.operacion ||
          (lote.movimientos?.length ?? 0) > 0),
    );

    return {
      ...proyectoGuardado,
      slug: proyectoActual.slug,
      titulo: proyectoActual.titulo,
      ubicacion: proyectoActual.ubicacion,
      imagen: proyectoActual.imagen,
      areaTipica: proyectoActual.areaTipica,
      precioDesde: proyectoActual.precioDesde,
      lotes: [...lotesFusionados, ...lotesAntiguosConDatos],
    };
  });

  const slugsActuales = new Set(proyectosActuales.map((proyecto) => proyecto.slug));
  const proyectosExternos = guardadosNormalizados.filter(
    (proyecto) => !slugsActuales.has(proyecto.slug),
  );

  return [...proyectosFusionados, ...proyectosExternos];
}

function reservaDebeLiberarse(lote: Lote) {
  if (lote.estado !== "reservado") return false;
  const operacion = lote.operacion;
  if (!operacion?.fechaLimiteReserva) return false;
  if (operacion.pagoReservaConfirmado) return false;
  if (operacion.liberacionAutomatica === false) return false;
  return operacion.fechaLimiteReserva < fechaActualISO();
}

function liberarReservasVencidas(proyectos: Proyecto[]) {
  let liberados = 0;
  const actualizados = proyectos.map((proyecto) => ({
    ...proyecto,
    lotes: proyecto.lotes.map((lote) => {
      if (!reservaDebeLiberarse(lote)) return lote;

      liberados += 1;
      const movimiento = crearMovimiento(
        "vencimiento",
        `Reserva vencida el ${textoFecha(lote.operacion?.fechaLimiteReserva)}. El lote fue liberado automáticamente por falta de pago confirmado.`,
        lote.cliente,
        lote.operacion,
      );

      return {
        ...lote,
        estado: "disponible" as EstadoLote,
        cliente: undefined,
        operacion: undefined,
        movimientos: agregarMovimiento(lote, movimiento),
        actualizadoEn: new Date().toISOString(),
      };
    }),
  }));

  return { proyectos: actualizados, liberados };
}

function formularioVacio(lote?: Lote): FormularioFicha {
  const fechaOperacion = lote?.operacion?.fechaOperacion ?? fechaActualISO();
  return {
    estado: lote?.estado ?? "reservado",
    nombres: lote?.cliente?.nombres ?? "",
    dni: lote?.cliente?.dni ?? "",
    celular: lote?.cliente?.celular ?? "",
    direccion: lote?.cliente?.direccion ?? "",
    asesor: lote?.cliente?.asesor ?? "",
    observaciones: lote?.cliente?.observaciones ?? "",
    fechaOperacion,
    precioVenta: String(lote?.operacion?.precioVenta ?? lote?.precioLista ?? ""),
    montoReserva: String(lote?.operacion?.montoReserva ?? ""),
    inicial: String(lote?.operacion?.inicial ?? ""),
    modalidadPago: lote?.operacion?.modalidadPago ?? "Contado",
    cuotas: String(lote?.operacion?.cuotas ?? 0),
    fechaLimiteReserva:
      lote?.operacion?.fechaLimiteReserva ??
      sumarDiasISO(fechaOperacion, DIAS_RESERVA_POR_DEFECTO),
    pagoReservaConfirmado:
      lote?.operacion?.pagoReservaConfirmado ?? false,
    fechaPagoReserva: lote?.operacion?.fechaPagoReserva ?? "",
    liberacionAutomatica: lote?.operacion?.liberacionAutomatica ?? true,
  };
}

export default function PanelComercial() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(crearProyectosIniciales);
  const [proyectoActivo, setProyectoActivo] = useState(PROYECTOS_BASE[0].slug);
  const [vista, setVista] = useState<Vista>("lotes");
  const [filtroEstado, setFiltroEstado] = useState<EstadoLote | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaProyecto, setBusquedaProyecto] = useState("");
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<FormularioFicha>(formularioVacio());
  const [hidratado, setHidratado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const guardado =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.localStorage.getItem(STORAGE_KEY_ANTERIOR);

      if (guardado) {
        const datos: unknown = JSON.parse(guardado);
        if (respaldoValido(datos)) {
          const fusionados = fusionarProyectosGuardados(datos);
          const resultado = liberarReservasVencidas(fusionados);
          setProyectos(resultado.proyectos);
          if (resultado.liberados > 0) {
            setMensaje(
              `${resultado.liberados} reserva${resultado.liberados === 1 ? "" : "s"} vencida${resultado.liberados === 1 ? "" : "s"} liberada${resultado.liberados === 1 ? "" : "s"}.`,
            );
          }
        }
      }
    } catch (error) {
      console.error("No se pudo leer el panel guardado:", error);
      setMensaje("No se pudo leer el respaldo local. Se cargó la configuración base.");
      setProyectos(crearProyectosIniciales());
    } finally {
      setHidratado(true);
    }
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proyectos));
    } catch (error) {
      console.error("No se pudo guardar el panel:", error);
      setMensaje("No se pudo guardar en este navegador. Descarga un respaldo.");
    }
  }, [proyectos, hidratado]);

  useEffect(() => {
    if (!hidratado) return;

    const revisar = () => {
      setProyectos((actuales) => {
        const resultado = liberarReservasVencidas(actuales);
        if (resultado.liberados > 0) {
          setMensaje(
            `${resultado.liberados} lote${resultado.liberados === 1 ? "" : "s"} liberado${resultado.liberados === 1 ? "" : "s"} por vencimiento.`,
          );
          return resultado.proyectos;
        }
        return actuales;
      });
    };

    revisar();
    const intervalo = window.setInterval(revisar, 60_000);
    return () => window.clearInterval(intervalo);
  }, [hidratado]);

  useEffect(() => {
    if (!mensaje) return;
    const timer = window.setTimeout(() => setMensaje(""), 3500);
    return () => window.clearTimeout(timer);
  }, [mensaje]);

  const proyecto =
    proyectos.find((item) => item.slug === proyectoActivo) ?? proyectos[0];

  const loteSeleccionado = proyecto?.lotes.find(
    (lote) => lote.id === loteSeleccionadoId,
  );

  const proyectosFiltrados = useMemo(() => {
    const termino = busquedaProyecto.trim().toLowerCase();
    if (!termino) return proyectos;
    return proyectos.filter((proyectoItem) =>
      [proyectoItem.titulo, proyectoItem.ubicacion, proyectoItem.slug]
        .join(" ")
        .toLowerCase()
        .includes(termino),
    );
  }, [proyectos, busquedaProyecto]);

  const resumenProyecto = useMemo(() => {
    const conteo: Record<EstadoLote, number> = {
      disponible: 0,
      reservado: 0,
      vendido: 0,
      bloqueado: 0,
    };
    let valorVendido = 0;
    let reservasPorVencer = 0;
    let reservasPagadas = 0;

    proyecto?.lotes.forEach((lote) => {
      conteo[lote.estado] += 1;
      if (lote.estado === "vendido") {
        valorVendido += lote.operacion?.precioVenta ?? lote.precioLista;
      }
      if (lote.estado === "reservado") {
        if (lote.operacion?.pagoReservaConfirmado) reservasPagadas += 1;
        const dias = diasHasta(lote.operacion?.fechaLimiteReserva);
        if (
          !lote.operacion?.pagoReservaConfirmado &&
          dias !== null &&
          dias >= 0 &&
          dias <= 3
        ) {
          reservasPorVencer += 1;
        }
      }
    });

    return { ...conteo, valorVendido, reservasPorVencer, reservasPagadas };
  }, [proyecto]);

  const reservasPorVencer = useMemo(() => {
    if (!proyecto) return [];
    return proyecto.lotes
      .filter((lote) => {
        const dias = diasHasta(lote.operacion?.fechaLimiteReserva);
        return (
          lote.estado === "reservado" &&
          !lote.operacion?.pagoReservaConfirmado &&
          dias !== null &&
          dias >= 0 &&
          dias <= 3
        );
      })
      .sort(
        (a, b) =>
          (a.operacion?.fechaLimiteReserva ?? "").localeCompare(
            b.operacion?.fechaLimiteReserva ?? "",
          ),
      );
  }, [proyecto]);

  const lotesFiltrados = useMemo(() => {
    if (!proyecto) return [];
    const termino = busqueda.trim().toLowerCase();

    return proyecto.lotes.filter((lote) => {
      const coincideEstado =
        filtroEstado === "todos" || lote.estado === filtroEstado;
      const texto = [
        lote.numero,
        lote.estado,
        lote.cliente?.nombres,
        lote.cliente?.dni,
        lote.cliente?.celular,
        lote.cliente?.asesor,
        lote.operacion?.fechaLimiteReserva,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return coincideEstado && (!termino || texto.includes(termino));
    });
  }, [proyecto, busqueda, filtroEstado]);

  const clientesProyecto = useMemo(
    () =>
      lotesFiltrados
        .filter((lote) => lote.estado !== "disponible" && lote.cliente)
        .sort((a, b) =>
          (a.cliente?.nombres ?? "").localeCompare(b.cliente?.nombres ?? ""),
        ),
    [lotesFiltrados],
  );

  function seleccionarProyecto(slug: string) {
    setProyectoActivo(slug);
    setLoteSeleccionadoId(null);
    setBusqueda("");
    setFiltroEstado("todos");
  }

  function abrirFicha(lote: Lote) {
    setLoteSeleccionadoId(lote.id);
    setFormulario(formularioVacio(lote));
  }

  function cerrarFicha() {
    setLoteSeleccionadoId(null);
    setFormulario(formularioVacio());
  }

  function actualizarCampo<K extends keyof FormularioFicha>(
    campo: K,
    valor: FormularioFicha[K],
  ) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function cambiarEstadoFormulario(estado: EstadoLote) {
    setFormulario((actual) => ({
      ...actual,
      estado,
      fechaLimiteReserva:
        estado === "reservado" && !actual.fechaLimiteReserva
          ? sumarDiasISO(
              actual.fechaOperacion || fechaActualISO(),
              DIAS_RESERVA_POR_DEFECTO,
            )
          : actual.fechaLimiteReserva,
    }));
  }

  function validarFormulario() {
    const requiereCliente =
      formulario.estado === "reservado" || formulario.estado === "vendido";
    const precioVenta = Number(formulario.precioVenta) || 0;
    const montoReserva = Number(formulario.montoReserva) || 0;
    const inicial = Number(formulario.inicial) || 0;

    if (requiereCliente && !formulario.nombres.trim()) {
      return "Ingresa los nombres y apellidos del cliente.";
    }
    if (formulario.dni && !/^\d{8}$/.test(formulario.dni.trim())) {
      return "El DNI debe tener exactamente 8 dígitos.";
    }
    if (formulario.celular && !/^\d{9}$/.test(formulario.celular.replace(/\s/g, ""))) {
      return "El celular debe tener 9 dígitos.";
    }
    if (requiereCliente && precioVenta <= 0) {
      return "El precio de venta debe ser mayor que cero.";
    }
    if (montoReserva < 0 || inicial < 0) {
      return "Los importes no pueden ser negativos.";
    }
    if (montoReserva + inicial > precioVenta && precioVenta > 0) {
      return "La reserva más la inicial no puede superar el precio de venta.";
    }
    if (
      formulario.modalidadPago === "Financiado" &&
      requiereCliente &&
      Number(formulario.cuotas) < 1
    ) {
      return "Indica al menos una cuota para una venta financiada.";
    }
    if (formulario.estado === "reservado") {
      if (
        formulario.liberacionAutomatica &&
        !fechaEsValida(formulario.fechaLimiteReserva)
      ) {
        return "Indica hasta qué fecha se bloqueará la reserva.";
      }
      if (
        formulario.fechaLimiteReserva &&
        formulario.fechaOperacion &&
        formulario.fechaLimiteReserva < formulario.fechaOperacion
      ) {
        return "La fecha límite no puede ser anterior a la fecha de reserva.";
      }
      if (formulario.pagoReservaConfirmado && montoReserva <= 0) {
        return "Para confirmar el pago registra un monto de reserva mayor que cero.";
      }
      if (
        formulario.pagoReservaConfirmado &&
        !fechaEsValida(formulario.fechaPagoReserva)
      ) {
        return "Indica la fecha en que se confirmó el pago de la reserva.";
      }
    }
    return null;
  }

  function guardarFicha(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!loteSeleccionado) return;

    const error = validarFormulario();
    if (error) {
      setMensaje(error);
      return;
    }

    const precioVenta = Number(formulario.precioVenta) || 0;
    const montoReserva = Number(formulario.montoReserva) || 0;
    const inicial = Number(formulario.inicial) || 0;
    const saldo = Math.max(precioVenta - montoReserva - inicial, 0);
    const ahora = new Date().toISOString();

    setProyectos((actuales) =>
      actuales.map((item) => {
        if (item.slug !== proyectoActivo) return item;

        return {
          ...item,
          lotes: item.lotes.map((lote) => {
            if (lote.id !== loteSeleccionado.id) return lote;

            if (formulario.estado === "disponible") {
              const movimiento = crearMovimiento(
                "liberacion",
                "El lote fue marcado como disponible manualmente.",
                lote.cliente,
                lote.operacion,
              );
              return {
                ...lote,
                estado: "disponible",
                cliente: undefined,
                operacion: undefined,
                movimientos: agregarMovimiento(lote, movimiento),
                actualizadoEn: ahora,
              };
            }

            const cliente: Cliente | undefined = formulario.nombres.trim()
              ? {
                  nombres: formulario.nombres.trim(),
                  dni: formulario.dni.trim(),
                  celular: formulario.celular.replace(/\s/g, ""),
                  direccion: formulario.direccion.trim(),
                  asesor: formulario.asesor.trim(),
                  observaciones: formulario.observaciones.trim(),
                }
              : undefined;

            const operacion: Operacion = {
              fechaOperacion: formulario.fechaOperacion,
              precioVenta,
              montoReserva,
              inicial,
              saldo,
              modalidadPago: formulario.modalidadPago,
              cuotas:
                formulario.modalidadPago === "Financiado"
                  ? Number(formulario.cuotas) || 0
                  : 0,
              fechaLimiteReserva:
                formulario.estado === "reservado"
                  ? formulario.fechaLimiteReserva
                  : undefined,
              pagoReservaConfirmado:
                formulario.estado === "reservado"
                  ? formulario.pagoReservaConfirmado
                  : undefined,
              fechaPagoReserva:
                formulario.estado === "reservado" &&
                formulario.pagoReservaConfirmado
                  ? formulario.fechaPagoReserva
                  : undefined,
              liberacionAutomatica:
                formulario.estado === "reservado"
                  ? formulario.liberacionAutomatica
                  : undefined,
            };

            const accion: AccionMovimiento =
              formulario.estado === "reservado"
                ? "reserva"
                : formulario.estado === "vendido"
                  ? "venta"
                  : formulario.estado === "bloqueado"
                    ? "bloqueo"
                    : "actualizacion";

            const descripcion =
              formulario.estado === "reservado"
                ? `Reserva registrada hasta el ${textoFecha(formulario.fechaLimiteReserva)}. ${formulario.pagoReservaConfirmado ? "Pago confirmado." : "Pago pendiente."}`
                : formulario.estado === "vendido"
                  ? "Venta registrada y lote marcado como vendido."
                  : formulario.estado === "bloqueado"
                    ? "Lote bloqueado temporalmente."
                    : "Ficha actualizada.";

            const movimiento = crearMovimiento(
              accion,
              descripcion,
              cliente,
              operacion,
            );

            return {
              ...lote,
              estado: formulario.estado,
              cliente,
              operacion,
              movimientos: agregarMovimiento(lote, movimiento),
              actualizadoEn: ahora,
            };
          }),
        };
      }),
    );

    setMensaje(`Lote ${loteSeleccionado.numero} actualizado correctamente.`);
    cerrarFicha();
  }

  function liberarLoteAhora() {
    if (!loteSeleccionado) return;
    const confirmar = window.confirm(
      `¿Liberar el lote ${loteSeleccionado.numero}? La ficha actual se conservará en el historial.`,
    );
    if (!confirmar) return;

    setProyectos((actuales) =>
      actuales.map((item) =>
        item.slug !== proyectoActivo
          ? item
          : {
              ...item,
              lotes: item.lotes.map((lote) => {
                if (lote.id !== loteSeleccionado.id) return lote;
                const movimiento = crearMovimiento(
                  "liberacion",
                  "El lote fue liberado manualmente.",
                  lote.cliente,
                  lote.operacion,
                );
                return {
                  ...lote,
                  estado: "disponible" as EstadoLote,
                  cliente: undefined,
                  operacion: undefined,
                  movimientos: agregarMovimiento(lote, movimiento),
                  actualizadoEn: new Date().toISOString(),
                };
              }),
            },
      ),
    );
    setMensaje(`Lote ${loteSeleccionado.numero} liberado.`);
    cerrarFicha();
  }

  function procesarVencimientosManual() {
    const resultado = liberarReservasVencidas(proyectos);
    if (resultado.liberados === 0) {
      setMensaje("No hay reservas vencidas pendientes de liberar.");
      return;
    }
    setProyectos(resultado.proyectos);
    setMensaje(
      `${resultado.liberados} reserva${resultado.liberados === 1 ? "" : "s"} liberada${resultado.liberados === 1 ? "" : "s"}.`,
    );
  }

  function descargarRespaldo() {
    try {
      const blob = new Blob([JSON.stringify(proyectos, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `respaldo-clientes-lotes-${fechaActualISO()}.json`;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo generar el respaldo.");
    }
  }

  function importarRespaldo(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 10 * 1024 * 1024) {
      setMensaje("El respaldo supera el límite de 10 MB.");
      evento.target.value = "";
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos: unknown = JSON.parse(String(lector.result));
        if (!respaldoValido(datos)) throw new Error("Formato inválido");
        const fusionados = fusionarProyectosGuardados(datos);
        const resultado = liberarReservasVencidas(fusionados);
        setProyectos(resultado.proyectos);
        setProyectoActivo(
          resultado.proyectos[0]?.slug ?? PROYECTOS_BASE[0].slug,
        );
        setMensaje("Respaldo restaurado correctamente.");
      } catch (error) {
        console.error(error);
        setMensaje("El archivo no contiene un respaldo válido.");
      } finally {
        if (inputArchivoRef.current) inputArchivoRef.current.value = "";
      }
    };
    lector.onerror = () => setMensaje("No se pudo leer el archivo seleccionado.");
    lector.readAsText(archivo);
  }

  function reiniciarPanel() {
    const confirmar = window.confirm(
      "Se borrarán los clientes, reservas, ventas, bloqueos e historial guardados en este navegador. ¿Continuar?",
    );
    if (!confirmar) return;

    const iniciales = crearProyectosIniciales();
    setProyectos(iniciales);
    setProyectoActivo(iniciales[0].slug);
    setLoteSeleccionadoId(null);
    setMensaje("Panel reiniciado.");
  }

  if (!proyecto) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#123B68]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#123B68]">
                <Building2 className="h-4 w-4" /> Gestión comercial
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Clientes, reservas y disponibilidad
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Controla reservas con fecha límite, pagos, liberaciones automáticas,
                ventas e historial por lote.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={procesarVencimientosManual}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition hover:bg-amber-100"
              >
                <RefreshCw className="h-4 w-4" /> Revisar vencimientos
              </button>
              <button
                type="button"
                onClick={descargarRespaldo}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" /> Respaldo
              </button>
              <button
                type="button"
                onClick={() => inputArchivoRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <FileUp className="h-4 w-4" /> Restaurar
              </button>
              <input
                ref={inputArchivoRef}
                type="file"
                accept="application/json"
                onChange={importarRespaldo}
                className="hidden"
              />
              <button
                type="button"
                onClick={reiniciarPanel}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
              >
                <RotateCcw className="h-4 w-4" /> Reiniciar
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Al ser puro frontend, la liberación se ejecuta al abrir o recargar
              esta página y cada minuto mientras permanezca abierta. Los datos solo
              se guardan en este navegador; descarga respaldos con frecuencia.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <aside className="self-start rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Proyectos
              </p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {proyectos.length}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-[#123B68]" />
          </div>

          <label className="relative mt-4 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={busquedaProyecto}
              onChange={(evento) => setBusquedaProyecto(evento.target.value)}
              placeholder="Buscar proyecto..."
              className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10"
            />
          </label>

          <div className="mt-3 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {proyectosFiltrados.map((item) => {
              const activo = item.slug === proyectoActivo;
              const disponibles = item.lotes.filter(
                (lote) => lote.estado === "disponible",
              ).length;
              const ocupados = item.lotes.length - disponibles;
              const avance = item.lotes.length
                ? Math.round((ocupados / item.lotes.length) * 100)
                : 0;

              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => seleccionarProyecto(item.slug)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    activo
                      ? "border-[#123B68] bg-[#123B68] text-white shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">{item.titulo}</p>
                      <p
                        className={`mt-1 truncate text-xs ${activo ? "text-white/70" : "text-slate-500"}`}
                      >
                        {disponibles} de {item.lotes.length} disponibles
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </div>
                  <div
                    className={`mt-3 h-1.5 overflow-hidden rounded-full ${activo ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    <div
                      className={`h-full rounded-full ${activo ? "bg-white" : "bg-[#123B68]"}`}
                      style={{ width: `${avance}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F5AA17]">
                  Proyecto seleccionado
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                  {proyecto.titulo}
                </h2>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {proyecto.ubicacion}
                </p>
              </div>

              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setVista("lotes")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${vista === "lotes" ? "bg-white text-[#123B68] shadow-sm" : "text-slate-500"}`}
                >
                  Mapa de lotes
                </button>
                <button
                  type="button"
                  onClick={() => setVista("clientes")}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition ${vista === "clientes" ? "bg-white text-[#123B68] shadow-sm" : "text-slate-500"}`}
                >
                  Fichas de clientes
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <ResumenCard
                icono={<Building2 className="h-5 w-5" />}
                titulo="Total"
                valor={proyecto.lotes.length}
                detalle="Lotes del proyecto"
              />
              <ResumenCard
                icono={<CheckCircle2 className="h-5 w-5" />}
                titulo="Disponibles"
                valor={resumenProyecto.disponible}
                detalle="Listos para ofrecer"
              />
              <ResumenCard
                icono={<WalletCards className="h-5 w-5" />}
                titulo="Reservados"
                valor={resumenProyecto.reservado}
                detalle={`${resumenProyecto.reservasPagadas} con pago`}
              />
              <ResumenCard
                icono={<AlertTriangle className="h-5 w-5" />}
                titulo="Por vencer"
                valor={resumenProyecto.reservasPorVencer}
                detalle="En los próximos 3 días"
                destacado={resumenProyecto.reservasPorVencer > 0}
              />
              <ResumenCard
                icono={<Users className="h-5 w-5" />}
                titulo="Vendidos"
                valor={resumenProyecto.vendido}
                detalle="Operaciones cerradas"
              />
              <ResumenCard
                icono={<CircleDollarSign className="h-5 w-5" />}
                titulo="Valor vendido"
                valor={moneda(resumenProyecto.valorVendido)}
                detalle="Precio registrado"
              />
            </div>

            {reservasPorVencer.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 font-black text-amber-900">
                  <AlarmClock className="h-5 w-5" /> Reservas próximas a vencer
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reservasPorVencer.map((lote) => {
                    const dias = diasHasta(lote.operacion?.fechaLimiteReserva) ?? 0;
                    return (
                      <button
                        key={lote.id}
                        type="button"
                        onClick={() => abrirFicha(lote)}
                        className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-left text-xs text-amber-900 transition hover:border-amber-400"
                      >
                        <strong>{lote.numero}</strong> · {lote.cliente?.nombres ?? "Sin cliente"}
                        <span className="ml-2 font-black">
                          {dias === 0 ? "vence hoy" : `${dias} día${dias === 1 ? "" : "s"}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder="Buscar lote, cliente, DNI, celular, asesor o fecha..."
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10"
                />
              </label>
              <label className="relative flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filtroEstado}
                  onChange={(evento) =>
                    setFiltroEstado(evento.target.value as EstadoLote | "todos")
                  }
                  className="h-11 min-w-44 bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="disponible">Disponibles</option>
                  <option value="reservado">Reservados</option>
                  <option value="vendido">Vendidos</option>
                  <option value="bloqueado">Bloqueados</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {vista === "lotes" ? (
              lotesFiltrados.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {lotesFiltrados.map((lote) => (
                    <LoteCard key={lote.id} lote={lote} onClick={() => abrirFicha(lote)} />
                  ))}
                </div>
              ) : (
                <EstadoVacio
                  titulo="No se encontraron lotes"
                  descripcion="Prueba con otro estado o elimina el texto de búsqueda."
                />
              )
            ) : clientesProyecto.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {clientesProyecto.map((lote) => (
                  <ClienteCard key={lote.id} lote={lote} onEditar={() => abrirFicha(lote)} />
                ))}
              </div>
            ) : (
              <EstadoVacio
                titulo="No hay fichas para mostrar"
                descripcion="Registra una reserva o venta, o cambia los filtros."
              />
            )}
          </div>
        </div>
      </section>

      {loteSeleccionado && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrarFicha();
          }}
        >
          <div className="max-h-[96vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-5xl sm:rounded-3xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F5AA17]">
                  {proyecto.titulo}
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">
                  Ficha del lote {loteSeleccionado.numero}
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarFicha}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="Cerrar ficha"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={guardarFicha} className="p-5 sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)]">
                <aside className="space-y-5">
                  <div className="rounded-2xl bg-[#123B68] p-5 text-white">
                    <p className="text-sm text-white/70">Información del lote</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div>
                        <strong className="text-4xl font-black">
                          {loteSeleccionado.numero}
                        </strong>
                        <p className="mt-1 text-sm text-white/75">
                          {loteSeleccionado.area} m²
                        </p>
                      </div>
                      <p className="text-right text-sm">
                        Precio de lista
                        <strong className="block text-lg">
                          {moneda(loteSeleccionado.precioLista)}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-800">
                      Estado del lote
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(ESTADO_CONFIG) as EstadoLote[]).map((estado) => {
                        const seleccionado = formulario.estado === estado;
                        return (
                          <button
                            key={estado}
                            type="button"
                            onClick={() => cambiarEstadoFormulario(estado)}
                            className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                              seleccionado
                                ? "border-[#123B68] bg-[#123B68] text-white ring-4 ring-[#123B68]/10"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {ESTADO_CONFIG[estado].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {formulario.estado === "reservado" && (
                    <EstadoReservaPreview formulario={formulario} />
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-black text-slate-800">Reglas</p>
                    <p className="mt-2 leading-6">
                      <strong>Reservado:</strong> bloquea hasta la fecha límite.
                      <br />
                      <strong>Sin pago:</strong> se libera al vencer si está activa la
                      liberación automática.
                      <br />
                      <strong>Pago confirmado:</strong> la reserva no se libera.
                      <br />
                      <strong>Vendido:</strong> confirma el cierre definitivo.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 font-black text-slate-900">
                      <History className="h-4 w-4 text-[#123B68]" /> Historial del lote
                    </div>
                    <div className="mt-3 max-h-64 space-y-3 overflow-y-auto">
                      {(loteSeleccionado.movimientos ?? []).length > 0 ? (
                        [...(loteSeleccionado.movimientos ?? [])]
                          .reverse()
                          .slice(0, 8)
                          .map((movimiento) => (
                            <div
                              key={movimiento.id}
                              className="border-l-2 border-slate-200 pl-3 text-xs"
                            >
                              <p className="font-bold text-slate-800">
                                {movimiento.descripcion}
                              </p>
                              <p className="mt-1 text-slate-400">
                                {textoFechaHora(movimiento.fecha)}
                              </p>
                              {movimiento.cliente?.nombres && (
                                <p className="mt-1 text-slate-500">
                                  Cliente: {movimiento.cliente.nombres}
                                </p>
                              )}
                            </div>
                          ))
                      ) : (
                        <p className="text-xs text-slate-400">
                          Todavía no existen movimientos registrados.
                        </p>
                      )}
                    </div>
                  </div>
                </aside>

                <div className="space-y-7">
                  <fieldset
                    disabled={formulario.estado === "disponible"}
                    className="space-y-4 disabled:opacity-50"
                  >
                    <legend className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
                      <UserRound className="h-5 w-5 text-[#123B68]" /> Datos del cliente
                    </legend>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo
                        label="Nombres y apellidos"
                        value={formulario.nombres}
                        onChange={(valor) => actualizarCampo("nombres", valor)}
                        placeholder="Ej. Juan Pérez Quispe"
                        className="sm:col-span-2"
                      />
                      <Campo
                        label="DNI"
                        value={formulario.dni}
                        onChange={(valor) =>
                          actualizarCampo("dni", valor.replace(/\D/g, ""))
                        }
                        placeholder="8 dígitos"
                        inputMode="numeric"
                        maxLength={8}
                      />
                      <Campo
                        label="Celular"
                        value={formulario.celular}
                        onChange={(valor) =>
                          actualizarCampo("celular", valor.replace(/\D/g, ""))
                        }
                        placeholder="9 dígitos"
                        inputMode="tel"
                        maxLength={9}
                      />
                      <Campo
                        label="Dirección"
                        value={formulario.direccion}
                        onChange={(valor) => actualizarCampo("direccion", valor)}
                        placeholder="Dirección del cliente"
                        className="sm:col-span-2"
                      />
                      <Campo
                        label="Asesor responsable"
                        value={formulario.asesor}
                        onChange={(valor) => actualizarCampo("asesor", valor)}
                        placeholder="Ej. Cinthia"
                        className="sm:col-span-2"
                      />
                    </div>
                  </fieldset>

                  <fieldset
                    disabled={formulario.estado === "disponible"}
                    className="space-y-5 disabled:opacity-50"
                  >
                    <legend className="mb-4 flex items-center gap-2 text-base font-black text-slate-950">
                      <WalletCards className="h-5 w-5 text-[#123B68]" /> Datos de la operación
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo
                        label="Fecha de operación"
                        type="date"
                        value={formulario.fechaOperacion}
                        onChange={(valor) => actualizarCampo("fechaOperacion", valor)}
                      />
                      <Campo
                        label="Precio de venta"
                        type="number"
                        value={formulario.precioVenta}
                        onChange={(valor) => actualizarCampo("precioVenta", valor)}
                        min="0"
                        step="0.01"
                      />
                      <Campo
                        label="Monto de reserva"
                        type="number"
                        value={formulario.montoReserva}
                        onChange={(valor) => actualizarCampo("montoReserva", valor)}
                        min="0"
                        step="0.01"
                      />
                      <Campo
                        label="Inicial adicional"
                        type="number"
                        value={formulario.inicial}
                        onChange={(valor) => actualizarCampo("inicial", valor)}
                        min="0"
                        step="0.01"
                      />

                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">
                          Modalidad de pago
                        </span>
                        <select
                          value={formulario.modalidadPago}
                          onChange={(evento) =>
                            actualizarCampo(
                              "modalidadPago",
                              evento.target.value as ModalidadPago,
                            )
                          }
                          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10"
                        >
                          <option value="Contado">Contado</option>
                          <option value="Financiado">Financiado</option>
                        </select>
                      </label>

                      <Campo
                        label="Cantidad de cuotas"
                        type="number"
                        value={formulario.cuotas}
                        onChange={(valor) => actualizarCampo("cuotas", valor)}
                        min="0"
                        disabled={formulario.modalidadPago === "Contado"}
                      />
                    </div>

                    {formulario.estado === "reservado" && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                        <div className="flex items-center gap-2 font-black text-amber-950">
                          <FileClock className="h-5 w-5" /> Control de la reserva
                        </div>
                        <p className="mt-1 text-sm text-amber-800">
                          Define hasta cuándo se bloqueará el lote y confirma si el
                          cliente realizó el pago.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Campo
                            label="Bloquear reserva hasta"
                            type="date"
                            value={formulario.fechaLimiteReserva}
                            onChange={(valor) =>
                              actualizarCampo("fechaLimiteReserva", valor)
                            }
                            min={formulario.fechaOperacion || fechaActualISO()}
                          />
                          <Campo
                            label="Fecha de pago de reserva"
                            type="date"
                            value={formulario.fechaPagoReserva}
                            onChange={(valor) =>
                              actualizarCampo("fechaPagoReserva", valor)
                            }
                            disabled={!formulario.pagoReservaConfirmado}
                          />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <ToggleCard
                            checked={formulario.pagoReservaConfirmado}
                            onChange={(checked) => {
                              actualizarCampo("pagoReservaConfirmado", checked);
                              if (checked && !formulario.fechaPagoReserva) {
                                actualizarCampo("fechaPagoReserva", fechaActualISO());
                              }
                            }}
                            titulo="Pago de reserva confirmado"
                            descripcion="Evita que el lote se libere por vencimiento."
                            icono={<BadgeCheck className="h-5 w-5" />}
                          />
                          <ToggleCard
                            checked={formulario.liberacionAutomatica}
                            onChange={(checked) =>
                              actualizarCampo("liberacionAutomatica", checked)
                            }
                            titulo="Liberar automáticamente"
                            descripcion="Si vence sin pago confirmado, vuelve a disponible."
                            icono={<AlarmClock className="h-5 w-5" />}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                      <Calculo
                        label="Precio"
                        value={moneda(Number(formulario.precioVenta) || 0)}
                      />
                      <Calculo
                        label="Pagado"
                        value={moneda(
                          (Number(formulario.montoReserva) || 0) +
                            (Number(formulario.inicial) || 0),
                        )}
                      />
                      <Calculo
                        label="Saldo"
                        value={moneda(
                          Math.max(
                            (Number(formulario.precioVenta) || 0) -
                              (Number(formulario.montoReserva) || 0) -
                              (Number(formulario.inicial) || 0),
                            0,
                          ),
                        )}
                      />
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-700">
                        Observaciones
                      </span>
                      <textarea
                        value={formulario.observaciones}
                        onChange={(evento) =>
                          actualizarCampo("observaciones", evento.target.value)
                        }
                        rows={4}
                        placeholder="Acuerdos, documentación pendiente, fecha de próximo pago, seguimiento, etc."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10"
                      />
                    </label>
                  </fieldset>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {loteSeleccionado.estado !== "disponible" && (
                    <button
                      type="button"
                      onClick={liberarLoteAhora}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-black text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" /> Liberar lote ahora
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={cerrarFicha}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 sm:flex-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#123B68] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#123B68]/20 transition hover:bg-[#0d2f54] sm:flex-none"
                  >
                    <Save className="h-4 w-4" /> Guardar cambios
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {mensaje && (
        <div className="fixed bottom-5 left-1/2 z-[120] max-w-[92vw] -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white shadow-2xl">
          {mensaje}
        </div>
      )}
    </main>
  );
}

function LoteCard({ lote, onClick }: { lote: Lote; onClick: () => void }) {
  const config = ESTADO_CONFIG[lote.estado];
  const dias = diasHasta(lote.operacion?.fechaLimiteReserva);
  const pagoConfirmado = lote.operacion?.pagoReservaConfirmado;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group min-h-40 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${config.card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl font-black text-slate-950">{lote.numero}</span>
        {lote.estado === "bloqueado" ? (
          <LockKeyhole className="h-4 w-4 text-slate-500" />
        ) : (
          <span className={`h-3 w-3 rounded-full ${config.dot}`} />
        )}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-600">{lote.area} m²</p>
      <p className="mt-1 text-xs text-slate-500">{moneda(lote.precioLista)}</p>
      <div className="mt-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${config.badge}`}>
          {config.label}
        </span>
      </div>

      {lote.estado === "reservado" && (
        <div
          className={`mt-3 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
            pagoConfirmado
              ? "bg-emerald-100 text-emerald-800"
              : dias !== null && dias <= 1
                ? "bg-rose-100 text-rose-800"
                : "bg-white/70 text-amber-900"
          }`}
        >
          {pagoConfirmado
            ? "Pago confirmado"
            : dias === null
              ? "Sin fecha límite"
              : dias < 0
                ? "Reserva vencida"
                : dias === 0
                  ? "Vence hoy"
                  : `Vence en ${dias} día${dias === 1 ? "" : "s"}`}
        </div>
      )}

      {lote.cliente?.nombres && (
        <p className="mt-3 line-clamp-2 text-xs font-semibold text-slate-700">
          {lote.cliente.nombres}
        </p>
      )}
    </button>
  );
}

function ClienteCard({
  lote,
  onEditar,
}: {
  lote: Lote;
  onEditar: () => void;
}) {
  const dias = diasHasta(lote.operacion?.fechaLimiteReserva);
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123B68] text-white">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-950">{lote.cliente?.nombres}</h3>
            <p className="mt-1 text-sm text-slate-500">
              DNI: {lote.cliente?.dni || "No registrado"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${ESTADO_CONFIG[lote.estado].badge}`}>
            {ESTADO_CONFIG[lote.estado].label}
          </span>
          <button
            type="button"
            onClick={onEditar}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition hover:text-[#123B68]"
            aria-label={`Editar lote ${lote.numero}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <FichaDato etiqueta="Lote" valor={`${lote.numero} · ${lote.area} m²`} />
        <FichaDato
          etiqueta="Precio registrado"
          valor={moneda(lote.operacion?.precioVenta ?? lote.precioLista)}
        />
        <FichaDato etiqueta="Celular" valor={lote.cliente?.celular || "No registrado"} />
        <FichaDato etiqueta="Asesor" valor={lote.cliente?.asesor || "No registrado"} />
        <FichaDato etiqueta="Fecha" valor={textoFecha(lote.operacion?.fechaOperacion)} />
        <FichaDato etiqueta="Saldo" valor={moneda(lote.operacion?.saldo ?? 0)} />
        {lote.estado === "reservado" && (
          <>
            <FichaDato
              etiqueta="Reserva hasta"
              valor={textoFecha(lote.operacion?.fechaLimiteReserva)}
            />
            <FichaDato
              etiqueta="Pago de reserva"
              valor={
                lote.operacion?.pagoReservaConfirmado
                  ? "Confirmado"
                  : dias === 0
                    ? "Pendiente · vence hoy"
                    : dias !== null && dias > 0
                      ? `Pendiente · ${dias} día${dias === 1 ? "" : "s"}`
                      : "Pendiente"
              }
            />
          </>
        )}
      </dl>

      {lote.cliente?.observaciones && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
          <strong className="text-slate-800">Observaciones: </strong>
          {lote.cliente.observaciones}
        </div>
      )}
    </article>
  );
}

function EstadoReservaPreview({ formulario }: { formulario: FormularioFicha }) {
  const dias = diasHasta(formulario.fechaLimiteReserva);
  const pagado = formulario.pagoReservaConfirmado;

  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        pagado
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : dias !== null && dias <= 1
            ? "border-rose-200 bg-rose-50 text-rose-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <div className="flex items-center gap-2 font-black">
        {pagado ? <BadgeCheck className="h-5 w-5" /> : <AlarmClock className="h-5 w-5" />}
        {pagado ? "Reserva protegida" : "Pago pendiente"}
      </div>
      <p className="mt-2 leading-6">
        {pagado
          ? `Pago confirmado el ${textoFecha(formulario.fechaPagoReserva)}. No se liberará automáticamente.`
          : formulario.liberacionAutomatica
            ? `El lote se liberará después del ${textoFecha(formulario.fechaLimiteReserva)} si el pago continúa pendiente.`
            : `La reserva vence el ${textoFecha(formulario.fechaLimiteReserva)}, pero la liberación automática está desactivada.`}
      </p>
    </div>
  );
}

function ToggleCard({
  checked,
  onChange,
  titulo,
  descripcion,
  icono,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  titulo: string;
  descripcion: string;
  icono: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
        checked
          ? "border-[#123B68] bg-white ring-4 ring-[#123B68]/10"
          : "border-amber-200 bg-white/60"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(evento) => onChange(evento.target.checked)}
        className="mt-1 h-4 w-4 accent-[#123B68]"
      />
      <span>
        <span className="flex items-center gap-2 text-sm font-black text-slate-900">
          {icono} {titulo}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {descripcion}
        </span>
      </span>
    </label>
  );
}

function ResumenCard({
  icono,
  titulo,
  valor,
  detalle,
  destacado = false,
}: {
  icono: ReactNode;
  titulo: string;
  valor: ReactNode;
  detalle: string;
  destacado?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        destacado
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2 text-slate-500">
        <span className={destacado ? "text-amber-700" : "text-[#123B68]"}>{icono}</span>
        <p className="text-xs font-bold">{titulo}</p>
      </div>
      <p className="mt-3 break-words text-xl font-black text-slate-950">{valor}</p>
      <p className="mt-1 text-[11px] text-slate-500">{detalle}</p>
    </article>
  );
}

function Campo({
  label,
  value,
  onChange,
  className = "",
  type = "text",
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className" | "type"
>) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        {...props}
        type={type}
        value={value}
        onChange={(evento) => onChange(evento.target.value)}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
    </label>
  );
}

function Calculo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function FichaDato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{etiqueta}</dt>
      <dd className="mt-1 font-semibold text-slate-800">{valor}</dd>
    </div>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <CalendarDays className="h-10 w-10 text-slate-300" />
      <h3 className="mt-4 font-black text-slate-800">{titulo}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{descripcion}</p>
    </div>
  );
}