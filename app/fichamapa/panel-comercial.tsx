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
  Database,
  Download,
  FileUp,
  Filter,
  FolderSync,
  HardDrive,
  History,
  MapPin,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  Search,
  ShieldAlert,
  Trash2,
  Undo2,
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
import {
  connectSharedMasterFile,
  disconnectSharedMasterFile,
  downloadPanelBackup,
  getPanelVaultStatus,
  loadPanelVault,
  restorePreviousSnapshot,
  savePanelVault,
  subscribePanelVault,
  syncSharedMasterFile,
  type VaultStatus,
} from "@/lib/panel-vault";

import { tienePlanoProyecto } from "./planos-data";
import PlanoLotes from "./plano-lotes";

type EstadoLote = "disponible" | "reservado" | "vendido";
type ModalidadPago = "Contado" | "Financiado";
type Vista = "lotes" | "clientes";
type AccionMovimiento =
  | "reserva"
  | "venta"
  | "actualizacion"
  | "pago_cuota"
  | "liberacion"
  | "vencimiento";

type Cliente = {
  nombres: string;
  dni: string;
  celular: string;
  asesor: string;
  observaciones: string;
};

type CuotaMensual = {
  numero: number;
  fechaVencimiento: string;
  monto: number;
  pagada: boolean;
  fechaPago?: string;
};

type Operacion = {
  fechaOperacion: string;
  precioVenta: number;

  // La reserva se paga al separar el lote y forma parte del precio total.
  montoReserva: number;
  fechaPagoReserva?: string;

  // En financiamiento, la inicial total incluye la reserva ya pagada.
  inicial: number;
  fechaCompromisoPago?: string;
  pagoInicialConfirmado?: boolean;
  fechaPagoInicial?: string;

  // En contado, se registra la fecha acordada y la confirmación del pago total.
  pagoTotalConfirmado?: boolean;
  fechaPagoTotal?: string;

  saldo: number;
  modalidadPago: ModalidadPago;
  cuotas: number;
  fechaPrimeraCuota?: string;
  cuotasMensuales?: CuotaMensual[];
  liberacionAutomatica?: boolean;

  // Campos anteriores mantenidos únicamente para migrar respaldos viejos.
  fechaLimiteReserva?: string;
  pagoReservaConfirmado?: boolean;
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
  asesor: string;
  observaciones: string;

  fechaOperacion: string;
  precioVenta: string;
  montoReserva: string;
  fechaPagoReserva: string;
  modalidadPago: ModalidadPago;

  inicial: string;
  fechaCompromisoPago: string;
  pagoInicialConfirmado: boolean;
  fechaPagoInicial: string;

  pagoTotalConfirmado: boolean;
  fechaPagoTotal: string;

  cuotas: string;
  fechaPrimeraCuota: string;
  cuotasMensuales: CuotaMensual[];
  liberacionAutomatica: boolean;
};

const STORAGE_KEY = "casagrande-panel-clientes-lotes-v5";
const STORAGE_KEYS_ANTERIORES = [
  "casagrande-panel-clientes-lotes-v4",
  "casagrande-panel-clientes-lotes-v3",
  "casagrande-panel-clientes-lotes-v2",
  "casagrande-panel-clientes-lotes-v1",
];
const MONTO_RESERVA_POR_DEFECTO = 1000;
const DIAS_COMPROMISO_POR_DEFECTO = 3;
const MAX_MOVIMIENTOS_POR_LOTE = 50;

const PROYECTO_SLUG_ALIASES: Record<string, string> = {
  "machayhuycco-ayacucho02": "el-mirador-de-ccorihuillca-ayacucho",
};

const PROYECTOS_BASE: ProyectoBase[] = [
  {
    slug: "el-mirador-de-ccorihuillca-ayacucho",
    titulo: "EL MIRADOR",
    ubicacion: "Ccorihuillca Chico, Huamanga – Ayacucho",
    imagen: "/MACHAYHUAYCCO/MACHAYHUAYCCOHERO.webp",
    areaTipica: 200,
    precioDesde: 20000,
    cantidadLotes: 64,
    prefijo: "MC",
  },
  {
    slug: "el-golf-de-ccorihuillca-ayacucho",
    titulo: "EL GOLF DE CCORIHUILLCA",
    ubicacion: "Al lado de Ccorihuillca Chico, en el mismo pueblo",
    imagen: "/ELGOLF/ELGOLF01.webp",
    areaTipica: 180,
    precioDesde: 24000,
    cantidadLotes: 55,
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
    cantidadLotes: 18,
    prefijo: "P",
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
};

function formatearFechaISO(fecha: Date) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function parsearFechaISO(valor?: string) {
  if (!valor || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;

  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia, 12, 0, 0, 0);

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  return fecha;
}

function fechaActualISO() {
  return formatearFechaISO(new Date());
}

function sumarDiasISO(fechaISO: string, dias: number) {
  const fecha = parsearFechaISO(fechaISO) ?? new Date();
  const cantidadDias = Number.isFinite(dias) ? Math.trunc(dias) : 0;

  fecha.setDate(fecha.getDate() + cantidadDias);
  return formatearFechaISO(fecha);
}

function sumarMesesISO(fechaISO: string, meses: number) {
  const fechaOrigen = parsearFechaISO(fechaISO);
  if (!fechaOrigen) return "";

  const cantidadMeses = Number.isFinite(meses) ? Math.trunc(meses) : 0;
  const anio = fechaOrigen.getFullYear();
  const mes = fechaOrigen.getMonth();
  const dia = fechaOrigen.getDate();

  const base = new Date(anio, mes + cantidadMeses, 1, 12, 0, 0, 0);
  const ultimoDia = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0,
    12,
    0,
    0,
  ).getDate();

  base.setDate(Math.min(dia, ultimoDia));
  return formatearFechaISO(base);
}

function generarCuotasMensuales(
  saldoFinanciar: number,
  cantidad: number,
  fechaPrimeraCuota: string,
  existentes: CuotaMensual[] = [],
): CuotaMensual[] {
  const totalCentimos = Math.max(Math.round(saldoFinanciar * 100), 0);
  const numeroCuotas = Math.max(Math.trunc(cantidad), 0);

  if (
    totalCentimos <= 0 ||
    numeroCuotas <= 0 ||
    !fechaEsValida(fechaPrimeraCuota)
  ) {
    return [];
  }

  const baseCentimos = Math.floor(totalCentimos / numeroCuotas);
  const sobrante = totalCentimos % numeroCuotas;
  const existentesPorNumero = new Map(
    existentes.map((cuota) => [cuota.numero, cuota]),
  );

  return Array.from({ length: numeroCuotas }, (_, indice) => {
    const numero = indice + 1;
    const anterior = existentesPorNumero.get(numero);
    const montoCentimos = baseCentimos + (indice < sobrante ? 1 : 0);

    const fechaVencimiento = sumarMesesISO(fechaPrimeraCuota, indice);
    const monto = montoCentimos / 100;
    const coincideConAnterior =
      anterior &&
      anterior.fechaVencimiento === fechaVencimiento &&
      Math.abs(anterior.monto - monto) < 0.001;

    return {
      numero,
      fechaVencimiento,
      monto,
      pagada: coincideConAnterior ? anterior.pagada : false,
      fechaPago:
        coincideConAnterior && anterior.pagada
          ? anterior.fechaPago
          : undefined,
    };
  });
}

function totalCuotasPagadas(cuotas: CuotaMensual[] = []) {
  return cuotas.reduce(
    (total, cuota) => total + (cuota.pagada ? cuota.monto : 0),
    0,
  );
}

function cuotaEstaVencida(cuota: CuotaMensual) {
  return !cuota.pagada && cuota.fechaVencimiento < fechaActualISO();
}

function siguienteCuotaPendiente(cuotas: CuotaMensual[] = []) {
  return cuotas
    .filter((cuota) => !cuota.pagada)
    .sort((a, b) =>
      a.fechaVencimiento.localeCompare(b.fechaVencimiento),
    )[0];
}

function fechaCompromisoOperacion(operacion?: Operacion) {
  return operacion?.fechaCompromisoPago ?? operacion?.fechaLimiteReserva;
}

function compromisoPagoCumplido(operacion?: Operacion) {
  if (!operacion) return false;
  return operacion.modalidadPago === "Contado"
    ? Boolean(operacion.pagoTotalConfirmado)
    : Boolean(operacion.pagoInicialConfirmado);
}

function totalPagadoOperacion(operacion?: Operacion) {
  if (!operacion) return 0;

  if (operacion.modalidadPago === "Contado") {
    return operacion.pagoTotalConfirmado
      ? operacion.precioVenta
      : operacion.montoReserva;
  }

  const basePagada = operacion.pagoInicialConfirmado
    ? operacion.inicial
    : operacion.montoReserva;

  return basePagada + totalCuotasPagadas(operacion.cuotasMensuales);
}

