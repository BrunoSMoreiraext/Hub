"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { observarColecao } from "@/lib/colecoes";
import { Search, ChevronLeft, ArrowRight, X } from "lucide-react";

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
  href: string;
};

export default function BuscarBibliotecaPage() {
  const [busca, setBusca] = useState("");
  const [termoAplicado, setTermoAplicado] = useState("");

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);

  const [carregandoFilmes, setCarregandoFilmes] = useState(true);
  const [carregandoLivros, setCarregandoLivros] = useState(true);
  const [carregandoSeries, setCarregandoSeries] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const cancelarFilmes = observarColecao<Filme>(
      "filmes",
      (dados) => {
        setFilmes(dados);
        setCarregandoFilmes(false);
      },
      () => setCarregandoFilmes(false),
    );

    const cancelarLivros = observarColecao<Livro>(
      "livros",
      (dados) => {
        setLivros(dados);
        setCarregandoLivros(false);
      },
      () => setCarregandoLivros(false),
    );

    const cancelarSeries = observarColecao<Serie>(
      "series",
      (dados) => {
        setSeries(dados);
        setCarregandoSeries(false);
      },
      () => setCarregandoSeries(false),
    );

    return () => {
      cancelarFilmes();
      cancelarLivros();
      cancelarSeries();
    };
  }, []);

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

    const filmesFiltrados: ObraResultado[] = filmes
      .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
      .map((filme) => ({
        id: filme.id,
        titulo: filme.titulo,
        imagem: filme.imagem,
        tipo: "filme",
        labelTipo: "Filme",
        href: `/filmes/${filme.id}`,
      }));

    const seriesFiltradas: ObraResultado[] = series
      .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
      .map((serie) => ({
        id: serie.id,
        titulo: serie.titulo,
        imagem: serie.imagem,
        tipo: "serie",
        labelTipo: "Série",
        href: `/series/${serie.id}`,
      }));

    const livrosFiltrados: ObraResultado[] = livros
      .filter((obra) => obra.titulo?.toLowerCase().includes(termo))
      .map((livro) => ({
        id: livro.id,
        titulo: livro.titulo,
        imagem:
          livro.imagem ??
          `https://books.google.com/books/content?id=${livro.apiId}&printsec=frontcover&img=1&zoom=4`,
        tipo: "livro",
        labelTipo: "Livro",
        href: `/livros/${livro.id}`,
      }));

    return [...filmesFiltrados, ...seriesFiltradas, ...livrosFiltrados];
  }, [termoAplicado, filmes, series, livros]);

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

        <h1 className="text-3xl font-bold mb-8 text-white">
          Buscar na Biblioteca
        </h1>

        {/* Campo de busca */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarNaBiblioteca()}
              placeholder="Digite o título de um filme, série ou livro..."
              autoFocus
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
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
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            Nenhuma obra encontrada para "{termoAplicado}".
          </p>
        )}

        {/* Resultados */}
        {!carregando && resultados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resultados.map((obra) => (
              <Link
                key={`${obra.tipo}-${obra.id}`}
                href={obra.href}
                className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-800 hover:border-amber-500/50 bg-zinc-900 p-4 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="absolute top-6 left-6 z-10 rounded-md bg-black/80 border border-amber-500/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur-sm">
                  {obra.labelTipo}
                </span>

                <img
                  src={obra.imagem}
                  alt={obra.titulo}
                  className="w-full aspect-[2/3] object-cover rounded-xl"
                />

                <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
                  {obra.titulo}
                </p>

                <span className="mt-auto flex items-center justify-center gap-2 bg-zinc-800 group-hover:bg-amber-600 text-zinc-400 group-hover:text-white text-xs font-semibold py-2 rounded-lg transition-all">
                  Ver detalhes
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}