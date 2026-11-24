import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type NomeDaColecao = "filmes" | "series" | "livros";

const ORDEM_STATUS: Record<string, number> = {
  "Em andamento": 0,
  Concluido: 1,
  "Não iniciado": 2,
};

const POSICAO_STATUS_DESCONHECIDO = 2;

export function ordenarPorStatus<T extends { status: string }>(
  itens: T[],
): T[] {
  return [...itens].sort((a, b) => {
    const posicaoA = ORDEM_STATUS[a.status] ?? POSICAO_STATUS_DESCONHECIDO;
    const posicaoB = ORDEM_STATUS[b.status] ?? POSICAO_STATUS_DESCONHECIDO;
    return posicaoA - posicaoB;
  });
}

export function observarColecao<T extends { id: string; status: string }>(
  userId: string,         
  nome: NomeDaColecao,
  aoAtualizar: (itens: T[]) => void,
  aoFalhar?: (erro: Error) => void,
) {
  return onSnapshot(
    collection(db, "usuarios", userId, nome),
    (snapshot) => {
      const itens = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      })) as T[];

      aoAtualizar(ordenarPorStatus(itens));
    },
    (erro) => {
      console.error(`Falha ao escutar a coleção "${nome}":`, erro);
      aoFalhar?.(erro);
    },
  );
}