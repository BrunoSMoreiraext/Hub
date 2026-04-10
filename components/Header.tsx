"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Tv, BookOpen, Search, User } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Lado Esquerdo: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white transition-transform group-hover:scale-105">
            B
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Bruno<span className="text-indigo-500">Hub</span>
          </span>
        </Link>

        {/* Centro: Navegação Manual */}
        <nav className="flex hidden md:flex items-center gap-2">
          <Link
            href="/filmes"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/filmes" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
          >
            <Film size={18} />
            <span className="hidden md:inline">Filmes</span>
          </Link>

          <Link
            href="/series"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/series" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
          >
            <Tv size={18} />
            <span className="hidden md:inline">Séries</span>
          </Link>

          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${pathname === "/livros" ? "text-white bg-zinc-800" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"}`}
          >
            <BookOpen size={18} />
            <span className="hidden md:inline">Livros</span>
          </Link>
        </nav>

        {/* Lado Direito: Busca e Perfil */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors">
            <Search size={20} />
          </button>

          <div className="h-9 w-9 rounded-full border-2 border-indigo-500/30 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
            {/* Placeholder para imagem de perfil ou iniciais */}
            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-indigo-400">
              BR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
