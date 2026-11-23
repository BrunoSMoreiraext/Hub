"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Tv, BookOpen, Search, User, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const hrefBusca = pathname.startsWith("/filmes")
    ? "/busca?tipo=filmes"
    : pathname.startsWith("/series")
      ? "/busca?tipo=series"
      : pathname.startsWith("/livros")
        ? "/busca?tipo=livros"
        : "/busca";

  return (
    <header className="sticky top-0 w-full border-b border-zinc-800/50 bg-black/90 backdrop-blur-xl z-100 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Lado Esquerdo: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/30 animate-glow">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Bruno
            <span className="text-gradient animate-shimmer bg-clip-text text-transparent">
              Hub
            </span>
          </span>
        </Link>

        {/* Centro: Navegação Manual */}
        <nav className="flex hidden md:flex items-center gap-2">
          <Link
            href="/filmes"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105
              ${pathname === "/filmes" ? "text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20" : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50"}`}
          >
            <Film size={18} />
            <span className="hidden md:inline">Filmes</span>
          </Link>

          <Link
            href="/series"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105
              ${pathname === "/series" ? "text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20" : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50"}`}
          >
            <Tv size={18} />
            <span className="hidden md:inline">Séries</span>
          </Link>

          <Link
            href="/livros"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105
              ${pathname === "/livros" ? "text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20" : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50"}`}
          >
            <BookOpen size={18} />
            <span className="hidden md:inline">Livros</span>
          </Link>
        </nav>

        {/* Lado Direito: Busca e Perfil */}
        <div className="flex items-center gap-3">
          <Link
            href={hrefBusca}
            aria-label="Buscar na biblioteca"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50 rounded-full transition-all duration-300 hover:scale-110"
          >
            <Search size={20} />
          </Link>

          <div className="h-9 w-9 rounded-full">
            {/* Placeholder para imagem de perfil ou iniciais */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex md:hidden h-full w-full items-center justify-center text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors animate-pulse"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 h-screen w-screen bg-black z-100 items-center flex justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white rounded-full"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-10 mt-12 font-bold text-xl">
            <Link
              href="/filmes"
              className={
                "flex items-center px-4 rounded-lg font-medium transition-colors text-white"
              }
            >
              Filmes
            </Link>

            <Link
              href="/series"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${pathname === "/series" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
            >
              Series
            </Link>

            <Link
              href="/livros"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${pathname === "/livros" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
            >
              Livros
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
