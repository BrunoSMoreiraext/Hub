"use client";

import CardItem from "@/components/CardItem";
import Header from "@/components/Header";
import Recomendacoes from "@/components/Recomendacoes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observarColecao } from "@/lib/colecoes";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/AuthContext";
import FiltroCategorias from "@/components/FiltroCategorias";

type Filmes = {
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

export default function FilmesPage() {
  const [filmes, setFilmes] = useState<Filmes[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const router = useRouter();
  const { user, carregando } = useRequireAuth();

  useEffect(() => {
    if (carregando || !user) return;

    const cancelarEscuta = observarColecao<Filmes>(
      user.uid,
      "filmes",
      (filmesAtualizados) => {
        setFilmes(filmesAtualizados);
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
    new Set(filmes.flatMap((filme) => filme.categorias ?? [])),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const filmesFiltrados =
    categoriaFiltro === "Todas"
      ? filmes
      : filmes.filter((filme) => filme.categorias?.includes(categoriaFiltro));
  return (
    <>
      <Header />
      <div className="p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-white">Meus Filmes</h1>
        <FiltroCategorias
          categorias={categoriasDisponiveis}
          selecionada={categoriaFiltro}
          onChange={setCategoriaFiltro}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filmesFiltrados.map((filme) => (
            <Link key={filme.id} href={`/filmes/${filme.id}`}>
              <CardItem
                key={filme.id}
                title={filme.titulo}
                imageUrl={filme.imagem}
                startDate={filme.dataInicio}
                rating={filme.nota}
                type="filmes"
                status={filme.status}
              />
            </Link>
          ))}
        </div>
        <Recomendacoes tipo="filme" userId={user.uid} itens={filmes} />
        <button
          onClick={() => router.push("/filmes/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-6 py-4 rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </>
  );
}