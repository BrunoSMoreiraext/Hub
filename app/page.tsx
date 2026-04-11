"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { BookOpen, Tv, Film } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <div className="p-8 mb-15 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-white">Bem-vindo ao Hub</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/livros" className="group p-8 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition border border-zinc-800 hover:border-indigo-500">
            <BookOpen size={40} className="text-indigo-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold text-white mb-2">Livros</h2>
            <p className="text-zinc-400">Gerencie sua biblioteca</p>
          </Link>
          
          <Link href="/series" className="group p-8 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition border border-zinc-800 hover:border-indigo-500">
            <Tv size={40} className="text-indigo-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold text-white mb-2">Séries</h2>
            <p className="text-zinc-400">Acompanhe seus favoritos</p>
          </Link>
          
          <Link href="/filmes" className="group p-8 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition border border-zinc-800 hover:border-indigo-500">
            <Film size={40} className="text-indigo-500 mb-4 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold text-white mb-2">Filmes</h2>
            <p className="text-zinc-400">Controle seus filmes</p>
          </Link>
        </div>
      </div>
    </>
  );
}