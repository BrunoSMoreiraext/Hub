import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo");
  const id = searchParams.get("id");

  if (!tipo || !id) {
    return NextResponse.json(
      { error: "tipo e id são obrigatórios" },
      { status: 400 },
    );
  }

  try {
    // Livros: Google Books
    if (tipo === "livro") {
  // IDs do Open Library têm o formato OL12345W
  if (/^OL\d+W$/.test(id)) {
    const res = await fetch(`https://openlibrary.org/works/${id}.json`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`Open Library respondeu ${res.status}`);
    const data = await res.json();
    const subjects: string[] = data.subjects ?? [];
    return NextResponse.json({ categorias: subjects.slice(0, 5) });
  }

  // Demais IDs: Google Books (com a sua chave do .env)
  const chave = process.env.GOOGLE_BOOKS_API_KEY;
  const url = new URL(
    `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`,
  );
  if (chave) url.searchParams.set("key", chave);

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) {
    const corpo = await res.text();
    throw new Error(
      `Google Books respondeu ${res.status}: ${corpo.slice(0, 200)}`,
    );
  }
  const data = await res.json();
  const brutas: string[] = data.volumeInfo?.categories ?? [];
  const categorias = Array.from(
    new Set(brutas.map((c) => c.split("/")[0].trim()).filter(Boolean)),
  );
  return NextResponse.json({ categorias });
}

    // Filmes e séries: TMDB
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TMDB_API_KEY não configurada" },
        { status: 500 },
      );
    }

    const midia = tipo === "filme" ? "movie" : "tv";
    const usaBearer = apiKey.startsWith("eyJ"); // token v4 começa com "eyJ"
    const url = new URL(`https://api.themoviedb.org/3/${midia}/${id}`);
    url.searchParams.set("language", "pt-BR");
    if (!usaBearer) url.searchParams.set("api_key", apiKey);

    const res = await fetch(url, {
      headers: usaBearer ? { Authorization: `Bearer ${apiKey}` } : {},
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`TMDB respondeu ${res.status}`);

    const data = await res.json();
    const categorias: string[] = (data.genres ?? []).map(
      (g: { name: string }) => g.name,
    );
    return NextResponse.json({ categorias });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ error: "Falha ao buscar" }, { status: 502 });
  }
}