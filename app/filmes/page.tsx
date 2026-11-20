"use client";

import CardItem from "@/components/CardItem";
import Header from "@/components/Header";
import Recomendacoes from "@/components/Recomendacoes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observarColecao } from "@/lib/colecoes";
import { useRouter } from "next/navigation";

type Filmes = {
  id: string;
  apiId?: string | number;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  status: string;
  imagem: string;
};

export default function Home() {
  const [filmes, setFilmes] = useState<Filmes[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fica escutando a coleção "filmes": qualquer adição, edição ou exclusão
  // atualiza a tela sem precisar recarregar a página.
  useEffect(() => {
    const cancelarEscuta = observarColecao<Filmes>(
      "filmes",
      (filmesAtualizados) => {
        setFilmes(filmesAtualizados);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return cancelarEscuta;
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
        Carregando...
      </div>
    );

  return (
    <>
      <Header />
      <div className="p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-white">Meus Filmes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filmes.map((filmes) => (
            <Link key={filmes.id} href={`/filmes/${filmes.id}`}>
              <CardItem
                key={filmes.id}
                title={filmes.titulo}
                imageUrl={filmes.imagem}
                startDate={filmes.dataInicio}
                rating={filmes.nota}
                type="filmes"
                status={filmes.status}
              />
            </Link>
          ))}
        </div>
        <Recomendacoes tipo="filme" itens={filmes} />
        <button
          onClick={() => router.push("filmes/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-6 py-4 rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </>
  );
}
