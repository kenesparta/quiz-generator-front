import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-(--page-bg) flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative road background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <title>Carretera decorativa</title>
          <path
            d="M0 500 Q 200 450 400 500 T 800 500"
            stroke="currentColor"
            strokeWidth="80"
            fill="none"
            className="text-(--primary)"
          />
          <path
            d="M0 500 Q 200 450 400 500 T 800 500"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="20 20"
            fill="none"
          />
        </svg>
      </div>

      <main className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/img/logo.jpeg"
            alt="Policlínico WARI"
            width={180}
            height={180}
            priority
            className="rounded-2xl shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-(--text-primary) leading-tight mb-2">
          Evaluaciones para
        </h1>
        <h2 className="text-3xl lg:text-4xl font-bold text-(--primary) leading-tight mb-10">
          Examen de Conducir
        </h2>

        {/* Driving icons row */}
        <div
          aria-hidden="true"
          className="flex items-center gap-6 mb-10 text-(--primary)/70"
        >
          {/* Steering wheel */}
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <title>Volante</title>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M12 14.5V21" />
            <path d="M9.8 10.8L4 7" />
            <path d="M14.2 10.8L20 7" />
          </svg>

          {/* Traffic light */}
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <title>Semáforo</title>
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <circle cx="12" cy="7" r="1.2" />
            <circle cx="12" cy="12" r="1.2" />
            <circle cx="12" cy="17" r="1.2" />
          </svg>

          {/* Car */}
          <svg
            className="w-9 h-9"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <title>Automóvil</title>
            <path d="M3 13l2-5a2 2 0 012-1.5h10A2 2 0 0119 8l2 5" />
            <path d="M3 13h18v4a1 1 0 01-1 1h-2v-2H6v2H4a1 1 0 01-1-1v-4z" />
            <circle cx="7.5" cy="16" r="1.5" />
            <circle cx="16.5" cy="16" r="1.5" />
          </svg>

          {/* Road sign */}
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <title>Señal de tránsito</title>
            <path d="M12 2l9 9-9 9-9-9 9-9z" />
            <path d="M12 8v4" />
            <circle cx="12" cy="15.5" r="0.6" fill="currentColor" />
          </svg>
        </div>

        {/* Access buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex justify-center items-center px-6 py-3.5 text-sm font-medium rounded-md text-white bg-(--primary) hover:bg-(--primary-dark) transition-colors shadow-sm"
          >
            Iniciar Evaluación
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
            className="inline-flex justify-center items-center px-6 py-3.5 text-sm font-medium rounded-md text-(--text-primary) bg-white border border-(--border-color) hover:border-(--primary) hover:text-(--primary) transition-colors shadow-sm"
          >
            Administrador
          </Link>
        </div>
      </main>
    </div>
  );
}
