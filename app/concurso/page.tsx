import Footer from "../footer";
import Navbar from "../navbar";

const pdfUrl = "/BASES-CONCURSO.pdf";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f3f5f9] text-slate-900">
      <Navbar />

      <main className="flex-1 md:pt-48">
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8 ">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
            
            {/* Panel izquierdo en escritorio */}
            <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7 lg:sticky lg:top-24">
              <span className="inline-flex rounded-full bg-[#01338C]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#01338C]">
                Concurso oficial
              </span>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#011c45] sm:text-3xl lg:text-4xl">
                Bases “¡Foto con Papá!”
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Revisa el PDF oficial del concurso por el Día del Padre.
              </p>

              <div className="mt-6 grid gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#01338C] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#011c45] active:scale-[0.98]"
                >
                  Abrir PDF
                </a>

                <a
                  href={pdfUrl}
                  download="Bases-Concurso-Dia-del-Padre.pdf"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#011c45] transition hover:border-[#01338C] hover:text-[#01338C] active:scale-[0.98]"
                >
                  Descargar bases
                </a>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Documento
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  Bases completas del concurso
                </p>
              </div>
            </aside>

            {/* Visor PDF */}
            <section className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 bg-[#011c45] px-4 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-bold text-white sm:text-base">
                    Documento oficial
                  </h2>
                  <p className="text-xs text-white/60">
                    Vista previa del PDF
                  </p>
                </div>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#011c45] transition hover:bg-slate-100 sm:inline-flex"
                >
                  Pantalla completa
                </a>
              </div>

              <div className="h-[72vh] min-h-[520px] w-full bg-slate-100 sm:h-[78vh] lg:h-[86vh]">
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  title="Bases del concurso Foto con Papá"
                  className="h-full w-full border-0"
                />
              </div>
            </section>
          </div>

          {/* Botón extra solo para celular */}
          <div className="mt-4 block lg:hidden">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-xl bg-[#011c45] px-5 py-3 text-sm font-bold text-white shadow-sm"
            >
              Ver mejor en pantalla completa
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}