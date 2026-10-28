
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface OcultarEnEntrenamientoProps {
  children: ReactNode;
}

export default function OcultarEnEntrenamiento({
  children,
}: OcultarEnEntrenamientoProps) {
  const pathname = usePathname();

  const esEntrenamiento =
    pathname === "/entrenamiento" ||
    pathname.startsWith("/entrenamiento/");

  if (esEntrenamiento) {
    return null;
  }

  return <>{children}</>;
}
