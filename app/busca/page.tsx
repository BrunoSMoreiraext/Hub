"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { observarColecao } from "@/lib/colecoes";
import { Search, ChevronLeft, X } from "lucide-react";
import CardItem from "@/components/CardItem";

type TipoBusca = "todos" | "filmes" | "series" | "livros";

type Filme = {
  id: string;
  apiId?: string | number;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  status: string;
  imagem: string;
};

type Livro = {
  id: string;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  apiId: string;
  status: string;
  imagem?: string;
};

type Serie = {
  id: string;
  apiId?: string | number;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  status: string;
  imagem: string;
};

type ObraResultado = {
  id: string;
  titulo: string;
  imagem: string;
  tipo: "filme" | "serie" | "livro";
  labelTipo: "Filme" | "Série" | "Livro";
  cardType: "filmes" | "series" | "livro";
  href: string;
  dataInicio: string;
  nota: number;
  status: string;
};

const CONFIG_BUSCA: Record<
  TipoBusca,
  { titulo: string; placeholder: string; vazio: string }
> = {
  todos: {
    titulo: "Buscar na Biblioteca",
    placeholder: "Digite o título de um filme, série ou livro...",
    vazio: "Nenhuma obra encontrada",
  },
  filmes: {
    titulo: "Buscar nos Meus Filmes",
    placeholder: "Digite o título de um filme da sua biblioteca...",
    vazio: "Nenhum filme encontrado",
  },
  series: {
    titulo: "Buscar nas Minhas Séries",
    placeholder: "Digite o título de uma série da sua biblioteca...",
    vazio: "Nenhuma série encontrada",
  },
  livros: {
    titulo: "Buscar nos Meus Livros",
    placeholder: "Digite o título de um livro da sua biblioteca...",
    vazio: "Nenhum livro encontrado",
  },
};