function calcularResumenFormulario(formulario: FormularioFicha) {
  const precio = Math.max(Number(formulario.precioVenta) || 0, 0);
  const reserva = Math.max(Number(formulario.montoReserva) || 0, 0);
  const inicialTotal =
    formulario.modalidadPago === "Financiado"
      ? Math.max(Number(formulario.inicial) || 0, 0)
      : 0;
  const cuotasPagadas = totalCuotasPagadas(formulario.cuotasMensuales);

  const totalPagado =
    formulario.modalidadPago === "Contado"
      ? formulario.pagoTotalConfirmado
        ? precio
        : reserva
      : (formulario.pagoInicialConfirmado ? inicialTotal : reserva) +
        cuotasPagadas;

  return {
    precio,
    reserva,
    inicialTotal,
    pendienteInicial:
      formulario.modalidadPago === "Financiado"
        ? Math.max(inicialTotal - reserva, 0)
        : 0,
    saldoPendiente: Math.max(precio - totalPagado, 0),
    totalPagado: Math.min(totalPagado, precio),
    cuotaMensual:
      formulario.modalidadPago === "Financiado"
        ? formulario.cuotasMensuales[0]?.monto ?? 0
        : 0,
    pagoPendienteContado:
      formulario.modalidadPago === "Contado"
        ? Math.max(precio - reserva, 0)
        : 0,
  };
}

function diasHasta(fechaISO?: string) {
  const objetivo = parsearFechaISO(fechaISO);
  const hoy = parsearFechaISO(fechaActualISO());

  if (!objetivo || !hoy) return null;
  return Math.round((objetivo.getTime() - hoy.getTime()) / 86_400_000);
}

function fechaEsValida(valor?: string) {
  return parsearFechaISO(valor) !== null;
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
  const fecha = parsearFechaISO(valor);
  if (!fecha) return valor ? "Fecha inválida" : "Sin fecha";

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
  const cliente = lote.cliente
    ? {
        nombres: String(lote.cliente.nombres ?? ""),
        dni: String(lote.cliente.dni ?? ""),
        celular: String(lote.cliente.celular ?? ""),
        asesor: String(lote.cliente.asesor ?? ""),
        observaciones: String(lote.cliente.observaciones ?? ""),
      }
    : undefined;

  const estadoGuardado = String(lote.estado);
  const estado: EstadoLote =
    estadoGuardado === "reservado" || estadoGuardado === "vendido"
      ? estadoGuardado
      : estadoGuardado === "bloqueado" && cliente
        ? "reservado"
        : "disponible";

  const operacionAnterior = lote.operacion;
  const precioVenta =
    Number(operacionAnterior?.precioVenta) || Number(lote.precioLista) || 0;
  const modalidadPago: ModalidadPago =
    operacionAnterior?.modalidadPago === "Contado"
      ? "Contado"
      : "Financiado";
  const fechaOperacion = fechaEsValida(
    operacionAnterior?.fechaOperacion,
  )
    ? String(operacionAnterior?.fechaOperacion)
    : fechaActualISO();

  const reservaAnterior = Number(operacionAnterior?.montoReserva) || 0;
  const montoReserva =
    estado === "disponible"
      ? 0
      : Math.min(
          Math.max(
            reservaAnterior || MONTO_RESERVA_POR_DEFECTO,
            0,
          ),
          precioVenta,
        );

  const fechaCompromisoGuardada =
    operacionAnterior?.fechaCompromisoPago ??
    operacionAnterior?.fechaLimiteReserva;
  const fechaCompromisoPago = fechaEsValida(fechaCompromisoGuardada)
    ? String(fechaCompromisoGuardada)
    : sumarDiasISO(fechaOperacion, DIAS_COMPROMISO_POR_DEFECTO);

  const inicialAnterior = Number(operacionAnterior?.inicial) || 0;
  const inicial =
    modalidadPago === "Financiado"
      ? Math.min(
          Math.max(inicialAnterior || montoReserva, montoReserva),
          precioVenta,
        )
      : 0;

  const cuotasAnteriores = Math.trunc(
    Number(operacionAnterior?.cuotas) || 12,
  );
  const cuotas =
    modalidadPago === "Financiado"
      ? Math.min(Math.max(cuotasAnteriores, 1), 120)
      : 0;

  const fechaPrimeraCuotaGuardada =
    operacionAnterior?.fechaPrimeraCuota ||
    operacionAnterior?.cuotasMensuales?.[0]?.fechaVencimiento;
  const fechaPrimeraCuota = fechaEsValida(fechaPrimeraCuotaGuardada)
    ? String(fechaPrimeraCuotaGuardada)
    : sumarMesesISO(fechaCompromisoPago, 1);

  const cuotasMensuales =
    modalidadPago === "Financiado" && inicial < precioVenta
      ? generarCuotasMensuales(
          Math.max(precioVenta - inicial, 0),
          cuotas,
          fechaPrimeraCuota,
          Array.isArray(operacionAnterior?.cuotasMensuales)
            ? operacionAnterior.cuotasMensuales
            : [],
        )
      : [];

  const pagoInicialConfirmado =
    modalidadPago === "Financiado"
      ? estado === "vendido"
        ? true
        : operacionAnterior?.pagoInicialConfirmado ??
          operacionAnterior?.pagoReservaConfirmado ??
          false
      : false;

  const pagoTotalConfirmado =
    modalidadPago === "Contado"
      ? operacionAnterior?.pagoTotalConfirmado ??
        (estado === "vendido" &&
          (Number(operacionAnterior?.saldo) === 0 ||
            inicialAnterior >= precioVenta))
      : false;

  const operacionBase: Operacion | undefined = operacionAnterior
    ? {
        fechaOperacion,
        precioVenta,
        montoReserva,
        fechaPagoReserva:
          operacionAnterior.fechaPagoReserva ?? fechaOperacion,
        inicial,
        fechaCompromisoPago,
        pagoInicialConfirmado,
        fechaPagoInicial:
          modalidadPago === "Financiado" && pagoInicialConfirmado
            ? operacionAnterior.fechaPagoInicial ??
              operacionAnterior.fechaPagoReserva ??
              fechaCompromisoPago
            : undefined,
        pagoTotalConfirmado,
        fechaPagoTotal:
          modalidadPago === "Contado" && pagoTotalConfirmado
            ? operacionAnterior.fechaPagoTotal ?? fechaCompromisoPago
            : undefined,
        saldo: 0,
        modalidadPago,
        cuotas,
        fechaPrimeraCuota:
          modalidadPago === "Financiado" ? fechaPrimeraCuota : undefined,
        cuotasMensuales,
        liberacionAutomatica:
          operacionAnterior.liberacionAutomatica ?? true,
        fechaLimiteReserva: fechaCompromisoPago,
        pagoReservaConfirmado: montoReserva > 0,
      }
    : undefined;

  const operacion = operacionBase
    ? {
        ...operacionBase,
        saldo: Math.max(
          precioVenta - totalPagadoOperacion(operacionBase),
          0,
        ),
      }
    : undefined;

  return {
    ...lote,
    estado,
    cliente: estado === "disponible" ? undefined : cliente,
    area: Number(lote.area) || 0,
    precioLista: Number(lote.precioLista) || 0,
    movimientos: Array.isArray(lote.movimientos) ? lote.movimientos : [],
    operacion: estado === "disponible" ? undefined : operacion,
  };
}

