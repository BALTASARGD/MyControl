"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton(): JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Mostrar en todas las rutas (incluida la raíz) según petición del usuario
  // pathname puede ser undefined en SSR; solo en cliente estará definido.
  const isRoot = pathname === "/";

  // DEBUG_ONLY: toggle visual debug helpers to confirm renderizado
  const DEBUG = false; // cambiar a true para activar marca de depuración

  // Cambia aquí para reposicionar el botón: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  const POSITION: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'bottom-left';

  const positionClass = {
    'top-left': 'left-4 top-4',
    'top-right': 'right-4 top-4',
    // dejar más separación en bottom-left para no solaparse con el indicador de Next.js
    'bottom-left': 'left-4 bottom-16',
    'bottom-right': 'right-4 bottom-4',
  }[POSITION];

  return (
    <div className={`fixed ${positionClass} flex items-end`}>
      <button
        onClick={handleBack}
        aria-label="Volver"
        title="Volver"
  className={`z-[99999] inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/95 dark:bg-slate-900/85 text-slate-900 dark:text-slate-50 shadow-lg opacity-95 hover:opacity-100 transition backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
      >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      </button>
      {DEBUG && (
        <div className="ml-2 mb-1 text-xs font-medium text-red-600 dark:text-red-400">Back</div>
      )}
    </div>
  );
}
