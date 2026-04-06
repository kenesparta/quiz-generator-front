"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
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

const GearIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
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
    label: "CONFIGURACIÓN",
    items: [
      {
        id: "ajustes",
        name: "Ajustes",
        href: "#",
        icon: <GearIcon />,
      },
    ],
  },
];

const labelMap: Record<string, string> = {
  evaluacion: "Evaluación",
  examen: "Examen",
  postulante: "Postulante",
  revision: "Revisión",
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
          <div className="w-8 h-8 rounded-lg bg-(--sidebar-active-bg) flex items-center justify-center">
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
          <span className="text-white font-semibold text-lg">Quiz Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group) => (
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

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-(--sidebar-active-bg) flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 ml-64 mt-16 overflow-y-auto min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
