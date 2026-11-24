"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Film, Tv, RefreshCw } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RecomendacaoCard, {
  type Recomendacao,
} from "@/components/RecomendacaoCard";

type Tipo = "filme" | "serie";

type ItemBiblioteca = {
  apiId?: string | number;
};

type Props = {
  tipo: Tipo;
  userId: string;
  itens?: ItemBiblioteca[];
};

type RespostaRecomendacoes = {
  recomendacoes?: Recomendacao[];
};

const BIBLIOTECA_VAZIA: ItemBiblioteca[] = [];
const LIMITE_RECOMENDACOES = 12;

const CONFIG = {
  filme: { titulo: "Filmes em alta", Icone: Film },
  serie: { titulo: "Séries em alta", Icone: Tv },
} as const;

const COLECOES: Record<Tipo, "filmes" | "series"> = {
  filme: "filmes",
  serie: "series",
};

// As respostas vem no formato tipo, recomendações, aqui extraimos recomendações
function extrairRecomendacoes(
resposta: RespostaRecomendacoes,
): Recomendacao[] {
  if (!Array.isArray(resposta.recomendacoes)) {
    return [];
  }

  return resposta.recomendacoes;
}

function criarIdsDaBiblioteca(itens: ItemBiblioteca[]): Set<string> {
  const ids = itens.map((item) => item.apiId);
  const idsValidos = ids.filter(
    (apiId) => apiId !== undefined && apiId !== null,
  );
  const idsComoTexto = idsValidos.map((apiId) => String(apiId));

  return new Set(idsComoTexto);
}

function filtrarRecomendacoesNovas(
  recomendacoes: Recomendacao[],
  idsDaBiblioteca: Set<string>,
): Recomendacao[] {
  return recomendacoes.filter(
    (recomendacao) =>
      !idsDaBiblioteca.has(String(recomendacao.apiId)),
  );
}

function obterIdRecomendacao(item: Recomendacao): string {
  return item.apiId;
}

function montarDocumentoParaAdicionar(item: Recomendacao) {
  return {
    apiId: item.apiId,
    titulo: item.titulo,
    imagem: item.imagem,
    resumo: "",
    dataInicio: "",
    nota: 0,
    status: "Não iniciado",
  };
}

async function buscarRecomendacoes(tipo: Tipo): Promise<Recomendacao[]> {
  const resposta = await fetch(
    `/api/recomendacoes?tipo=${tipo}&limite=${LIMITE_RECOMENDACOES}`,
  );

  if (!resposta.ok) {
    throw new Error("Falha ao buscar recomendações");
  }

  const dados = (await resposta.json()) as RespostaRecomendacoes;

  return extrairRecomendacoes(dados);
}

export default function Recomendacoes({
  tipo,
  userId,
  itens = BIBLIOTECA_VAZIA,
}: Props) {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [podeRolarEsquerda, setPodeRolarEsquerda] = useState(false);
  const [podeRolarDireita, setPodeRolarDireita] = useState(false);
  const [idEmAdicao, setIdEmAdicao] = useState<string | null>(null);
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const recomendacoesRecebidas = await buscarRecomendacoes(tipo);
        const idsDaBiblioteca = criarIdsDaBiblioteca(itens);
        const recomendacoesNovas = filtrarRecomendacoesNovas(
          recomendacoesRecebidas,
          idsDaBiblioteca,
        );

        if (cancelado) return;

        setRecomendacoes(recomendacoesNovas);
      } catch {
        if (!cancelado) {
          setErro("Não foi possível carregar as recomendações.");
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      cancelado = true;
    };
  }, [tipo, itens, tentativa]);

  function atualizarBotoesDeRolagem() {
    const lista = listaRef.current;

    if (!lista) return;

    const posicaoAtual = lista.scrollLeft;
    const larguraVisivel = lista.clientWidth;
    const larguraTotal = lista.scrollWidth;

    setPodeRolarEsquerda(posicaoAtual > 0);
    setPodeRolarDireita(
      posicaoAtual + larguraVisivel < larguraTotal - 1,
    );
  }

  useEffect(() => {
    atualizarBotoesDeRolagem();
  }, [recomendacoes]);

  function rolarCarrossel(direcao: "esquerda" | "direita") {
    const lista = listaRef.current;

    if (!lista) return;

    const distancia = 360;
    const deslocamento =
      direcao === "esquerda" ? -distancia : distancia;

    lista.scrollBy({ left: deslocamento, behavior: "smooth" });
  }

  async function adicionarRecomendacao(item: Recomendacao) {
    const idRecomendacao = obterIdRecomendacao(item);
    const colecao = COLECOES[tipo];

    setIdEmAdicao(idRecomendacao);

    try {
      const documento = montarDocumentoParaAdicionar(item);

      await addDoc(
        collection(db, "usuarios", userId, colecao),
        documento,
      );

      setRecomendacoes((recomendacoesAtuais) =>
        recomendacoesAtuais.filter(
          (recomendacao) =>
            obterIdRecomendacao(recomendacao) !== idRecomendacao,
        ),
      );
    } catch {
      alert("Não foi possível adicionar este item agora.");
    } finally {
      setIdEmAdicao(null);
    }
  }

  const { titulo, Icone } = CONFIG[tipo];
  const deveMostrarCarrossel = !erro && recomendacoes.length > 0;

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-2">
        <Icone size={20} className="text-amber-500" />
        <h2 className="text-xl font-bold text-white">{titulo}</h2>
      </div>

      {carregando && recomendacoes.length === 0 && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] w-[170px] shrink-0 animate-pulse rounded-2xl bg-zinc-900"
            />
          ))}
        </div>
      )}

      {!carregando && erro && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">{erro}</p>
          <button
            onClick={() => setTentativa((valor) => valor + 1)}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            <RefreshCw size={14} />
            Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erro && recomendacoes.length === 0 && (
        <p className="text-sm text-zinc-500">
          Nenhuma recomendação nova no momento.
        </p>
      )}

      {deveMostrarCarrossel && (
        <div className="group/carrossel relative">
          {podeRolarEsquerda && (
            <button
              type="button"
              onClick={() => rolarCarrossel("esquerda")}
              aria-label="Rolar recomendações para a esquerda"
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-800"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={listaRef}
            onScroll={atualizarBotoesDeRolagem}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {recomendacoes.map((item) => {
              const idRecomendacao = obterIdRecomendacao(item);

              return (
                <RecomendacaoCard
                  key={idRecomendacao}
                  item={item}
                  aoAdicionar={() => adicionarRecomendacao(item)}
                  estaAdicionando={idEmAdicao === idRecomendacao}
                />
              );
            })}
          </div>

          {podeRolarDireita && (
            <button
              type="button"
              onClick={() => rolarCarrossel("direita")}
              aria-label="Rolar recomendações para a direita"
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-800"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
