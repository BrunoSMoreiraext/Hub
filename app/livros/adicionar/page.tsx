"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import { Search, Plus, ChevronLeft } from "lucide-react";

type LivroAPI = {
  id: string;
  titulo: string;
  imagem: string;
};

export default function AdicionarPage() {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultados, setResultados] = useState<LivroAPI[]>([]);
  const router = useRouter();

  // Função que busca os livros na API e salva eles no useState
  async function buscarLivros() {
    if (!busca.trim()) return;
    setCarregando(true);

    const respostaAPI = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(busca)}&maxResults=12&langRestrict=pt`,
    );
    const dadosAPI = await respostaAPI.json();

    const livros = dadosAPI.items.map((item: any) => ({
      id: item.id,
      titulo: item.volumeInfo.title,
      imagem:
        item.volumeInfo.imageLinks?.thumbnail ??
        "https://via.placeholder.com/150",
    }));
    setResultados(livros);
    setCarregando(false);
  }

  // Função para adicionar livros ao banco de dados

  async function adicionarLivro(livro: LivroAPI) {
      await addDoc(collection(db, "livros"), {
          apiId: livro.id,
          titulo: livro.titulo,
          resumo: "",
          dataInicio: "",
          nota: 0,
          status: "Não iniciado"
      })

      alert("Livro adicionado com sucesso!");
      localStorage.removeItem("livros");
      router.push("/");
  }
  return( 
  
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
        <h1 className="text-3xl font-bold mb-8 text-white">Adicionar Livro</h1>

        {/* Campo de busca */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarLivros()}
            placeholder="Digite o nome do livro..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={buscarLivros}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>

        {/* Estado de carregando */}
        {carregando && (
          <p className="text-zinc-500 text-center">Buscando livros...</p>
        )}

        {/* Resultados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {resultados.map((livro) => (
            <div
              key={livro.id}
              className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 hover:border-indigo-500/50 bg-zinc-900 p-4 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <img
                src={livro.imagem}
                alt={livro.titulo}
                className="w-full aspect-[2/3] object-cover rounded-xl"
              />
              <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                {livro.titulo}
              </p>
              <button onClick={()=> adicionarLivro(livro)} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-indigo-600 text-zinc-400 hover:text-white text-xs font-semibold py-2 rounded-lg transition-all">
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
