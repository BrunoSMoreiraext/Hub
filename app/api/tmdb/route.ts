import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  const busca = parametros.get("q")?.trim();
  const tipo = parametros.get("tipo")?.trim();

  // Valida o termo de busca
  if (!busca) {
    return NextResponse.json(
      { erro: "Informe um termo de busca.", items: [] },
      { status: 400 },
    );
  }

  // Se nenhum tipo tiver sido selecionado
  if (tipo !== "filme" && tipo !== "serie") {
    return NextResponse.json(
      { erro: "Tipo inválido. Use 'filme' ou 'serie'.", items: [] },
      { status: 400 },
    );
  }

  // Lê a chave do .env 
  const chave = process.env.TMDB_API_KEY;

  if (!chave) {
    console.error("TMDB_API_KEY não configurada no .env");
    return NextResponse.json(
      { erro: "Serviço de busca não configurado.", items: [] },
      { status: 500 },
    );
  }

  // Traduz o tipo da API para o recurso do TMDB(filme vira movie, serie vira tv)

  const recurso = tipo === "filme" ? "movie" : "tv";

  // Monta a URL do TMDB 
  const url = new URL(`https://api.themoviedb.org/3/search/${recurso}`);
  url.searchParams.set("query", busca);
  url.searchParams.set("language", "pt-BR");
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("api_key", chave);

  try {
    const respostaTmdb = await fetch(url, {
      next: { revalidate: 3600 },
    });

    // Se o TMDB respondeu com erro (401, 429 etc)
    if (!respostaTmdb.ok) {
      console.error(`TMDB respondeu ${respostaTmdb.status}`);

      const status =
        respostaTmdb.status === 429
          ? 429
          : respostaTmdb.status === 401
            ? 500
            : 502;

      return NextResponse.json(
        {
          erro:
            status === 429
              ? "Limite de buscas atingido. Tente novamente mais tarde."
              : status === 500
                ? "Chave do TMDB inválida. Verifique o .env."
                : "Erro ao consultar o TMDB.",
          items: [],
        },
        { status },
      );
    }

    // Converte o JSON e padroniza a resposta
    const dados = await respostaTmdb.json();

    const items = (dados.results ?? []).map((item: any) => ({
      id: item.id,
      titulo: item.title ?? item.name ?? "Sem título",
      imagem: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "https://placehold.co/300x450",
    }));

    return NextResponse.json({ items });
  } catch (erro) {
    console.error("Falha ao chamar o TMDB:", erro);

    return NextResponse.json(
      { erro: "Não foi possível buscar agora.", items: [] },
      { status: 502 },
    );
  }
}
