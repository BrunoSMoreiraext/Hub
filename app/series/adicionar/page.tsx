"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { buscarCategorias } from "@/lib/categorias";

type SeriesAPI = {
  id: string;
  titulo: string;
  imagem: string;
};

export default function AdicionarPage() {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState<SeriesAPI[]>([]);
  const [erro, setErro] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const router = useRouter();

  // Função que busca as séries no nosso endpoint e salva elas no useState
  async function buscarSeries() {
    if (!busca.trim()) return;

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(
        `/api/tmdb?tipo=serie&q=${encodeURIComponent(busca)}`,
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível buscar as séries.");
        setResultados([]);
        return;
      }

      const series = (dados.items ?? []).map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        imagem: item.imagem,
      }));

      setResultados(series);
    } catch {
      setErro("Falha de conexão. Verifique sua internet e tente novamente.");
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  }

  // Função para adicionar series ao banco de dados

  async function adicionarSerie(serie: SeriesAPI) {
    if (adicionando) return;
    setAdicionando(true);

    try {
      const categorias = await buscarCategorias("serie", serie.id);

      await addDoc(collection(db, "series"), {
        apiId: serie.id,
        titulo: serie.titulo,
        resumo: "",
        dataInicio: "",
        nota: 0,
        status: "Não iniciado",
        imagem: serie.imagem,
        ...(categorias ? { categorias } : {}),
      });

      alert("Serie adicionada com sucesso!");
      router.push("/series");
    } finally {
      setAdicionando(false);
    }
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
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarSeries()}
            placeholder="Digite o nome da serie..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
          />
          <button
            onClick={buscarSeries}
            disabled={carregando}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>

        {/* Estado de carregando */}
        {carregando && (
          <p className="text-zinc-500 text-center">Buscando Series...</p>
        )}

        {/* Mensagem de erro */}
        {erro && (
          <p className="text-red-400 text-center mb-6" role="alert">
            {erro}
          </p>
        )}

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resultados.map((serie) => (
            <div
              key={serie.id}
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 hover:border-amber-500/50 bg-zinc-900 p-4 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <img
                src={serie.imagem}
                alt={serie.titulo}
                className="w-full aspect-[2/3] object-cover rounded-xl"
              />
              <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
                {serie.titulo}
              </p>
              <button
                onClick={() => adicionarSerie(serie)}
                disabled={adicionando}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-amber-600 text-zinc-400 hover:text-white text-xs font-semibold py-2 rounded-lg transition-all"
              >
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
