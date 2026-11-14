import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Pega o termo de busca da URL
  const busca = request.nextUrl.searchParams.get("q")?.trim();

  if (!busca) {
    return NextResponse.json(
      { erro: "Informe um termo de busca.", items: [] },
      { status: 400 },
    );
  }

  // Lê a chave do .env 
  const chave = process.env.GOOGLE_BOOKS_API_KEY;

  if (!chave) {
    console.error("GOOGLE_BOOKS_API_KEY não configurada no .env");
    return NextResponse.json(
      { erro: "Serviço de busca não configurado.", items: [] },
      { status: 500 },
    );
  }

  // Monta a URL do Google Books 
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", busca);
  url.searchParams.set("maxResults", "12");
  url.searchParams.set("langRestrict", "pt");
  url.searchParams.set("key", chave);

  // Acessa de fato a URL e busca os dados que queremos
  try {
    const respostaGoogle = await fetch(url, {
      next: { revalidate: 3600 },
    });

    // Se o Google respondeu com erro (429, 500 etc)
    if (!respostaGoogle.ok) {
      console.error(`Google Books respondeu ${respostaGoogle.status}`);

      const status = respostaGoogle.status === 429 ? 429 : 502;

      return NextResponse.json(
        {
          erro:
            status === 429
              ? "Limite de buscas atingido. Tente novamente mais tarde."
              : "Erro ao consultar o Google Books.",
          items: [],
        },
        { status },
      );
    }

    const dados = await respostaGoogle.json();

    return NextResponse.json({ items: dados.items ?? [] });
  } catch (erro) {
    console.error("Falha ao chamar o Google Books:", erro);

    return NextResponse.json(
      { erro: "Não foi possível buscar os livros agora.", items: [] },
      { status: 502 },
    );
  }
}
