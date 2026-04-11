"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Save,
  ChevronLeft,
  Loader2,
  BookOpen,
  Trash,
  Star,
  Film,
} from "lucide-react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateDoc } from "firebase/firestore";

type Filme = {
  titulo: string;
  resumo: string;
  dataInicio: string;
  nota: number;
  apiId: string;
  status: string;
};

export default function EditPage() {
  const { id } = useParams();
  const idTransformadoEmString = id as string;
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [status, setStatus] = useState("Quero Ler");
  const [dataInicio, setDataInicio] = useState("");
  const [nota, setNota] = useState(0);
  const [loading, setLoading] = useState(true);

  async function updateNovasInformacoes() {
    const referencia = doc(db, "filmes", idTransformadoEmString); // buscamos no banco os dados que queremos editar

    await updateDoc(referencia, {
      titulo: titulo,
      resumo: resumo,
      dataInicio: dataInicio,
      nota: nota,
      status: status,
    });

    alert("Filme atualizado com sucesso!");
    localStorage.removeItem("filmes");
    router.push("/filmes");
  }

  // Use effect que recebe o ID do produto clicado na página principal e procura os dados dele no banco de dados
  useEffect(() => {
    async function buscarFilmeAtual() {
      const filmeAtual = doc(db, "filmes", idTransformadoEmString);
      const filmeAtualAberto = await getDoc(filmeAtual);

      if (filmeAtualAberto.exists()) {
        const dados = filmeAtualAberto.data() as Filme;
        setTitulo(dados.titulo);
        setDataInicio(dados.dataInicio);
        setResumo(dados.resumo);
        setStatus(dados.status);
        setNota(dados.nota);
      }
      setLoading(false);
    }
    buscarFilmeAtual();
  }, [id]);

  async function apagarFilme(id: string) {
    const referencia = doc(db, "filmes", id); // Pegando o elemento que cliquei e que quero apagar
    await deleteDoc(referencia);
    localStorage.removeItem("filmes");
    router.back();
  }

  if (loading)
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" />
      </div>
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header de Navegação */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Voltar</span>
          </button>

          {/* botão de salvar e excluir */}
          <div className="flex gap-3">
            <button
              onClick={updateNovasInformacoes}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Save size={18} />
              <span>Salvar</span>
            </button>

            <button
              onClick={() => apagarFilme(idTransformadoEmString)}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-900 px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>

        {/* Título e Meta-informações */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <Film size={20} />
            <span className="text-xs uppercase tracking-[0.2em] font-bold">
              Filme
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {titulo}
          </h1>
          <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
        </header>

        {/* Informações do filme*/}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-transparent text-xl font-medium outline-none cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <option className="bg-zinc-900">Em andamento</option>
                <option className="bg-zinc-900">Concluido</option>
                <option className="bg-zinc-900">Não iniciado</option>
              </select>
            </div>
            <div className="flex-1 space-y-2 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Iniciado em
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full bg-transparent text-xl font-medium outline-none block"
              />
            </div>
            <div className="flex-1 flex-col items-center space-y-2 md:border-l border-zinc-800 md:pl-6">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Nota
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <Star
                    key={estrela}
                    size={16}
                    className={`cursor-pointer transition-colors ${estrela <= nota ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                    onClick={() => setNota(estrela)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative group">
            <textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Comece a escrever suas reflexões..."
              className="w-full min-h-[60vh] bg-transparent text-zinc-300 text-lg md:text-xl leading-relaxed outline-none resize-none placeholder:text-zinc-700 pb-20"
              style={{ lineHeight: "1.8" }}
            />
            {/* Indicador de escrita na lateral */}
            <div className="absolute left-[-24px] top-2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block text-zinc-800 text-2xl font-serif">
              "
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