function ConteudoBusca({ tipoFiltro }: { tipoFiltro: TipoBusca }) {
  const deveBuscarFilmes = tipoFiltro === "todos" || tipoFiltro === "filmes";
  const deveBuscarSeries = tipoFiltro === "todos" || tipoFiltro === "series";
  const deveBuscarLivros = tipoFiltro === "todos" || tipoFiltro === "livros";

  const [busca, setBusca] = useState("");
  const [termoAplicado, setTermoAplicado] = useState("");

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);

  const [carregandoFilmes, setCarregandoFilmes] = useState(deveBuscarFilmes);
  const [carregandoLivros, setCarregandoLivros] = useState(deveBuscarLivros);
  const [carregandoSeries, setCarregandoSeries] = useState(deveBuscarSeries);

  const router = useRouter();
  const config = CONFIG_BUSCA[tipoFiltro];

  useEffect(() => {
    const canceladores: (() => void)[] = [];

    if (deveBuscarFilmes) {
      canceladores.push(
        observarColecao<Filme>(
          "filmes",
          (dados) => {
            setFilmes(dados);
            setCarregandoFilmes(false);
          },
          () => setCarregandoFilmes(false),
        ),
      );
    }

    if (deveBuscarLivros) {
      canceladores.push(
        observarColecao<Livro>(
          "livros",
          (dados) => {
            setLivros(dados);
            setCarregandoLivros(false);
          },
          () => setCarregandoLivros(false),
        ),
      );
    }

    if (deveBuscarSeries) {
      canceladores.push(
        observarColecao<Serie>(
          "series",
          (dados) => {
            setSeries(dados);
            setCarregandoSeries(false);
          },
          () => setCarregandoSeries(false),
        ),
      );
    }

    return () => {
      canceladores.forEach((cancelar) => cancelar());
    };
  }, [deveBuscarFilmes, deveBuscarLivros, deveBuscarSeries]);

  const carregando = carregandoFilmes || carregandoLivros || carregandoSeries;

  function buscarNaBiblioteca() {
    setTermoAplicado(busca.trim());
  }

  function limparBusca() {
    setBusca("");
    setTermoAplicado("");
  }

  const resultados = useMemo<ObraResultado[]>(() => {
    const termo = termoAplicado.toLowerCase();
    if (!termo) return [];

    const filmesFiltrados: ObraResultado[] = deveBuscarFilmes
    ? filmes
        .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
        .map((filme) => ({
            id: filme.id,
            titulo: filme.titulo,
            imagem: filme.imagem,
            tipo: "filme",
            labelTipo: "Filme",
            cardType: "filmes",
            href: `/filmes/${filme.id}`,
            dataInicio: filme.dataInicio,
            nota: filme.nota,
            status: filme.status,
        }))
    : [];

    const seriesFiltradas: ObraResultado[] = deveBuscarSeries
    ? series
        .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
        .map((serie) => ({
            id: serie.id,
            titulo: serie.titulo,
            imagem: serie.imagem,
            tipo: "serie",
            labelTipo: "Série",
            cardType: "series",
            href: `/series/${serie.id}`,
            dataInicio: serie.dataInicio,
            nota: serie.nota,
            status: serie.status,
        }))
    : [];

    const livrosFiltrados: ObraResultado[] = deveBuscarLivros
    ? livros
        .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
        .map((livro) => ({
            id: livro.id,
            titulo: livro.titulo,
            imagem:
            livro.imagem ??
            `https://books.google.com/books/content?id=${livro.apiId}&printsec=frontcover&img=1&zoom=4`,
            tipo: "livro",
            labelTipo: "Livro",
            cardType: "livro",
            href: `/livros/${livro.id}`,
            dataInicio: livro.dataInicio,
            nota: livro.nota,
            status: livro.status,
        }))
    : [];

    return [...filmesFiltrados, ...seriesFiltradas, ...livrosFiltrados];
  }, [
    termoAplicado,
    deveBuscarFilmes,
    deveBuscarSeries,
    deveBuscarLivros,
    filmes,
    series,
    livros,
  ]);

  return (
    <>
      <Header />
      <div className="w-full p-8 max-w-4xl mx-auto">
        {/* Botão voltar e título */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Voltar</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 text-white">{config.titulo}</h1>

        {/* Campo de busca */}
        <div className="w-full flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1 min-w-0 flex items-center">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarNaBiblioteca()}
              placeholder={config.placeholder}
              autoFocus
              className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors ${
                busca ? "pr-10" : "pr-4"
              }`}
            />
            {busca && (
              <button
                type="button"
                onClick={limparBusca}
                aria-label="Limpar busca"
                className="absolute right-3 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={buscarNaBiblioteca}
            disabled={carregando}
            className="shrink-0 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>

        {/* Estado de carregando */}
        {carregando && (
          <p className="text-zinc-500 text-center">
            Carregando sua biblioteca...
          </p>
        )}

        {/* Estado: busca realizada sem resultados */}
        {!carregando && termoAplicado && resultados.length === 0 && (
          <p className="text-zinc-400 text-center">
            {config.vazio} para "{termoAplicado}".
          </p>
        )}

        {/* Resultados */}
        {!carregando && resultados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultados.map((obra) => (
            <Link
                key={`${obra.tipo}-${obra.id}`}
                href={obra.href}
            >  
                <CardItem
                title={obra.titulo}
                imageUrl={obra.imagem}
                startDate={obra.dataInicio}
                rating={obra.nota}
                type={obra.cardType}
                status={obra.status}
                typeLabel={tipoFiltro === "todos" ? obra.labelTipo : undefined}
                />
            </Link>
            ))}
        </div>
        )}
      </div>
    </>
  );
}

function BuscaComParametros() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo");

  const tipoFiltro: TipoBusca =
    tipoParam === "filmes" || tipoParam === "series" || tipoParam === "livros"
      ? tipoParam
      : "todos";

  return <ConteudoBusca key={tipoFiltro} tipoFiltro={tipoFiltro} />;
}

export default function BuscarBibliotecaPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
          Carregando busca...
        </div>
      }
    >
      <BuscaComParametros />
    </Suspense>
  );
}