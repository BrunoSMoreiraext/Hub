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
    // Busca todos os documentos da coleção "livros" no Firestore
    const colecaoLivros = await getDocs(collection(db, "livros"));

    // Transforma cada documento em um objeto com id + campos do banco
    const dados = colecaoLivros.docs.map((doc) => ({
      id: doc.id, // Pegamos cada documento do nosso firebase e adicionamos um campo ID que é o ID do documento no firebase
      ...doc.data(), // Os campos: titulo, nota, dataInicio, resumo, apiId
    })) as Livro[];

    dados.sort((a,b)=>{
      if(a.status === "Em andamento") return -1;
      if(b.status === "Em andamento") return 1;

      if(a.status === "Concluido") return -1;
      if(b.status === "Concluido") return 1;

      return 0;
    });

    setLivros(dados);
    setLoading(false);
  }

  useEffect(() => {
    buscarLivros();
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
                status = {livro.status}
              />
            </Link>
          ))}
        </div>
        <button
          onClick={() => router.push("livros/adicionar")}
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-4 rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </>
  );
}
