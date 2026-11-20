import { Plus, Star } from "lucide-react";

export type Recomendacao = {
  apiId: string;
  titulo: string;
  imagem: string;
  nota?: number;
  ano?: string;
};

type Props = {
  item: Recomendacao;
  aoAdicionar: () => void;
  estaAdicionando: boolean;
};

export default function RecomendacaoCard({
  item,
  aoAdicionar,
  estaAdicionando,
}: Props) {
  return (
    <article className="group flex w-[170px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 p-3 transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
        {/* Usamos <img> para não precisar liberar novos domínios no next.config.ts */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imagem}
          alt={item.titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {typeof item.nota === "number" && item.nota > 0 && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-amber-400 backdrop-blur-sm">
            <Star size={12} className="fill-amber-400" />
            {item.nota.toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-amber-400">
          {item.titulo}
        </h3>

        {item.ano && (
          <p className="line-clamp-1 text-xs text-zinc-500">{item.ano}</p>
        )}

        <button
          type="button"
          onClick={aoAdicionar}
          disabled={estaAdicionando}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-amber-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={14} />
          {estaAdicionando ? "Adicionando..." : "Adicionar"}
        </button>
      </div>
    </article>
  );
}
