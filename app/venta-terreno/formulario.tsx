"use client";

import React, { useMemo, useState } from "react";
import Navbar from "../navbar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeoynvdk";
const WHATSAPP_NUMBER = "51916194372"; // tu número correcto sin +
const BRAND = "Casagrande Bienes y Raíces";

type Status = "idle" | "sending" | "success" | "error";
type TipoPropiedad =
  | "terreno"
  | "casa"
  | "departamento"
  | "local"
  | "otros"
  | "";

function labelTipo(t: TipoPropiedad) {
  switch (t) {
    case "terreno":
      return "Terreno";
    case "casa":
      return "Casa";
    case "departamento":
      return "Departamento";
    case "local":
      return "Local comercial";
    case "otros":
      return "Otros";
    default:
      return "-";
  }
}

export default function VentaPropiedadSimplePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState<string>("");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [lugar, setLugar] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState<TipoPropiedad>("");

  const whatsappText = useMemo(() => {
    return [
      `Hola ${BRAND}, quiero vender una propiedad.`,
      ``,
      `*Datos del propietario:*`,
      `• Tipo: ${labelTipo(tipo)}`,
      `• Nombre: ${nombre || "-"}`,
      `• Teléfono: ${telefono || "-"}`,
      `• Lugar: ${lugar || "-"}`,
      `• Precio: ${precio || "-"}`,
    ].join("\n");
  }, [nombre, telefono, lugar, precio, tipo]);

  const whatsappHref = useMemo(() => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappText
    )}`;
  }, [whatsappText]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!tipo || !nombre || !telefono || !lugar || !precio) {
      setStatus("error");
      setMsg("Completa todos los campos antes de enviar.");
      return;
    }

    setStatus("sending");
    setMsg("");

    try {
      const formData = new FormData();

      formData.append("tipo_propiedad", labelTipo(tipo));
      formData.append("nombre", nombre);
      formData.append("telefono", telefono);
      formData.append("lugar", lugar);
      formData.append("precio", precio);
      formData.append(
        "_subject",
        `Venta de propiedad | ${labelTipo(tipo)} | ${lugar || "Sin lugar"}`
      );

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        errors?: Array<{ message?: string }>;
      } | null;

      if (!res.ok) {
        setStatus("error");
        setMsg(
          json?.errors?.[0]?.message ??
            "No se pudo enviar. Revisa tu configuración de Formspree e inténtalo nuevamente."
        );
        return;
      }

      setStatus("success");
      setMsg("Enviado correctamente. También te estamos redirigiendo a WhatsApp.");

      // Abre WhatsApp con toda la info
      window.open(whatsappHref, "_blank");

      // Limpieza después de abrir WhatsApp
      setNombre("");
      setTelefono("");
      setLugar("");
      setPrecio("");
      setTipo("");
    } catch {
      setStatus("error");
      setMsg("Error de conexión. Inténtalo nuevamente.");
    }
  }

  const disabled = status === "sending";

  const inputCls =
    "h-16 rounded-full border-2 border-blue-600/70 bg-white px-8 text-[17px] text-slate-900 " +
    "placeholder:text-slate-400 outline-none transition " +
    "hover:border-blue-700/80 focus-visible:border-blue-700 " +
    "focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:ring-offset-0";

  const selectTriggerCls =
    "h-16 rounded-full border-2 border-blue-600/70 bg-white px-8 text-[17px] " +
    "outline-none transition hover:border-blue-700/80 focus:border-blue-700 " +
    "focus:ring-2 focus:ring-blue-600/20 focus:ring-offset-0";

  const labelCls = "text-[14px] font-semibold text-blue-700";

  return (
    <div className="pt-36 min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-[1700px] px-4 py-10 md:py-14">
        <div className="mx-auto max-w-[1700px] text-center">
          <h1 className="text-[48px] font-extrabold leading-[1.05] tracking-tight text-blue-700 md:text-7xl">
            ¿Quieres vendernos un terreno?
          </h1>

          <p className="mt-4 text-[17px] leading-relaxed text-blue-700/90 md:text-xl">
            Déjanos tus datos en el siguiente formulario y muy pronto nos
            comunicaremos contigo.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full border-blue-600/40 px-4 py-1.5 text-[14px] text-blue-700"
            >
              Atención rápida
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-blue-600/40 px-4 py-1.5 text-[14px] text-blue-700"
            >
              Proceso seguro
            </Badge>
          </div>
        </div>

        <div className="mt-12">
          <Card className="mx-auto w-full max-w-[1500px] border-0 shadow-none">
            <CardContent className="p-0">
              {status !== "idle" && msg && (
                <div
                  className={`mb-8 rounded-2xl border px-8 py-5 text-[15px] ${
                    status === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : status === "error"
                      ? "border-red-200 bg-red-50 text-red-800"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  <p className="text-[16px] font-semibold">
                    {status === "success"
                      ? "Enviado."
                      : status === "error"
                      ? "Ocurrió un problema."
                      : "Aviso"}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed">{msg}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3 md:col-span-2">
                    <Label className={labelCls}>Tipo de propiedad *</Label>
                    <Select
                      value={tipo}
                      onValueChange={(v) => setTipo(v as TipoPropiedad)}
                    >
                      <SelectTrigger className={selectTriggerCls}>
                        <SelectValue placeholder="Selecciona" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="departamento">
                          Departamento
                        </SelectItem>
                        <SelectItem value="local">Local comercial</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className={labelCls}>Nombre *</Label>
                    <Input
                      className={inputCls}
                      name="nombre"
                      value={nombre}
                      placeholder="Ej. Juan Pérez"
                      required
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className={labelCls}>Número (WhatsApp) *</Label>
                    <Input
                      className={inputCls}
                      name="telefono"
                      value={telefono}
                      placeholder="Ej. 970 993 246"
                      required
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className={labelCls}>Lugar / Ubicación *</Label>
                    <Input
                      className={inputCls}
                      name="lugar"
                      value={lugar}
                      placeholder="Ej. Qorihuillca, Huamanga – Ayacucho"
                      required
                      onChange={(e) => setLugar(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label className={labelCls}>Precio (referencial) *</Label>
                    <Input
                      className={inputCls}
                      name="precio"
                      value={precio}
                      placeholder="Ej. 15000 USD o S/ 50,000"
                      required
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="pt-2">
                  <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
                    <Button
                      type="submit"
                      disabled={disabled}
                      className="h-16 w-full rounded-full bg-yellow-500 text-lg font-semibold text-slate-900 transition hover:bg-yellow-400 active:scale-[0.99]"
                    >
                      {disabled ? "Enviando..." : "Enviar Datos"}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-16 w-full rounded-full border-2 border-blue-600/70 text-lg font-semibold text-blue-700 transition hover:bg-blue-50 active:scale-[0.99]"
                    >
                      <a href={whatsappHref} target="_blank" rel="noreferrer">
                        Contactar por WhatsApp
                      </a>
                    </Button>

                    <p className="text-center text-sm leading-relaxed text-slate-500">
                      Si no deseas esperar, escríbenos directo por WhatsApp.
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}