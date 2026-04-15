"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { BookOpen, Tv, Film } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <div className="p-8 mb-15 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-gradient animate-fadeIn">
          Bem-vindo ao Hub
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/livros"
            className="group p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-xl hover:from-zinc-800/90 hover:to-zinc-700/90 transition-all duration-500 border border-zinc-800/50 hover:border-zinc-700/70 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 animate-fadeIn"
          >
            <BookOpen
              size={40}
              className="text-amber-500 mb-4 group-hover:scale-110 group-hover:text-amber-400 transition-all duration-300 animate-float"
            />
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Livros
            </h2>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Gerencie sua biblioteca
            </p>
          </Link>

          <Link
            href="/series"
            className="group p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-xl hover:from-zinc-800/90 hover:to-zinc-700/90 transition-all duration-500 border border-zinc-800/50 hover:border-zinc-700/70 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 animate-fadeIn delay-75"
          >
            <Tv
              size={40}
              className="text-amber-500 mb-4 group-hover:scale-110 group-hover:text-amber-400 transition-all duration-300 animate-float delay-100"
            />
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Séries
            </h2>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Acompanhe seus favoritos
            </p>
          </Link>

          <Link
            href="/filmes"
            className="group p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-xl hover:from-zinc-800/90 hover:to-zinc-700/90 transition-all duration-500 border border-zinc-800/50 hover:border-zinc-700/70 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 animate-fadeIn delay-150"
          >
            <Film
              size={40}
              className="text-amber-500 mb-4 group-hover:scale-110 group-hover:text-amber-400 transition-all duration-300 animate-float delay-150"
            />
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Filmes
            </h2>
            <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Controle seus filmes
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
