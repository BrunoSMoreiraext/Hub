"use client";

import CardItem from "@/components/CardItem";
import FiltroCategorias from "@/components/FiltroCategorias";
import Header from "@/components/Header";
import Recomendacoes from "@/components/Recomendacoes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observarColecao } from "@/lib/colecoes";
import { useRouter } from "next/navigation";


type Serie = {
  id: string;
  apiId?: string | number;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  status: string;
  imagem: string;
  categorias?: string[];
};

export default function Home() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const router = useRouter();

  // Fica escutando a coleção "series": qualquer adição, edição ou exclusão
  // atualiza a tela sem precisar recarregar a página.
  useEffect(() => {
    const cancelarEscuta = observarColecao<Serie>(
      "series",
      (seriesAtualizadas) => {
        setSeries(seriesAtualizadas);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return cancelarEscuta;
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-transparent border-r-transparent animate-spin rounded-full"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-amber-500/60 border-t-transparent border-r-transparent animate-spin rounded-full"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="absolute inset-2 w-12 h-12 border-4 border-amber-400/80 border-t-transparent border-r-transparent animate-spin rounded-full"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>
          <p className="text-amber-400 font-medium animate-pulse">
            Carregando séries...
          </p>
        </div>
      </div>
    );

  const categoriasDisponiveis = Array.from(
    new Set(series.flatMap((serie) => serie.categorias ?? [])),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const seriesFiltradas =
    categoriaFiltro === "Todas"
      ? series
      : series.filter((serie) => serie.categorias?.includes(categoriaFiltro));

  return (
    <>
      <Header />
      <div className="p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-white">Minhas Séries</h1>

        <FiltroCategorias
          categorias={categoriasDisponiveis}
          selecionada={categoriaFiltro}
          onChange={setCategoriaFiltro}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {seriesFiltradas.map((serie) => (
            <Link key={serie.id} href={`/series/${serie.id}`}>
              <CardItem
                title={serie.titulo}
                imageUrl={serie.imagem}
                startDate={serie.dataInicio}
                rating={serie.nota}
                type="series"
                status={serie.status}
              />
            </Link>
          ))}
        </div>

        {seriesFiltradas.length === 0 && (
          <p className="text-zinc-500">Nenhuma série nessa categoria.</p>
        )}

        <Recomendacoes tipo="serie" itens={series} />

        <button
          onClick={() => router.push("series/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 hover:scale-105 animate-float group"
        >
          <span className="text-xl animate-pulse">+</span>
        </button>
      </div>
    </>
  );
}