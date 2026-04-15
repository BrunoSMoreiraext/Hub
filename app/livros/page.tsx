"use client";

import CardItem from "@/components/CardItem";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Livro = {
  id: string;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  apiId: string;
  status: string;
};

export default function Home() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Função que busca os livros no firebase e salva eles no useState Livros
  async function buscarLivros() {
    // verificamos se n tem livros salvos em cache, se tiver passamos para o useState livros direto, sem ir para o db
    const cache = localStorage.getItem("livros");
    if (cache) {
      setLivros(JSON.parse(cache));
      setLoading(false);
      return;
    }

    // Se não tem cache busca todos os documentos da coleção "livros" no Firestore
    const colecaoLivros = await getDocs(collection(db, "livros"));

    // Transforma cada documento em um objeto com id + campos do banco
    const dados = colecaoLivros.docs.map((doc) => ({
      id: doc.id, // Pegamos cada documento do nosso firebase e adicionamos um campo ID que é o ID do documento no firebase
      ...doc.data(), // Os campos: titulo, nota, dataInicio, resumo, apiId
    })) as Livro[];

    dados.sort((a, b) => {
      if (a.status === "Em andamento") return -1;
      if (b.status === "Em andamento") return 1;

      if (a.status === "Concluido") return -1;
      if (b.status === "Concluido") return 1;

      return 0;
    });

    localStorage.setItem("livros", JSON.stringify(dados));

    setLivros(dados);
    setLoading(false);
  }

  useEffect(() => {
    buscarLivros();
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
            Carregando livros...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <div className="p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-white">Minha Biblioteca</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {livros.map((livro) => (
            <Link key={livro.id} href={`/livros/${livro.id}`}>
              <CardItem
                key={livro.id}
                title={livro.titulo}
                imageUrl={`https://books.google.com/books/content?id=${livro.apiId}&printsec=frontcover&img=1&zoom=4`}
                startDate={livro.dataInicio}
                rating={livro.nota}
                type="livro"
                status={livro.status}
              />
            </Link>
          ))}
        </div>
        <button
          onClick={() => router.push("livros/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 active:scale-95 hover:scale-105 animate-float group"
        >
          <span className="text-xl animate-pulse">+</span>
        </button>
      </div>
    </>
  );
}
