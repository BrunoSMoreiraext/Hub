"use client";

import CardItem from "@/components/CardItem";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type series = {
  id: string;
  titulo: string;
  nota: number;
  dataInicio: string;
  resumo: string;
  status: string;
  imagem: string;
};

export default function Home() {
  const [series, setSeries] = useState<series[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Função que busca os livros no firebase e salva eles no useState Livros
  async function buscarSeries() {

    // Verificando se n tem series em cache
    const cache = localStorage.getItem("series");
    if (cache) {
      setSeries(JSON.parse(cache));
      setLoading(false);
      return;
    }

    // Busca todos os documentos da coleção "livros" no Firestore
    const colecaoSeries = await getDocs(collection(db, "series"));

    // Transforma cada documento em um objeto com id + campos do banco
    const dados = colecaoSeries.docs.map((doc) => ({
      id: doc.id, // Pegamos cada documento do nosso firebase e adicionamos um campo ID que é o ID do documento no firebase
      ...doc.data(), // Os campos: titulo, nota, dataInicio, resumo, apiId
    })) as series[];

    dados.sort((a,b)=>{
      if(a.status === "Em andamento") return -1;
      if(b.status === "Em andamento") return 1;

      if(a.status === "Concluido") return -1;
      if(b.status === "Concluido") return 1;

      return 0;
    });

    localStorage.setItem("series", JSON.stringify(dados));

    setSeries(dados);
    setLoading(false);
  }

  useEffect(() => {
    buscarSeries();
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
        <h1 className="text-3xl font-bold mb-8 text-white">Minhas séries</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {series.map((series) => (
            <Link key={series.id} href={`/series/${series.id}`}>
              <CardItem
                key={series.id}
                title={series.titulo}
                imageUrl={series.imagem}
                startDate={series.dataInicio} 
                rating={series.nota}
                type="series"
                status = {series.status}
              />
            </Link>
          ))}
        </div>
        <button
          onClick={() => router.push("series/adicionar")} 
          className="z-50 fixed bottom-8 right-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-4 rounded-2xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </>
  );
}
