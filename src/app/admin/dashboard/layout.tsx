"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const sections = [
    {
      id: "evaluacion",
      name: "Evaluación",
      href: "/admin/dashboard/evaluacion",
    },
    { id: "examen", name: "Examen", href: "/admin/dashboard/examen" },
    {
      id: "postulante",
      name: "Postulante",
      href: "/admin/dashboard/postulante",
    },
    { id: "revision", name: "Revision", href: "/admin/dashboard/revision" },
  ];

  const isActive = (href: string) => {
    if (
      href === "/admin/dashboard/evaluacion" &&
      pathname === "/admin/dashboard"
    ) {
      return true;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-6 bg-blue-600">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  isActive(section.href)
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="text-sm">{section.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto">{children}</div>
    </div>
  );
}