function fusionarProyectosGuardados(guardados: Proyecto[]): Proyecto[] {
  const proyectosActuales = crearProyectosIniciales();
  const guardadosNormalizados = guardados.map((proyecto) => {
    const slugAnterior = proyecto.slug;
    const slugNormalizado =
      PROYECTO_SLUG_ALIASES[slugAnterior] ?? slugAnterior;

    return {
      ...proyecto,
      slug: slugNormalizado,
      lotes: Array.isArray(proyecto.lotes)
        ? proyecto.lotes.map((lote) =>
            normalizarLoteGuardado({
              ...lote,
              id: lote.id.startsWith(`${slugAnterior}-`)
                ? lote.id.replace(
                    `${slugAnterior}-`,
                    `${slugNormalizado}-`,
                  )
                : lote.id,
            }),
          )
        : [],
    };
  });
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
  const fechaCompromiso = fechaCompromisoOperacion(operacion);

  if (!fechaEsValida(fechaCompromiso)) return false;
  if (compromisoPagoCumplido(operacion)) return false;
  if (operacion?.liberacionAutomatica === false) return false;

  return fechaCompromiso != null && fechaCompromiso < fechaActualISO();
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
        `Compromiso de pago vencido el ${textoFecha(
          fechaCompromisoOperacion(lote.operacion),
        )}. El lote fue liberado automáticamente porque el ${
          lote.operacion?.modalidadPago === "Contado"
            ? "pago total"
            : "pago de la inicial"
        } no fue confirmado.`,
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
  const fechaOperacion = fechaEsValida(lote?.operacion?.fechaOperacion)
    ? String(lote?.operacion?.fechaOperacion)
    : fechaActualISO();
  const precioVenta =
    Number(lote?.operacion?.precioVenta ?? lote?.precioLista ?? 0) || 0;
  const modalidadPago = lote?.operacion?.modalidadPago ?? "Financiado";
  const montoReserva =
    Number(lote?.operacion?.montoReserva ?? MONTO_RESERVA_POR_DEFECTO) || 0;
  const inicial =
    modalidadPago === "Financiado"
      ? Number(lote?.operacion?.inicial ?? 0) || 0
      : 0;
  const fechaCompromisoGuardada = fechaCompromisoOperacion(
    lote?.operacion,
  );
  const fechaCompromisoPago = fechaEsValida(fechaCompromisoGuardada)
    ? String(fechaCompromisoGuardada)
    : sumarDiasISO(fechaOperacion, DIAS_COMPROMISO_POR_DEFECTO);
  const cuotasGuardadas = Math.trunc(
    Number(lote?.operacion?.cuotas) || 12,
  );
  const cuotas =
    modalidadPago === "Financiado"
      ? Math.min(Math.max(cuotasGuardadas, 1), 120)
      : 0;
  const fechaPrimeraGuardada =
    lote?.operacion?.fechaPrimeraCuota ??
    lote?.operacion?.cuotasMensuales?.[0]?.fechaVencimiento;
  const fechaPrimeraCuota = fechaEsValida(fechaPrimeraGuardada)
    ? String(fechaPrimeraGuardada)
    : sumarMesesISO(fechaCompromisoPago, 1);
  const cuotasMensuales =
    modalidadPago === "Financiado" && inicial > 0 && inicial < precioVenta
      ? generarCuotasMensuales(
          Math.max(precioVenta - inicial, 0),
          cuotas,
          fechaPrimeraCuota,
          lote?.operacion?.cuotasMensuales ?? [],
        )
      : [];

  return {
    estado: lote?.estado ?? "reservado",
    nombres: lote?.cliente?.nombres ?? "",
    dni: lote?.cliente?.dni ?? "",
    celular: lote?.cliente?.celular ?? "",
    asesor: lote?.cliente?.asesor ?? "",
    observaciones: lote?.cliente?.observaciones ?? "",

    fechaOperacion,
    precioVenta: String(precioVenta || ""),
    montoReserva: String(montoReserva || MONTO_RESERVA_POR_DEFECTO),
    fechaPagoReserva: fechaEsValida(lote?.operacion?.fechaPagoReserva)
      ? String(lote?.operacion?.fechaPagoReserva)
      : fechaOperacion,
    modalidadPago,

    inicial:
      modalidadPago === "Financiado" && inicial > 0
        ? String(inicial)
        : "",
    fechaCompromisoPago,
    pagoInicialConfirmado:
      lote?.operacion?.pagoInicialConfirmado ?? false,
    fechaPagoInicial: lote?.operacion?.fechaPagoInicial ?? "",

    pagoTotalConfirmado:
      lote?.operacion?.pagoTotalConfirmado ?? false,
    fechaPagoTotal: lote?.operacion?.fechaPagoTotal ?? "",

    cuotas: String(cuotas || 12),
    fechaPrimeraCuota,
    cuotasMensuales,
    liberacionAutomatica:
      lote?.operacion?.liberacionAutomatica ?? true,
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
  const [montado, setMontado] = useState(false);
  const [hidratado, setHidratado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [vaultStatus, setVaultStatus] = useState<VaultStatus>({
    indexedDb: true,
    persistent: null,
    saving: false,
    sharedFileSupported: false,
    sharedFilePermission: "unknown",
  });
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);
  const ultimoHashAplicadoRef = useRef("");

  function aplicarDatosExternos(
    datos: unknown,
    hash: string,
    mensajeSincronizacion?: string,
  ) {
    if (!respaldoValido(datos)) return;

    const fusionados = fusionarProyectosGuardados(datos);
    const resultado = liberarReservasVencidas(fusionados);

    ultimoHashAplicadoRef.current = hash;
    setProyectos(resultado.proyectos);
    setLoteSeleccionadoId(null);
    setFormulario(formularioVacio());

    if (resultado.liberados > 0) {
      setMensaje(
        `${resultado.liberados} reserva${
          resultado.liberados === 1 ? "" : "s"
        } vencida${resultado.liberados === 1 ? "" : "s"} liberada${
          resultado.liberados === 1 ? "" : "s"
        }.`,
      );
    } else if (mensajeSincronizacion) {
      setMensaje(mensajeSincronizacion);
    }
  }

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    let activo = true;

    const iniciar = async () => {
      try {
        const envelope = await loadPanelVault<Proyecto[]>({
          initialData: crearProyectosIniciales(),
          legacyKeys: [STORAGE_KEY, ...STORAGE_KEYS_ANTERIORES],
        });

        if (!activo) return;

        aplicarDatosExternos(envelope.data, envelope.hash);
        setVaultStatus(await getPanelVaultStatus());
      } catch (error) {
        console.error("No se pudo iniciar el almacenamiento protegido:", error);

        if (!activo) return;

        setProyectos(crearProyectosIniciales());
        setMensaje(
          "No se pudo abrir el almacén protegido. Se cargó la configuración base.",
        );
        setVaultStatus((actual) => ({
          ...actual,
          indexedDb: false,
          lastError:
            error instanceof Error
              ? error.message
              : "Error de almacenamiento.",
        }));
      } finally {
        if (activo) setHidratado(true);
      }
    };

    void iniciar();

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    if (!hidratado) return;

    const timer = window.setTimeout(async () => {
      setVaultStatus((actual) => ({
        ...actual,
        saving: true,
        lastError: undefined,
      }));

      try {
        const envelope = await savePanelVault(
          proyectos,
          "Cambio guardado desde el panel comercial",
        );
        ultimoHashAplicadoRef.current = envelope.hash;

        const status = await getPanelVaultStatus();
        setVaultStatus((actual) => ({
          ...actual,
          ...status,
          saving: false,
          lastSavedAt: envelope.updatedAt,
        }));
      } catch (error) {
        console.error("No se pudo guardar el panel:", error);
        setVaultStatus((actual) => ({
          ...actual,
          saving: false,
          lastError:
            error instanceof Error ? error.message : "Error al guardar.",
        }));
        setMensaje(
          "No se pudo completar el guardado protegido. Descarga un respaldo.",
        );
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [proyectos, hidratado]);

  useEffect(() => {
    return subscribePanelVault<Proyecto[]>((envelope) => {
      if (envelope.hash === ultimoHashAplicadoRef.current) return;

      aplicarDatosExternos(
        envelope.data,
        envelope.hash,
        "Cambios sincronizados desde otra pestaña de este navegador.",
      );
    });
  }, []);

  useEffect(() => {
    if (!hidratado) return;

    let sincronizando = false;

    const sincronizar = async (pedirPermiso = false) => {
      if (sincronizando) return;
      sincronizando = true;

      try {
        const envelope = await syncSharedMasterFile<Proyecto[]>(pedirPermiso);

        if (
          envelope &&
          envelope.hash !== ultimoHashAplicadoRef.current
        ) {
          aplicarDatosExternos(
            envelope.data,
            envelope.hash,
            "Se recibió una versión más reciente del archivo maestro.",
          );
        }

        const status = await getPanelVaultStatus();
        setVaultStatus((actual) => ({
          ...actual,
          ...status,
          lastSharedSyncAt: envelope ? new Date().toISOString() : actual.lastSharedSyncAt,
        }));
      } catch (error) {
        if (pedirPermiso) {
          setMensaje(
            error instanceof Error
              ? error.message
              : "No se pudo sincronizar el archivo maestro.",
          );
        }
      } finally {
        sincronizando = false;
      }
    };

    void sincronizar(false);

    const intervalo = window.setInterval(() => {
      void sincronizar(false);
    }, 15_000);

    const alRecuperarFoco = () => {
      void sincronizar(false);
    };

    window.addEventListener("focus", alRecuperarFoco);

    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener("focus", alRecuperarFoco);
    };
  }, [hidratado]);

  useEffect(() => {
    if (!loteSeleccionadoId) return;

    setFormulario((actual) => {
      const precio = Number(actual.precioVenta) || 0;
      const inicial = Number(actual.inicial) || 0;

      if (
        actual.modalidadPago !== "Financiado" ||
        inicial <= 0 ||
        inicial >= precio
      ) {
        return actual.cuotasMensuales.length === 0
          ? actual
          : { ...actual, cuotasMensuales: [] };
      }

      const plan = generarCuotasMensuales(
        Math.max(precio - inicial, 0),
        Number(actual.cuotas) || 0,
        actual.fechaPrimeraCuota,
        actual.cuotasMensuales,
      );

      return JSON.stringify(actual.cuotasMensuales) === JSON.stringify(plan)
        ? actual
        : { ...actual, cuotasMensuales: plan };
    });
  }, [
    loteSeleccionadoId,
    formulario.precioVenta,
    formulario.inicial,
    formulario.modalidadPago,
    formulario.cuotas,
    formulario.fechaPrimeraCuota,
  ]);

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

  const resumenFormularioActual = useMemo(
    () => calcularResumenFormulario(formulario),
    [formulario],
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
    };
    let valorVendido = 0;
    let reservasConPago = 0;
    let reservasPorVencer = 0;
    let cuotasVencidas = 0;

    proyecto?.lotes.forEach((lote) => {
      conteo[lote.estado] += 1;

      if (lote.estado === "vendido") {
        valorVendido += lote.operacion?.precioVenta ?? lote.precioLista;
      }

      if (lote.estado === "reservado") {
        if ((lote.operacion?.montoReserva ?? 0) > 0) {
          reservasConPago += 1;
        }

        const dias = diasHasta(
          fechaCompromisoOperacion(lote.operacion),
        );

        if (
          !compromisoPagoCumplido(lote.operacion) &&
          dias !== null &&
          dias >= 0 &&
          dias <= 3
        ) {
          reservasPorVencer += 1;
        }
      }

      cuotasVencidas +=
        lote.operacion?.cuotasMensuales?.filter(cuotaEstaVencida).length ?? 0;
    });

    return {
      ...conteo,
      valorVendido,
      reservasConPago,
      reservasPorVencer,
      cuotasVencidas,
    };
  }, [proyecto]);


  const reservasPorVencer = useMemo(() => {
    if (!proyecto) return [];

    return proyecto.lotes
      .filter((lote) => {
        const dias = diasHasta(
          fechaCompromisoOperacion(lote.operacion),
        );

        return (
          lote.estado === "reservado" &&
          !compromisoPagoCumplido(lote.operacion) &&
          dias !== null &&
          dias >= 0 &&
          dias <= 3
        );
      })
      .sort((a, b) =>
        (fechaCompromisoOperacion(a.operacion) ?? "").localeCompare(
          fechaCompromisoOperacion(b.operacion) ?? "",
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
        fechaCompromisoOperacion(lote.operacion),
        ...(lote.operacion?.cuotasMensuales ?? []).flatMap((cuota) => [
          cuota.fechaVencimiento,
          cuota.pagada ? "pagada" : "pendiente",
        ]),
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
      fechaCompromisoPago:
        estado === "reservado" && !actual.fechaCompromisoPago
          ? sumarDiasISO(
              actual.fechaOperacion || fechaActualISO(),
              DIAS_COMPROMISO_POR_DEFECTO,
            )
          : actual.fechaCompromisoPago,
    }));
  }

  function cambiarModalidadPago(modalidadPago: ModalidadPago) {
    setFormulario((actual) => {
      if (modalidadPago === "Contado") {
        return {
          ...actual,
          modalidadPago,
          inicial: "",
          pagoInicialConfirmado: false,
          fechaPagoInicial: "",
          cuotas: "0",
          fechaPrimeraCuota: "",
          cuotasMensuales: [],
        };
      }

      const reserva = Number(actual.montoReserva) || MONTO_RESERVA_POR_DEFECTO;
      const inicialActual = Number(actual.inicial) || 0;
      const fechaCompromisoPago =
        actual.fechaCompromisoPago ||
        sumarDiasISO(
          actual.fechaOperacion || fechaActualISO(),
          DIAS_COMPROMISO_POR_DEFECTO,
        );

      return {
        ...actual,
        modalidadPago,
        inicial:
          inicialActual >= reserva ? actual.inicial : String(reserva),
        pagoTotalConfirmado: false,
        fechaPagoTotal: "",
        cuotas:
          Number(actual.cuotas) >= 1 && Number(actual.cuotas) <= 120
            ? actual.cuotas
            : "12",
        fechaPrimeraCuota:
          actual.fechaPrimeraCuota ||
          sumarMesesISO(fechaCompromisoPago, 1),
      };
    });
  }


  function validarFormulario() {
    const requiereCliente =
      formulario.estado === "reservado" || formulario.estado === "vendido";
    const precioVenta = Number(formulario.precioVenta) || 0;
    const montoReserva = Number(formulario.montoReserva) || 0;
    const inicial = Number(formulario.inicial) || 0;
    const cantidadCuotas = Number(formulario.cuotas) || 0;

    if (requiereCliente && !formulario.nombres.trim()) {
      return "Ingresa los nombres y apellidos del cliente.";
    }
    if (formulario.dni && !/^\d{8}$/.test(formulario.dni.trim())) {
      return "El DNI debe tener exactamente 8 dígitos.";
    }
    if (
      formulario.celular &&
      !/^\d{9}$/.test(formulario.celular.replace(/\s/g, ""))
    ) {
      return "El celular debe tener 9 dígitos.";
    }
    if (requiereCliente && precioVenta <= 0) {
      return "El precio acordado debe ser mayor que cero.";
    }
    if (requiereCliente && montoReserva <= 0) {
      return "Registra el monto entregado para reservar el lote.";
    }
    if (montoReserva > precioVenta && precioVenta > 0) {
      return "La reserva no puede superar el precio acordado.";
    }
    if (!fechaEsValida(formulario.fechaOperacion)) {
      return "Indica la fecha en que se realizó la reserva.";
    }
    if (!fechaEsValida(formulario.fechaPagoReserva)) {
      return "Indica la fecha en que se recibió el pago de la reserva.";
    }
    if (!fechaEsValida(formulario.fechaCompromisoPago)) {
      return formulario.modalidadPago === "Contado"
        ? "Indica cuándo regresará el cliente para cancelar el saldo total."
        : "Indica cuándo regresará el cliente para completar la inicial.";
    }
    if (formulario.fechaCompromisoPago < formulario.fechaOperacion) {
      return "La fecha del próximo pago no puede ser anterior a la reserva.";
    }

    const compromisoConfirmado =
      formulario.modalidadPago === "Contado"
        ? formulario.pagoTotalConfirmado
        : formulario.pagoInicialConfirmado;

    if (
      formulario.estado === "reservado" &&
      !compromisoConfirmado &&
      formulario.fechaCompromisoPago < fechaActualISO()
    ) {
      return "No puedes guardar una reserva con una fecha de pago ya vencida.";
    }

    if (formulario.modalidadPago === "Contado") {
      if (
        formulario.pagoTotalConfirmado &&
        !fechaEsValida(formulario.fechaPagoTotal)
      ) {
        return "Indica la fecha en que se recibió el pago total.";
      }

      if (
        formulario.estado === "vendido" &&
        !formulario.pagoTotalConfirmado
      ) {
        return "Para marcar el lote como vendido al contado, confirma el pago total.";
      }
    }

    if (formulario.modalidadPago === "Financiado") {
      if (inicial < montoReserva) {
        return "La inicial total debe ser igual o mayor que la reserva recibida.";
      }
      if (inicial >= precioVenta && precioVenta > 0) {
        return "Si el cliente pagará todo el precio, selecciona la modalidad Contado.";
      }
      if (
        !Number.isInteger(cantidadCuotas) ||
        cantidadCuotas < 1 ||
        cantidadCuotas > 120
      ) {
        return "La cantidad de cuotas debe ser un número entero entre 1 y 120.";
      }
      if (!fechaEsValida(formulario.fechaPrimeraCuota)) {
        return "Indica la fecha de vencimiento de la primera cuota.";
      }
      if (formulario.fechaPrimeraCuota < formulario.fechaCompromisoPago) {
        return "La primera cuota no puede vencer antes de completar la inicial.";
      }
      if (formulario.cuotasMensuales.length !== cantidadCuotas) {
        return "No se pudo generar correctamente el cronograma mensual.";
      }
      if (
        formulario.pagoInicialConfirmado &&
        !fechaEsValida(formulario.fechaPagoInicial)
      ) {
        return "Indica la fecha en que se completó la inicial.";
      }
      if (
        formulario.estado === "vendido" &&
        !formulario.pagoInicialConfirmado
      ) {
        return "Para marcar el lote como vendido financiado, confirma primero la inicial.";
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
    const inicial =
      formulario.modalidadPago === "Financiado"
        ? Number(formulario.inicial) || 0
        : 0;
    const cuotasMensuales =
      formulario.modalidadPago === "Financiado"
        ? formulario.cuotasMensuales
        : [];

    const resumen = calcularResumenFormulario(formulario);
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

            const cliente: Cliente = {
              nombres: formulario.nombres.trim(),
              dni: formulario.dni.trim(),
              celular: formulario.celular.replace(/\s/g, ""),
              asesor: formulario.asesor.trim(),
              observaciones: formulario.observaciones.trim(),
            };

            const operacion: Operacion = {
              fechaOperacion: formulario.fechaOperacion,
              precioVenta,
              montoReserva,
              fechaPagoReserva: formulario.fechaPagoReserva,
              inicial,
              fechaCompromisoPago: formulario.fechaCompromisoPago,
              pagoInicialConfirmado:
                formulario.modalidadPago === "Financiado"
                  ? formulario.pagoInicialConfirmado
                  : false,
              fechaPagoInicial:
                formulario.modalidadPago === "Financiado" &&
                formulario.pagoInicialConfirmado
                  ? formulario.fechaPagoInicial
                  : undefined,
              pagoTotalConfirmado:
                formulario.modalidadPago === "Contado"
                  ? formulario.pagoTotalConfirmado
                  : false,
              fechaPagoTotal:
                formulario.modalidadPago === "Contado" &&
                formulario.pagoTotalConfirmado
                  ? formulario.fechaPagoTotal
                  : undefined,
              saldo: resumen.saldoPendiente,
              modalidadPago: formulario.modalidadPago,
              cuotas:
                formulario.modalidadPago === "Financiado"
                  ? Number(formulario.cuotas) || 0
                  : 0,
              fechaPrimeraCuota:
                formulario.modalidadPago === "Financiado"
                  ? formulario.fechaPrimeraCuota
                  : undefined,
              cuotasMensuales,
              liberacionAutomatica:
                formulario.estado === "reservado"
                  ? formulario.liberacionAutomatica
                  : undefined,

              // Alias para que respaldos anteriores sigan siendo compatibles.
              fechaLimiteReserva: formulario.fechaCompromisoPago,
              pagoReservaConfirmado: montoReserva > 0,
            };

            const cuotasAnteriores = lote.operacion?.cuotasMensuales ?? [];
            const cuotasModificadas =
              JSON.stringify(
                cuotasAnteriores.map((cuota) => ({
                  numero: cuota.numero,
                  pagada: cuota.pagada,
                  fechaPago: cuota.fechaPago,
                })),
              ) !==
              JSON.stringify(
                cuotasMensuales.map((cuota) => ({
                  numero: cuota.numero,
                  pagada: cuota.pagada,
                  fechaPago: cuota.fechaPago,
                })),
              );

            const accion: AccionMovimiento =
              lote.estado !== "reservado" &&
              formulario.estado === "reservado"
                ? "reserva"
                : lote.estado !== "vendido" &&
                    formulario.estado === "vendido"
                  ? "venta"
                  : cuotasModificadas
                    ? "pago_cuota"
                    : "actualizacion";

            const descripcion =
              accion === "reserva"
                ? formulario.modalidadPago === "Contado"
                  ? `Reserva de ${moneda(
                      montoReserva,
                    )} registrada. El cliente acordó cancelar ${moneda(
                      resumen.pagoPendienteContado,
                    )} el ${textoFecha(formulario.fechaCompromisoPago)}.`
                  : `Reserva de ${moneda(
                      montoReserva,
                    )} registrada. Inicial total de ${moneda(
                      inicial,
                    )}; falta completar ${moneda(
                      resumen.pendienteInicial,
                    )} hasta el ${textoFecha(
                      formulario.fechaCompromisoPago,
                    )}. Financiamiento en ${
                      cuotasMensuales.length
                    } cuotas de aproximadamente ${moneda(
                      resumen.cuotaMensual,
                    )}.`
                : accion === "venta"
                  ? formulario.modalidadPago === "Financiado"
                    ? `Venta financiada registrada con inicial total de ${moneda(
                        inicial,
                      )} y ${cuotasMensuales.length} cuotas mensuales.`
                    : `Venta al contado registrada. Pago total de ${moneda(
                        precioVenta,
                      )} confirmado.`
                  : accion === "pago_cuota"
                    ? `Cronograma actualizado: ${
                        cuotasMensuales.filter((cuota) => cuota.pagada).length
                      } de ${cuotasMensuales.length} cuotas pagadas.`
                    : "Información comercial del lote actualizada.";

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

  function marcarCuotaFormulario(numero: number, pagada: boolean) {
    setFormulario((actual) => ({
      ...actual,
      cuotasMensuales: actual.cuotasMensuales.map((cuota) =>
        cuota.numero === numero
          ? {
              ...cuota,
              pagada,
              fechaPago: pagada ? fechaActualISO() : undefined,
            }
          : cuota,
      ),
    }));
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
      downloadPanelBackup(proyectos);
      setMensaje("Respaldo descargado correctamente.");
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

  async function conectarArchivoMaestro() {
    try {
      setVaultStatus((actual) => ({
        ...actual,
        saving: true,
        lastError: undefined,
      }));

      const envelope = await connectSharedMasterFile(proyectos);

      if (respaldoValido(envelope.data)) {
        aplicarDatosExternos(
          envelope.data,
          envelope.hash,
          "Archivo maestro conectado correctamente.",
        );
      }

      const status = await getPanelVaultStatus();
      setVaultStatus((actual) => ({
        ...actual,
        ...status,
        saving: false,
        lastSharedSyncAt: new Date().toISOString(),
      }));

      setMensaje(
        `Archivo maestro conectado: ${
          status.sharedFileName ?? "casagrande-panel-maestro.json"
        }.`,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setVaultStatus((actual) => ({ ...actual, saving: false }));
        return;
      }

      console.error(error);
      setVaultStatus((actual) => ({
        ...actual,
        saving: false,
        lastError:
          error instanceof Error
            ? error.message
            : "No se pudo conectar el archivo.",
      }));
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo conectar el archivo maestro.",
      );
    }
  }

  async function sincronizarArchivoMaestro() {
    try {
      setVaultStatus((actual) => ({ ...actual, saving: true }));

      const envelope = await syncSharedMasterFile<Proyecto[]>(true);

      if (envelope && respaldoValido(envelope.data)) {
        aplicarDatosExternos(
          envelope.data,
          envelope.hash,
          "Archivo maestro sincronizado.",
        );
      }

      const status = await getPanelVaultStatus();
      setVaultStatus((actual) => ({
        ...actual,
        ...status,
        saving: false,
        lastSharedSyncAt: new Date().toISOString(),
      }));

      setMensaje("Archivo maestro sincronizado correctamente.");
    } catch (error) {
      console.error(error);
      setVaultStatus((actual) => ({
        ...actual,
        saving: false,
        lastError:
          error instanceof Error
            ? error.message
            : "No se pudo sincronizar.",
      }));
      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo sincronizar el archivo maestro.",
      );
    }
  }

  async function desconectarArchivoMaestro() {
    const confirmar = window.confirm(
      "¿Desconectar el archivo maestro? Los datos locales protegidos se conservarán.",
    );
    if (!confirmar) return;

    await disconnectSharedMasterFile();
    setVaultStatus(await getPanelVaultStatus());
    setMensaje("Archivo maestro desconectado.");
  }

  async function recuperarVersionAnterior() {
    const confirmar = window.confirm(
      "¿Recuperar la versión anterior guardada? La versión actual quedará registrada en el historial local.",
    );
    if (!confirmar) return;

    try {
      const envelope = await restorePreviousSnapshot<Proyecto[]>();

      if (!envelope) {
        setMensaje("No existe una versión anterior diferente para recuperar.");
        return;
      }

      aplicarDatosExternos(
        envelope.data,
        envelope.hash,
        "Versión anterior recuperada correctamente.",
      );
      setVaultStatus(await getPanelVaultStatus());
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo recuperar la versión anterior.");
    }
  }

  if (!montado) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
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
                onClick={() => void conectarArchivoMaestro()}
                disabled={!vaultStatus.sharedFileSupported || vaultStatus.saving}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                title={
                  vaultStatus.sharedFileSupported
                    ? "Conecta un archivo JSON que puede guardarse dentro de una carpeta sincronizada."
                    : "El navegador no admite escritura directa de archivos."
                }
              >
                <FolderSync className="h-4 w-4" />
                {vaultStatus.sharedFileName
                  ? "Cambiar archivo maestro"
                  : "Conectar archivo maestro"}
              </button>

              {vaultStatus.sharedFileName && (
                <>
                  <button
                    type="button"
                    onClick={() => void sincronizarArchivoMaestro()}
                    disabled={vaultStatus.saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-800 transition hover:bg-sky-100 disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" /> Sincronizar archivo
                  </button>
                  <button
                    type="button"
                    onClick={() => void desconectarArchivoMaestro()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Desconectar
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => void recuperarVersionAnterior()}
                disabled={vaultStatus.saving}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800 transition hover:bg-violet-100 disabled:opacity-50"
              >
                <Undo2 className="h-4 w-4" /> Recuperar anterior
              </button>
            </div>
          </div>

          {/* <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <p className="font-black text-slate-900">
                  Almacenamiento protegido 100% frontend
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  La información se guarda en IndexedDB, solicita persistencia al
                  navegador, conserva hasta 100 versiones y se sincroniza entre
                  pestañas del mismo navegador. Para trasladar cambios entre
                  navegadores o computadoras sin crear un backend, conecta el mismo
                  archivo maestro dentro de una carpeta sincronizada por OneDrive,
                  Dropbox o Google Drive para escritorio. Cada navegador debe
                  autorizar ese archivo una vez.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <EstadoAlmacenamiento
                icono={<Database className="h-4 w-4" />}
                titulo="Base local"
                valor={vaultStatus.indexedDb ? "IndexedDB activa" : "Con error"}
                correcto={vaultStatus.indexedDb}
              />
              <EstadoAlmacenamiento
                icono={<HardDrive className="h-4 w-4" />}
                titulo="Persistencia"
                valor={
                  vaultStatus.persistent === true
                    ? "Protegida"
                    : vaultStatus.persistent === false
                      ? "No concedida"
                      : "Por confirmar"
                }
                correcto={vaultStatus.persistent === true}
              />
              <EstadoAlmacenamiento
                icono={<FolderSync className="h-4 w-4" />}
                titulo="Archivo maestro"
                valor={vaultStatus.sharedFileName ?? "No conectado"}
                correcto={
                  Boolean(vaultStatus.sharedFileName) &&
                  vaultStatus.sharedFilePermission === "granted"
                }
              />
              <EstadoAlmacenamiento
                icono={<Save className="h-4 w-4" />}
                titulo="Guardado"
                valor={
                  vaultStatus.saving
                    ? "Guardando..."
                    : vaultStatus.lastSavedAt
                      ? textoFechaHora(vaultStatus.lastSavedAt)
                      : "Pendiente"
                }
                correcto={!vaultStatus.saving && !vaultStatus.lastError}
              />
            </div>

            {vaultStatus.lastError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {vaultStatus.lastError}
              </div>
            )}
          </div> */}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1840px] gap-5 px-3 py-5 sm:px-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-6 xl:px-8">
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
                detalle={`${resumenProyecto.reservasConPago} con reserva pagada`}
              />
              <ResumenCard
                icono={<AlertTriangle className="h-5 w-5" />}
                titulo="Por vencer"
                valor={resumenProyecto.reservasPorVencer}
                detalle={
                  resumenProyecto.cuotasVencidas > 0
                    ? `${resumenProyecto.cuotasVencidas} cuota${
                        resumenProyecto.cuotasVencidas === 1 ? "" : "s"
                      } vencida${
                        resumenProyecto.cuotasVencidas === 1 ? "" : "s"
                      }`
                    : "Reservas en los próximos 3 días"
                }
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
                    const dias = diasHasta(fechaCompromisoOperacion(lote.operacion)) ?? 0;
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
                </select>
              </label>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm sm:p-2">
            {vista === "lotes" ? (
              lotesFiltrados.length > 0 ? (
                tienePlanoProyecto(proyecto.slug) ? (
                  <PlanoLotes
                    proyectoSlug={proyecto.slug}
                    lotes={proyecto.lotes}
                    lotesFiltrados={lotesFiltrados}
                    onSeleccionar={(lote: Lote) => abrirFicha(lote)}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {lotesFiltrados.map((lote) => (
                      <LoteCard
                        key={lote.id}
                        lote={lote}
                        onClick={() => abrirFicha(lote)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <EstadoVacio
                  titulo="No se encontraron lotes"
                  descripcion="Prueba con otro estado o elimina el texto de búsqueda."
                />
              )
            ) : clientesProyecto.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {clientesProyecto.map((lote) => (
                  <ClienteCard
                    key={lote.id}
                    lote={lote}
                    onEditar={() => abrirFicha(lote)}
                  />
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
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(ESTADO_CONFIG) as EstadoLote[]).map(
                        (estado) => {
                          const seleccionado = formulario.estado === estado;
                          return (
                            <button
                              key={estado}
                              type="button"
                              onClick={() => cambiarEstadoFormulario(estado)}
                              className={`rounded-xl border px-2 py-3 text-xs font-bold transition sm:text-sm ${
                                seleccionado
                                  ? "border-[#123B68] bg-[#123B68] text-white ring-4 ring-[#123B68]/10"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {ESTADO_CONFIG[estado].label}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  {formulario.estado === "reservado" && (
                    <EstadoReservaPreview formulario={formulario} />
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-black text-slate-800">
                      Flujo comercial
                    </p>
                    <p className="mt-2 leading-6">
                      <strong>Disponible:</strong> se puede ofrecer.
                      <br />
                      <strong>Reservado:</strong> se mantiene hasta la fecha
                      límite. Si la inicial no se confirma, vuelve a disponible.
                      <br />
                      <strong>Vendido:</strong> la inicial debe estar confirmada
                      y el cronograma queda registrado.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 font-black text-slate-900">
                      <History className="h-4 w-4 text-[#123B68]" />
                      Historial del lote
                    </div>
                    <div className="mt-3 max-h-64 space-y-3 overflow-y-auto">
                      {(loteSeleccionado.movimientos ?? []).length > 0 ? (
                        [...(loteSeleccionado.movimientos ?? [])]
                          .reverse()
                          .slice(0, 10)
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
                      <UserRound className="h-5 w-5 text-[#123B68]" />
                      Datos del cliente
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
                          actualizarCampo(
                            "celular",
                            valor.replace(/\D/g, ""),
                          )
                        }
                        placeholder="9 dígitos"
                        inputMode="tel"
                        maxLength={9}
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
                      <WalletCards className="h-5 w-5 text-[#123B68]" />
                      Datos de la operación
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo
                        label="Fecha de reserva"
                        type="date"
                        value={formulario.fechaOperacion}
                        onChange={(valor) =>
                          setFormulario((actual) => {
                            if (!fechaEsValida(valor)) {
                              return {
                                ...actual,
                                fechaOperacion: valor,
                              };
                            }

                            const nuevoCompromiso = sumarDiasISO(
                              valor,
                              DIAS_COMPROMISO_POR_DEFECTO,
                            );

                            return {
                              ...actual,
                              fechaOperacion: valor,
                              fechaPagoReserva: fechaEsValida(
                                actual.fechaPagoReserva,
                              )
                                ? actual.fechaPagoReserva
                                : valor,
                              fechaCompromisoPago: nuevoCompromiso,
                              fechaPrimeraCuota:
                                actual.cuotasMensuales.some(
                                  (cuota) => cuota.pagada,
                                )
                                  ? actual.fechaPrimeraCuota
                                  : sumarMesesISO(nuevoCompromiso, 1),
                            };
                          })
                        }
                      />

                      <Campo
                        label="Precio acordado"
                        type="number"
                        value={formulario.precioVenta}
                        onChange={(valor) =>
                          actualizarCampo("precioVenta", valor)
                        }
                        min="0"
                        step="0.01"
                      />

                      <Campo
                        label="Reserva recibida"
                        type="number"
                        value={formulario.montoReserva}
                        onChange={(valor) =>
                          actualizarCampo("montoReserva", valor)
                        }
                        min="0"
                        step="0.01"
                        placeholder="1000"
                      />

                      <Campo
                        label="Fecha de pago de la reserva"
                        type="date"
                        value={formulario.fechaPagoReserva}
                        onChange={(valor) =>
                          actualizarCampo("fechaPagoReserva", valor)
                        }
                      />

                      <label className="block sm:col-span-2">
                        <span className="mb-2 block text-sm font-bold text-slate-700">
                          Modalidad después de la reserva
                        </span>
                        <select
                          value={formulario.modalidadPago}
                          onChange={(evento) =>
                            cambiarModalidadPago(
                              evento.target.value as ModalidadPago,
                            )
                          }
                          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#123B68] focus:ring-4 focus:ring-[#123B68]/10"
                        >
                          <option value="Contado">
                            Contado
                          </option>
                          <option value="Financiado">
                            Financiado
                          </option>
                        </select>
                      </label>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-black text-emerald-950">
                        <BadgeCheck className="h-5 w-5" />
                        Reserva registrada
                      </div>
                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        El cliente separa el lote con{" "}
                        <strong>
                          {moneda(resumenFormularioActual.reserva)}
                        </strong>
                        . Este importe forma parte del precio total del lote.
                      </p>
                    </div>

                    {formulario.modalidadPago === "Contado" ? (
                      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-5">
                        <div className="flex items-center gap-2 font-black text-sky-950">
                          <CircleDollarSign className="h-5 w-5" />
                          Compromiso de pago al contado
                        </div>
                        <p className="mt-1 text-sm leading-6 text-sky-800">
                          Después de la reserva, el cliente debe cancelar el
                          saldo de{" "}
                          <strong>
                            {moneda(
                              resumenFormularioActual.pagoPendienteContado,
                            )}
                          </strong>{" "}
                          en la fecha acordada.
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <Campo
                            label="Fecha acordada para pagar el saldo total"
                            type="date"
                            value={formulario.fechaCompromisoPago}
                            onChange={(valor) =>
                              actualizarCampo(
                                "fechaCompromisoPago",
                                valor,
                              )
                            }
                            min={
                              formulario.fechaOperacion ||
                              fechaActualISO()
                            }
                          />

                          <ToggleCard
                            checked={formulario.pagoTotalConfirmado}
                            onChange={(checked) => {
                              actualizarCampo(
                                "pagoTotalConfirmado",
                                checked,
                              );
                              actualizarCampo(
                                "fechaPagoTotal",
                                checked
                                  ? formulario.fechaPagoTotal ||
                                      fechaActualISO()
                                  : "",
                              );
                            }}
                            titulo="Pago total confirmado"
                            descripcion="El cliente ya canceló todo el precio acordado."
                            icono={<BadgeCheck className="h-5 w-5" />}
                          />

                          <Campo
                            label="Fecha real del pago total"
                            type="date"
                            value={formulario.fechaPagoTotal}
                            onChange={(valor) =>
                              actualizarCampo("fechaPagoTotal", valor)
                            }
                            disabled={!formulario.pagoTotalConfirmado}
                            className="sm:col-span-2"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                          <div className="flex items-center gap-2 font-black text-amber-950">
                            <WalletCards className="h-5 w-5" />
                            Inicial del financiamiento
                          </div>
                          <p className="mt-1 text-sm leading-6 text-amber-800">
                            La inicial total incluye la reserva de{" "}
                            {moneda(resumenFormularioActual.reserva)}.
                            Registra cuánto será la inicial completa y cuándo
                            regresará el cliente para terminar de pagarla.
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Campo
                              label="Inicial total acordada (incluye reserva)"
                              type="number"
                              value={formulario.inicial}
                              onChange={(valor) =>
                                actualizarCampo("inicial", valor)
                              }
                              min={formulario.montoReserva || "0"}
                              step="0.01"
                              placeholder="Ej. 10000"
                            />

                            <Campo
                              label="Fecha para completar la inicial"
                              type="date"
                              value={formulario.fechaCompromisoPago}
                              onChange={(valor) =>
                                setFormulario((actual) => ({
                                  ...actual,
                                  fechaCompromisoPago: valor,
                                  fechaPrimeraCuota:
                                    actual.cuotasMensuales.some(
                                      (cuota) => cuota.pagada,
                                    )
                                      ? actual.fechaPrimeraCuota
                                      : sumarMesesISO(valor, 1),
                                }))
                              }
                              min={
                                formulario.fechaOperacion ||
                                fechaActualISO()
                              }
                            />

                            <div className="rounded-xl border border-amber-200 bg-white p-3">
                              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                                Falta para completar la inicial
                              </p>
                              <p className="mt-1 text-xl font-black text-slate-950">
                                {moneda(
                                  resumenFormularioActual.pendienteInicial,
                                )}
                              </p>
                            </div>

                            <ToggleCard
                              checked={formulario.pagoInicialConfirmado}
                              onChange={(checked) => {
                                actualizarCampo(
                                  "pagoInicialConfirmado",
                                  checked,
                                );
                                actualizarCampo(
                                  "fechaPagoInicial",
                                  checked
                                    ? formulario.fechaPagoInicial ||
                                        fechaActualISO()
                                    : "",
                                );
                              }}
                              titulo="Inicial completada"
                              descripcion="La reserva y el resto de la inicial ya fueron pagados."
                              icono={<BadgeCheck className="h-5 w-5" />}
                            />

                            <Campo
                              label="Fecha real de pago de la inicial"
                              type="date"
                              value={formulario.fechaPagoInicial}
                              onChange={(valor) =>
                                actualizarCampo(
                                  "fechaPagoInicial",
                                  valor,
                                )
                              }
                              disabled={!formulario.pagoInicialConfirmado}
                              className="sm:col-span-2"
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#123B68]/20 bg-[#123B68]/5 p-4 sm:p-5">
                          <div className="flex items-center gap-2 font-black text-slate-950">
                            <CalendarDays className="h-5 w-5 text-[#123B68]" />
                            Cuotas mensuales
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            El saldo financiado es el precio menos la inicial
                            total. El gerente define libremente la cantidad de
                            cuotas mensuales.
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <Campo
                              label="Cantidad de cuotas mensuales"
                              type="number"
                              value={formulario.cuotas}
                              onChange={(valor) =>
                                actualizarCampo(
                                  "cuotas",
                                  valor.replace(/\D/g, ""),
                                )
                              }
                              min="1"
                              max="120"
                              step="1"
                              inputMode="numeric"
                              placeholder="Ej. 12, 18, 24"
                            />

                            <Campo
                              label="Vencimiento de la primera cuota"
                              type="date"
                              value={formulario.fechaPrimeraCuota}
                              onChange={(valor) =>
                                actualizarCampo(
                                  "fechaPrimeraCuota",
                                  valor,
                                )
                              }
                              min={
                                formulario.fechaCompromisoPago ||
                                formulario.fechaOperacion ||
                                fechaActualISO()
                              }
                            />
                          </div>

                          <div className="mt-4 rounded-xl border border-[#123B68]/15 bg-white p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Cuota mensual referencial
                            </p>
                            <p className="mt-1 text-2xl font-black text-[#123B68]">
                              {moneda(
                                resumenFormularioActual.cuotaMensual,
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formulario.cuotas} pagos mensuales. La última
                              cuota se ajusta por redondeo.
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {formulario.estado === "reservado" && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                        <div className="flex items-center gap-2 font-black text-rose-950">
                          <AlarmClock className="h-5 w-5" />
                          Control de vencimiento
                        </div>
                        <p className="mt-1 text-sm leading-6 text-rose-800">
                          Si el cliente no cumple el{" "}
                          {formulario.modalidadPago === "Contado"
                            ? "pago total"
                            : "pago de la inicial"}{" "}
                          en la fecha acordada, el lote puede volver a
                          disponible.
                        </p>
                        <div className="mt-4">
                          <ToggleCard
                            checked={formulario.liberacionAutomatica}
                            onChange={(checked) =>
                              actualizarCampo(
                                "liberacionAutomatica",
                                checked,
                              )
                            }
                            titulo="Liberar automáticamente al vencer"
                            descripcion={`Fecha límite: ${textoFecha(
                              formulario.fechaCompromisoPago,
                            )}`}
                            icono={<AlarmClock className="h-5 w-5" />}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-3">
                      <Calculo
                        label="Precio acordado"
                        value={moneda(resumenFormularioActual.precio)}
                      />
                      <Calculo
                        label="Reserva pagada"
                        value={moneda(resumenFormularioActual.reserva)}
                      />
                      <Calculo
                        label={
                          formulario.modalidadPago === "Financiado"
                            ? "Inicial total"
                            : "Pago pendiente al contado"
                        }
                        value={moneda(
                          formulario.modalidadPago === "Financiado"
                            ? resumenFormularioActual.inicialTotal
                            : resumenFormularioActual.pagoPendienteContado,
                        )}
                      />
                      <Calculo
                        label="Total pagado"
                        value={moneda(
                          resumenFormularioActual.totalPagado,
                        )}
                      />
                      <Calculo
                        label="Saldo pendiente"
                        value={moneda(
                          resumenFormularioActual.saldoPendiente,
                        )}
                      />
                      <Calculo
                        label={
                          formulario.modalidadPago === "Financiado"
                            ? "Cuota mensual"
                            : "Fecha de pago total"
                        }
                        value={
                          formulario.modalidadPago === "Financiado"
                            ? moneda(
                                resumenFormularioActual.cuotaMensual,
                              )
                            : textoFecha(
                                formulario.fechaCompromisoPago,
                              )
                        }
                      />
                    </div>

                    {formulario.modalidadPago === "Financiado" && (
                      <PlanCuotas
                        cuotas={formulario.cuotasMensuales}
                        onCambiarEstado={marcarCuotaFormulario}
                        editable={formulario.pagoInicialConfirmado}
                      />
                    )}

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-slate-700">
                        Observaciones
                      </span>
                      <textarea
                        value={formulario.observaciones}
                        onChange={(evento) =>
                          actualizarCampo(
                            "observaciones",
                            evento.target.value,
                          )
                        }
                        rows={4}
                        placeholder="Acuerdos, documentación pendiente, seguimiento o condiciones especiales."
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
                      <Trash2 className="h-4 w-4" />
                      Liberar lote ahora
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
                    <Save className="h-4 w-4" />
                    Guardar cambios
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
  const operacion = lote.operacion;
  const fechaCompromiso = fechaCompromisoOperacion(operacion);
  const dias = diasHasta(fechaCompromiso);
  const compromisoCumplido = compromisoPagoCumplido(operacion);
  const siguienteCuota = siguienteCuotaPendiente(
    operacion?.cuotasMensuales,
  );
  const vencidas =
    operacion?.cuotasMensuales?.filter(cuotaEstaVencida).length ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group min-h-44 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${config.card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xl font-black text-slate-950">{lote.numero}</span>
        <span className={`h-3 w-3 rounded-full ${config.dot}`} />
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-600">
        {lote.area} m²
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {moneda(operacion?.precioVenta ?? lote.precioLista)}
      </p>

      <div className="mt-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      {lote.estado === "reservado" && (
        <div
          className={`mt-3 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
            compromisoCumplido
              ? "bg-emerald-100 text-emerald-800"
              : dias !== null && dias <= 1
                ? "bg-rose-100 text-rose-800"
                : "bg-white/70 text-amber-900"
          }`}
        >
          {compromisoCumplido
            ? operacion?.modalidadPago === "Contado"
              ? "Pago total confirmado"
              : "Inicial completada"
            : dias === null
              ? "Sin fecha de próximo pago"
              : dias < 0
                ? "Compromiso vencido"
                : dias === 0
                  ? `${
                      operacion?.modalidadPago === "Contado"
                        ? "Pago total"
                        : "Inicial"
                    } vence hoy`
                  : `${
                      operacion?.modalidadPago === "Contado"
                        ? "Pago total"
                        : "Inicial"
                    } en ${dias} día${dias === 1 ? "" : "s"}`}
        </div>
      )}

      {lote.estado === "vendido" &&
        operacion?.modalidadPago === "Financiado" && (
          <div
            className={`mt-3 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
              vencidas > 0
                ? "bg-rose-100 text-rose-800"
                : "bg-white/70 text-slate-700"
            }`}
          >
            {vencidas > 0
              ? `${vencidas} cuota${vencidas === 1 ? "" : "s"} vencida${
                  vencidas === 1 ? "" : "s"
                }`
              : siguienteCuota
                ? `Próxima: ${textoFecha(
                    siguienteCuota.fechaVencimiento,
                  )} · ${moneda(siguienteCuota.monto)}`
                : "Plan de cuotas completado"}
          </div>
        )}

      {lote.estado === "vendido" &&
        operacion?.modalidadPago === "Contado" && (
          <div className="mt-3 rounded-lg bg-emerald-100 px-2.5 py-2 text-[11px] font-bold text-emerald-800">
            Pago total confirmado
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
  const operacion = lote.operacion;
  const fechaCompromiso = fechaCompromisoOperacion(operacion);
  const dias = diasHasta(fechaCompromiso);
  const cuotas = operacion?.cuotasMensuales ?? [];
  const cuotasPagadas = cuotas.filter((cuota) => cuota.pagada).length;
  const cuotasVencidas = cuotas.filter(cuotaEstaVencida).length;
  const proximaCuota = siguienteCuotaPendiente(cuotas);
  const totalPagado = totalPagadoOperacion(operacion);
  const reserva = operacion?.montoReserva ?? 0;
  const inicial = operacion?.inicial ?? 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#123B68] text-white">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-950">
              {lote.cliente?.nombres}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              DNI: {lote.cliente?.dni || "No registrado"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${ESTADO_CONFIG[lote.estado].badge}`}
          >
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
          etiqueta="Precio acordado"
          valor={moneda(operacion?.precioVenta ?? lote.precioLista)}
        />
        <FichaDato etiqueta="Reserva pagada" valor={moneda(reserva)} />
        <FichaDato
          etiqueta="Modalidad"
          valor={operacion?.modalidadPago ?? "No registrada"}
        />
        <FichaDato etiqueta="Total pagado" valor={moneda(totalPagado)} />
        <FichaDato
          etiqueta="Saldo pendiente"
          valor={moneda(operacion?.saldo ?? 0)}
        />
        <FichaDato
          etiqueta="Celular"
          valor={lote.cliente?.celular || "No registrado"}
        />
        <FichaDato
          etiqueta="Asesor"
          valor={lote.cliente?.asesor || "No registrado"}
        />

        {lote.estado === "reservado" &&
          operacion?.modalidadPago === "Contado" && (
            <>
              <FichaDato
                etiqueta="Pagará el saldo total"
                valor={textoFecha(fechaCompromiso)}
              />
              <FichaDato
                etiqueta="Situación"
                valor={
                  operacion.pagoTotalConfirmado
                    ? "Pago total confirmado"
                    : dias === 0
                      ? "Pago pendiente · vence hoy"
                      : dias !== null && dias > 0
                        ? `Pago pendiente · ${dias} día${
                            dias === 1 ? "" : "s"
                          }`
                        : "Pago pendiente"
                }
              />
            </>
          )}

        {operacion?.modalidadPago === "Financiado" && (
          <>
            <FichaDato
              etiqueta="Inicial total"
              valor={moneda(inicial)}
            />
            <FichaDato
              etiqueta="Falta para la inicial"
              valor={moneda(
                operacion.pagoInicialConfirmado
                  ? 0
                  : Math.max(inicial - reserva, 0),
              )}
            />
            <FichaDato
              etiqueta="Fecha para completar inicial"
              valor={textoFecha(fechaCompromiso)}
            />
            <FichaDato
              etiqueta="Financiamiento"
              valor={`${operacion.cuotas || cuotas.length} meses`}
            />
            <FichaDato
              etiqueta="Cuota mensual"
              valor={moneda(cuotas[0]?.monto ?? 0)}
            />
            <FichaDato
              etiqueta="Cuotas pagadas"
              valor={`${cuotasPagadas}/${cuotas.length}`}
            />
            <FichaDato
              etiqueta="Próxima cuota"
              valor={
                proximaCuota
                  ? `${textoFecha(
                      proximaCuota.fechaVencimiento,
                    )} · ${moneda(proximaCuota.monto)}`
                  : operacion.pagoInicialConfirmado
                    ? "Plan completado"
                    : "Pendiente de completar inicial"
              }
            />
          </>
        )}
      </dl>

      {cuotasVencidas > 0 && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">
          {cuotasVencidas} cuota{cuotasVencidas === 1 ? "" : "s"} vencida
          {cuotasVencidas === 1 ? "" : "s"} pendiente
          {cuotasVencidas === 1 ? "" : "s"}.
        </div>
      )}

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
  const dias = diasHasta(formulario.fechaCompromisoPago);
  const cumplido =
    formulario.modalidadPago === "Contado"
      ? formulario.pagoTotalConfirmado
      : formulario.pagoInicialConfirmado;

  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        cumplido
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : dias !== null && dias <= 1
            ? "border-rose-200 bg-rose-50 text-rose-900"
            : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <div className="flex items-center gap-2 font-black">
        {cumplido ? (
          <BadgeCheck className="h-5 w-5" />
        ) : (
          <AlarmClock className="h-5 w-5" />
        )}
        {cumplido
          ? formulario.modalidadPago === "Contado"
            ? "Pago total confirmado"
            : "Inicial completada"
          : formulario.modalidadPago === "Contado"
            ? "Pago total pendiente"
            : "Inicial pendiente"}
      </div>

      <p className="mt-2 leading-6">
        {cumplido
          ? formulario.modalidadPago === "Contado"
            ? `El pago total fue confirmado el ${textoFecha(
                formulario.fechaPagoTotal,
              )}.`
            : `La inicial fue completada el ${textoFecha(
                formulario.fechaPagoInicial,
              )}.`
          : formulario.liberacionAutomatica
            ? `El lote volverá a disponible después del ${textoFecha(
                formulario.fechaCompromisoPago,
              )} si el cliente no cumple el pago acordado.`
            : `El pago está programado para el ${textoFecha(
                formulario.fechaCompromisoPago,
              )}, pero la liberación automática está desactivada.`}
      </p>
    </div>
  );
}


function PlanCuotas({
  cuotas,
  onCambiarEstado,
  editable,
}: {
  cuotas: CuotaMensual[];
  onCambiarEstado: (numero: number, pagada: boolean) => void;
  editable: boolean;
}) {
  if (cuotas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Completa la cantidad de cuotas y la fecha de la primera cuota para
        generar el cronograma.
      </div>
    );
  }

  const pagadas = cuotas.filter((cuota) => cuota.pagada).length;
  const vencidas = cuotas.filter(cuotaEstaVencida).length;
  const total = cuotas.reduce((suma, cuota) => suma + cuota.monto, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-slate-900">Cuotas mensuales</p>
          <p className="text-xs text-slate-500">
            {pagadas} de {cuotas.length} pagadas · Total financiado{" "}
            {moneda(total)}
            {!editable && " · confirma la inicial para registrar pagos"}
          </p>
        </div>
        {vencidas > 0 && (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800">
            {vencidas} vencida{vencidas === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[70px_1fr_1fr_130px] border-b border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-400">
            <span>Cuota</span>
            <span>Vencimiento</span>
            <span>Monto</span>
            <span>Estado</span>
          </div>

          {cuotas.map((cuota) => {
            const vencida = cuotaEstaVencida(cuota);
            return (
              <div
                key={cuota.numero}
                className={`grid grid-cols-[70px_1fr_1fr_130px] items-center border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 ${
                  vencida ? "bg-rose-50" : ""
                }`}
              >
                <strong className="text-slate-900">
                  {String(cuota.numero).padStart(2, "0")}
                </strong>
                <span className="text-slate-600">
                  {textoFecha(cuota.fechaVencimiento)}
                </span>
                <span className="font-bold text-slate-900">
                  {moneda(cuota.monto)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onCambiarEstado(cuota.numero, !cuota.pagada)
                  }
                  disabled={!editable}
                  className={`rounded-lg px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    cuota.pagada
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : vencida
                        ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cuota.pagada
                    ? `Pagada ${textoFecha(cuota.fechaPago)}`
                    : vencida
                      ? "Vencida"
                      : "Pendiente"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
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

function EstadoAlmacenamiento({
  icono,
  titulo,
  valor,
  correcto,
}: {
  icono: ReactNode;
  titulo: string;
  valor: string;
  correcto: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        {icono}
        {titulo}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            correcto ? "bg-emerald-500" : "bg-amber-500"
          }`}
        />
        <p className="min-w-0 truncate text-sm font-black text-slate-800">
          {valor}
        </p>
      </div>
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