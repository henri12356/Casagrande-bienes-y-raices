
import { ImageResponse } from "next/og";

export const alt =
  "Festival de Lotes Casagrande, 6 de diciembre de 2026, desde S/ 14,000 y 15% de descuento";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "45px 60px",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(115deg, #031438 0%, #01338C 72%, #06275D 100%)",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* MARCA */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 45,
            height: 45,
            alignItems: "center",
            justifyContent: "center",
            background: "#FFB200",
            color: "#01338C",
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          C
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 23,
              fontWeight: 900,
            }}
          >
            CASAGRANDE
          </span>

          <span
            style={{
              fontSize: 10,
              letterSpacing: 3,
            }}
          >
            INMOBILIARIA
          </span>
        </div>
      </div>

      {/* CONTENIDO */}

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 30,
        }}
      >
        {/* TITULOS */}

        <div
          style={{
            display: "flex",
            width: 680,
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              color: "#FFD36B",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            DOMINGO 06 DE DICIEMBRE · 2026
          </span>

          <span
            style={{
              marginTop: 22,
              fontSize: 115,
              fontWeight: 900,
              letterSpacing: -5,
              lineHeight: 1,
            }}
          >
            FESTIVAL
          </span>

          <span
            style={{
              color: "#FFB200",
              fontSize: 94,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.1,
            }}
          >
            DE LOTES
          </span>

          <span
            style={{
              marginTop: 23,
              fontSize: 29,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            LOTES DESDE S/ 14,000
          </span>

          <span
            style={{
              marginTop: 12,
              color: "#D2E3FF",
              fontSize: 17,
            }}
          >
            Parque del Avión · ENACE · Ayacucho
          </span>
        </div>

        {/* PROMOCIÓN */}

        <div
          style={{
            display: "flex",
            width: 330,
            height: 315,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #FFB200",
            borderRadius: 24,
            background:
              "linear-gradient(155deg, #0B4AAA, #04235E)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              color: "#FFB200",
            }}
          >
            <span
              style={{
                fontSize: 162,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -10,
              }}
            >
              15
            </span>

            <span
              style={{
                fontSize: 73,
                fontWeight: 900,
                lineHeight: 1.2,
              }}
            >
              %
            </span>
          </div>

          <span
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            DESCUENTO
          </span>

          <span
            style={{
              marginTop: 10,
              color: "#FFCF69",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            ESPECIAL DE FESTIVAL
          </span>
        </div>
      </div>

      {/* PIE */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 20,
          borderTop: "1px solid #7599D1",
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        <span>AYACUCHO · 06 DICIEMBRE 2026</span>
        <span>CONFIRMA TU ASISTENCIA</span>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
