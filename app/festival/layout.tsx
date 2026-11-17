
import type { ReactNode } from "react";

import {
  Barlow_Condensed,
  Manrope,
} from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
  variable: "--festival-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--festival-body",
});

export default function FestivalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div
      id="festival-lotes-page"
      className={`${barlow.variable} ${manrope.variable}`}
      style={{
        position: "relative",
        isolation: "isolate",
        width: "100%",
        minHeight: "100svh",
        margin: 0,
        padding: 0,
        background: "#031841",
      }}
    >
      <style>
        {`
          body:has(#festival-lotes-page)
          section[role="dialog"][aria-label^="Gran Tour Inmobiliario"],
          body:has(#festival-lotes-page)
          [data-lanzamiento-popup] {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          #festival-lotes-page {
            width: 100%;
            min-height: 100svh;
            margin: 0;
            padding: 0;
          }
        `}
      </style>

      {children}
    </div>
  );
}
