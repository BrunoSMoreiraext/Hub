"use client";

import CardItem from "@/components/CardItem";
import FiltroCategorias from "@/components/FiltroCategorias";
import Header from "@/components/Header";
import Recomendacoes from "@/components/Recomendacoes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observarColecao } from "@/lib/colecoes";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/AuthContext";



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
  const { user, carregando } = useRequireAuth();

  useEffect(() => {
    if (carregando || !user) return;

    const cancelarEscuta = observarColecao<Serie>(
      user.uid,
      "series",
      (seriesAtualizadas) => {
        setSeries(seriesAtualizadas);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return cancelarEscuta;
  }, [user, carregando]);

  if (carregando || loading || !user)
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
        Carregando...
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

        <Recomendacoes tipo="serie" userId={user.uid} itens={series} />

        <button
          onClick={() => router.push("/series/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 hover:scale-105 animate-float group"
        >
          <span className="text-xl animate-pulse">+</span>
        </button>
      </div>
    </>
  );
}