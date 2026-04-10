"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import { Search, Plus, ChevronLeft } from "lucide-react";

type SeriesAPI = {
  id: string;
  titulo: string;
  imagem: string;
};

export default function AdicionarPage() {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState<SeriesAPI[]>([]);
  const router = useRouter();

  // Função que busca os series na API e salva eles no useState
  async function buscarSeries() {
    if (!busca.trim()) return;
    setCarregando(true);

    const respostaAPI = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(busca)}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`,
    );
    const dadosAPI = await respostaAPI.json();
    

    const series = dadosAPI.results.map((item: any) => ({
      id: item.id,
      titulo: item.name,
      imagem: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : "https://placehold.co/300x450",
    }));
    setResultados(series);
    setCarregando(false);
  }

  // Função para adicionar series ao banco de dados

  async function adicionarSerie(serie: SeriesAPI) {
    await addDoc(collection(db, "series"), {
      apiId: serie.id,
      titulo: serie.titulo,
      resumo: "",
      dataInicio: "",
      nota: 0,
      status: "Não iniciado",
      imagem: serie.imagem,
    });

    alert("Serie adicionada com sucesso!");
    router.push("/series");
  }
  return (
    <>
      <Header />
      <div className="p-8 max-w-4xl mx-auto">
        {/* Botão voltar e título */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold mb-8 text-white">Adicionar Serie</h1>

        {/* Campo de busca */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarSeries()}
            placeholder="Digite o nome da serie..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={buscarSeries}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>

        {/* Estado de carregando */}
        {carregando && (
          <p className="text-zinc-500 text-center">Buscando Series...</p>
        )}

        {/* Resultados */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {resultados.map((serie) => (
            <div
              key={serie.id}
              onClick={() => adicionarSerie(serie)}
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 hover:border-indigo-500/50 bg-zinc-900 p-4 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <img
                src={serie.imagem}
                alt={serie.titulo}
                className="w-full aspect-[2/3] object-cover rounded-xl"
              />
              <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {serie.titulo}
              </p>
              <button onClick ={() => adicionarSerie(serie)} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white text-xs font-semibold py-2 rounded-lg transition-all">
                <Plus size={14} />
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
