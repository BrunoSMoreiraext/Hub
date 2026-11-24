"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import { Search, Plus, ChevronLeft } from "lucide-react";
import { useRequireAuth } from "@/lib/AuthContext";

type FilmesAPI = {
  id: string;
  titulo: string;
  imagem: string;
};

export default function AdicionarPage() {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState<FilmesAPI[]>([]);
  const [erro, setErro] = useState("");
  const router = useRouter();
  const { user, carregando: authCarregando } = useRequireAuth();

  async function buscarFilmes() {
    if (!busca.trim()) return;
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(
        `/api/tmdb?tipo=filme&q=${encodeURIComponent(busca)}`,
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível buscar os filmes.");
        setResultados([]);
        return;
      }

      const filmes = (dados.items ?? []).map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        imagem: item.imagem,
      }));

      setResultados(filmes);
    } catch {
      setErro("Falha de conexão. Verifique sua internet e tente novamente.");
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  }

  async function adicionarFilme(filme: FilmesAPI) {
    if (!user) return;

    try {
      await addDoc(collection(db, "usuarios", user.uid, "filmes"), {
        apiId: filme.id,
        titulo: filme.titulo,
        resumo: "",
        dataInicio: "",
        nota: 0,
        status: "Não iniciado",
        imagem: filme.imagem,
      });

      alert("Filme adicionado com sucesso!");
      router.push("/filmes");
    } catch (error) {
      console.error("Falha ao adicionar filme:", error);
      setErro("Não foi possível adicionar o filme. Tente novamente.");
    }
  }

  if (authCarregando || !user) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1 className="text-3xl font-bold mb-8 text-white">Adicionar Filme</h1>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarFilmes()}
            placeholder="Digite o nome do filme..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
          />
          <button
            onClick={buscarFilmes}
            disabled={carregando}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>

        {carregando && (
          <p className="text-zinc-500 text-center">Buscando Filmes...</p>
        )}

        {erro && (
          <p className="text-red-400 text-center mb-6" role="alert">
            {erro}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resultados.map((filme) => (
            <div
              key={filme.id}
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 hover:border-amber-500/50 bg-zinc-900 p-4 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <img
                src={filme.imagem}
                alt={filme.titulo}
                className="w-full aspect-[2/3] object-cover rounded-xl"
              />
              <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
                {filme.titulo}
              </p>
              <button
                onClick={() => adicionarFilme(filme)}
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