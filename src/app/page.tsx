import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-(--page-bg)">
      {/* Header */}
      <header className="bg-(--sidebar-bg) border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--primary) flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12l-2 2 4-4"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">
              Quiz Generator
            </span>
          </div>
          <Link
            href="/admin/login"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Administrador
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <section className="py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-(--text-primary) leading-tight">
              Plataforma de
              <br />
              <span className="text-(--primary)">Evaluaciones en Linea</span>
            </h1>
            <p className="mt-5 text-lg text-(--text-secondary) max-w-lg mx-auto lg:mx-0">
              Accede a tus evaluaciones asignadas, completa los cuestionarios y
              obtiene resultados de forma rapida y segura.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex justify-center items-center px-6 py-3 text-sm font-medium rounded-md text-white bg-(--primary) hover:bg-(--primary-dark) transition-colors shadow-sm"
              >
                Iniciar Evaluacion
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex justify-center items-center px-6 py-3 text-sm font-medium rounded-md text-(--text-primary) bg-white border border-(--border-color) hover:border-(--primary) hover:text-(--primary) transition-colors shadow-sm"
              >
                Panel de Administracion
              </Link>
            </div>
          </div>

          {/* Decorative illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-(--primary)/5" />
              <div className="absolute inset-6 rounded-full bg-(--primary)/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg border border-(--border-color-light) p-6 w-56 lg:w-64 space-y-4">
                  {/* Mini quiz card preview */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-(--primary)/10 flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-(--primary)"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-(--text-primary)">
                        Evaluacion Tecnica
                      </div>
                      <div className="text-[10px] text-(--text-tertiary)">
                        15 preguntas
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-(--primary) flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-(--primary)" />
                      </div>
                      <div className="h-2 bg-(--border-color-light) rounded flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-(--border-color)" />
                      <div className="h-2 bg-(--border-color-light) rounded w-3/4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-(--border-color)" />
                      <div className="h-2 bg-(--border-color-light) rounded w-5/6" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="w-full h-1.5 bg-(--border-color-light) rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-(--primary) rounded-full" />
                    </div>
                    <div className="text-[10px] text-(--text-tertiary) mt-1">
                      67% completado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-(--border-color-light) p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="w-10 h-10 rounded-lg bg-(--primary)/10 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-(--primary)"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-(--text-primary) mb-1">
              Acceso Seguro
            </h3>
            <p className="text-sm text-(--text-secondary)">
              Autenticacion protegida para garantizar la integridad de cada
              evaluacion.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-(--border-color-light) p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="w-10 h-10 rounded-lg bg-(--success-light) flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-(--success)"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-(--text-primary) mb-1">
              Guardado Automatico
            </h3>
            <p className="text-sm text-(--text-secondary)">
              Tus respuestas se guardan automaticamente mientras avanzas en el
              cuestionario.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-(--border-color-light) p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
            <div className="w-10 h-10 rounded-lg bg-(--warning-light) flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-(--warning)"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-(--text-primary) mb-1">
              Control de Tiempo
            </h3>
            <p className="text-sm text-(--text-secondary)">
              Cronometro integrado para gestionar el tiempo disponible durante
              la evaluacion.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-(--border-color-light) bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-(--text-tertiary)">
            Quiz Generator &mdash; Plataforma de Evaluaciones
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="text-xs text-(--text-tertiary) hover:text-(--primary) transition-colors"
            >
              Postulante
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-(--text-tertiary) hover:text-(--primary) transition-colors"
            >
              Administrador
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
