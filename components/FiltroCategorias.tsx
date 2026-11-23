"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Menu, X } from "lucide-react";

type Props = {
  categorias: string[];
  selecionada: string;
  onChange: (valor: string) => void;
};

export default function FiltroCategorias({
  categorias,
  selecionada,
  onChange,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora ou apertar Esc
  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(evento.target as Node)
      ) {
        setAberto(false);
      }
    }
    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoApertarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, []);

  function escolher(categoria: string) {
    onChange(categoria);
    setAberto(false);
  }

  const filtroAtivo = selecionada !== "Todas";

  return (
    <div ref={containerRef} className="relative mb-8 w-fit">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAberto((anterior) => !anterior)}
          aria-haspopup="listbox"
          aria-expanded={aberto}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 border ${
            filtroAtivo
              ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
              : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
          }`}
        >
          <Menu size={18} />
          {filtroAtivo ? selecionada : "Categorias"}
        </button>

        {filtroAtivo && (
          <button
            type="button"
            onClick={() => escolher("Todas")}
            aria-label="Limpar filtro"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {aberto && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-2 z-40 w-64 max-h-72 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-sm p-2 shadow-2xl"
        >
          {["Todas", ...categorias].map((categoria) => {
            const ativo = categoria === selecionada;
            return (
              <li key={categoria} role="option" aria-selected={ativo}>
                <button
                  type="button"
                  onClick={() => escolher(categoria)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    ativo
                      ? "bg-amber-500/15 text-amber-400 font-semibold"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {categoria}
                  {ativo && <Check size={16} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}