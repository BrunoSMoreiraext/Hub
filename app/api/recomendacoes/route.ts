import type { NextRequest } from "next/server";

export const revalidate = 21600; // 6 horas

type Recomendacao = {
  apiId: string;
  titulo: string;
  imagem: string;
  nota?: number;
  ano?: string;
};

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGEM = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://placehold.co/300x450/png";

function normalizarTmdb(item: any, tipo: "filme" | "serie"): Recomendacao {
  const data = tipo === "filme" ? item.release_date : item.first_air_date;

  return {
    apiId: String(item.id),
    titulo: tipo === "filme" ? item.title : item.name,
    imagem: item.poster_path
      ? `${TMDB_IMAGEM}${item.poster_path}`
      : PLACEHOLDER,
    nota: item.vote_average,
    ano: data ? String(data).slice(0, 4) : undefined,
  };
}

async function buscarTmdb(tipo: "filme" | "serie", limite: number) {
  const apiKey =
    process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY não configurada");
  }

  const midia = tipo === "filme" ? "movie" : "tv";
  const url = `${TMDB_BASE}/trending/${midia}/week?language=pt-BR&api_key=${apiKey}`;

  const resposta = await fetch(url, { next: { revalidate: 21600 } });

  if (!resposta.ok) {
    throw new Error(`TMDB respondeu ${resposta.status}`);
  }

  const dados = await resposta.json();

  return (dados.results ?? [])
    .filter((item: any) => item.poster_path && !item.adult)
    .slice(0, limite)
    .map((item: any) => normalizarTmdb(item, tipo));
}

export async function GET(request: NextRequest) {
  const tipo = request.nextUrl.searchParams.get("tipo");
  const limiteParam = Number(request.nextUrl.searchParams.get("limite") ?? 12);
  const limite = Number.isFinite(limiteParam)
    ? Math.min(Math.max(limiteParam, 1), 20)
    : 12;

  if (tipo !== "filme" && tipo !== "serie") {
    return Response.json(
      { erro: "Use ?tipo=filme ou ?tipo=serie" },
      { status: 400 },
    );
  }

  try {
    const recomendacoes = await buscarTmdb(tipo, limite);

    return Response.json(
      { tipo, recomendacoes },
      {
        headers: {
          "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (erro) {
    console.error("Erro ao buscar recomendações:", erro);

    return Response.json(
      { erro: "Não foi possível buscar recomendações agora." },
      { status: 502 },
    );
  }
}
