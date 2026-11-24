export type TipoObra = "filme" | "serie" | "livro";

// Devolve as categorias da obra, ou null se a busca falhar
// (nesse caso a obra é salva sem o campo e pode ser preenchida depois).
export async function buscarCategorias(
  tipo: TipoObra,
  apiId: string | number,
): Promise<string[] | null> {
  try {
    const resposta = await fetch(
      `/api/categorias?tipo=${tipo}&id=${encodeURIComponent(String(apiId))}`,
    );
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    return Array.isArray(dados.categorias) ? dados.categorias : null;
  } catch {
    return null;
  }
}