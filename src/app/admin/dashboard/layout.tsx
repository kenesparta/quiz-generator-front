"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useLogout } from "@/hooks/admin/useLogout";
import { getRolFromJWT } from "@/utils/jwt";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
}

const ClipboardIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const UsersIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const LinkIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const PsychologistIcon = () => (
  <svg
    aria-hidden="true"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M17 20h5v-2a4 4 0 00-3-3.87" />
    <path d="M9 20H4v-2a4 4 0 013-3.87" />
    <circle cx="9" cy="7" r="4" />
    <circle cx="17" cy="7" r="4" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const navGroups: NavGroup[] = [
  {
    label: "GESTIÓN",
    items: [
      {
        id: "evaluacion",
        name: "Evaluación",
        href: "/admin/dashboard/evaluacion",
        icon: <ClipboardIcon />,
      },
      {
        id: "examen",
        name: "Examen",
        href: "/admin/dashboard/examen",
        icon: <DocumentIcon />,
      },
      {
        id: "postulante",
        name: "Postulante",
        href: "/admin/dashboard/postulante",
        icon: <UsersIcon />,
      },
      {
        id: "asignaciones",
        name: "Asignaciones",
        href: "/admin/dashboard/asignaciones",
        icon: <LinkIcon />,
      },
    ],
  },
  {
    label: "REVISIÓN",
    items: [
      {
        id: "revision",
        name: "Revisión",
        href: "/admin/dashboard/revision",
        icon: <CheckCircleIcon />,
      },
    ],
  },
  {
    label: "USUARIOS",
    adminOnly: true,
    items: [
      {
        id: "psicologo",
        name: "Psicólogo",
        href: "/admin/dashboard/psicologo",
        icon: <PsychologistIcon />,
        adminOnly: true,
      },
    ],
  },
];

const labelMap: Record<string, string> = {
  evaluacion: "Evaluación",
  examen: "Examen",
  postulante: "Postulante",
  asignaciones: "Asignaciones",
  revision: "Revisión",
  psicologo: "Psicólogo",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname
    .replace("/admin/dashboard", "")
    .split("/")
    .filter(Boolean);

  const crumbs: { label: string; href?: string }[] = [
    { label: "Dashboard", href: "/admin/dashboard" },
  ];

  for (const seg of segments) {
    const label = labelMap[seg];
    if (label) {
      crumbs.push({ label, href: `/admin/dashboard/${seg}` });
    }
  }

  return crumbs;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [rol, setRol] = useState<string | null>(null);
  const { logout, isLoggingOut } = useLogout();

  useEffect(() => {
    setRol(getRolFromJWT(localStorage.getItem("token")));
  }, []);

  const isAdmin = rol === "admin";
  const visibleGroups = navGroups
    .filter((g) => !g.adminOnly || isAdmin)
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => !i.adminOnly || isAdmin),
    }))
    .filter((g) => g.items.length > 0);

  const isActive = (href: string) => {
    if (
      href === "/admin/dashboard/evaluacion" &&
      pathname === "/admin/dashboard"
    ) {
      return true;
    }
    return href !== "#" && pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-(--page-bg)">
      {/* Sidebar */}
      <aside className="w-64 bg-(--sidebar-bg) fixed h-full flex flex-col z-20">
        {/* Brand */}
        <div className="flex items-center gap-3 h-16 px-6 border-b border-white/10">
          <Image
            src="/img/logo.jpeg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-white font-semibold text-lg">Quiz Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mb-2">
              <div className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white/35">
                {group.label}
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors duration-200 ${
                    isActive(item.href)
                      ? "bg-(--sidebar-active-bg) text-white font-medium"
                      : "text-white/65 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/25">Quiz Generator v1.0</p>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-(--border-color-light) flex items-center justify-between px-6 z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-(--text-tertiary)">
                  <ChevronIcon />
                </span>
              )}
              {crumb.href && index < breadcrumbs.length - 1 ? (
                <Link
                  href={crumb.href}
                  className="text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-(--text-primary) font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Avatar + Logout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-(--sidebar-active-bg) flex items-center justify-center text-white text-sm font-medium">
            {rol ? rol.charAt(0).toUpperCase() : "A"}
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            disabled={isLoggingOut}
            title="Cerrar sesión"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-(--border-color) ${
              isLoggingOut
                ? "bg-(--neutral-100) text-(--text-tertiary) cursor-not-allowed"
                : "text-(--text-primary) hover:bg-(--table-header-bg) cursor-pointer"
            }`}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>{isLoggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 ml-64 mt-16 overflow-y-auto min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
