"use client";

import React, { useState } from "react";
import { Star, Calendar, Pencil, ExternalLink, Trash } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function CardItem({
  title,
  imageUrl,
  startDate,
  rating,
  status,
}: any) {
  // Estado para controlar o hover na borda (efeito de brilho)
  const [isHovered, setIsHovered] = useState(false);

  // Função para renderizar as estrelas baseadas na nota
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
        }`}
      />
    ));
  };

  function corStatus(status: string) {
    if (status === "Em andamento") {
      return "bg-yellow-500";
    } else if (status === "Concluido") {
      return "bg-green-500";
    } else if (status === "Não iniciado") {
      return "bg-slate-500";
    }
  }

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border ${isHovered ? "border-indigo-500/50" : "border-zinc-800"} bg-zinc-900 p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da Imagem */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div
          className={`absolute text-sm font-bold text-white top-2 left-2 z-10 p-4 py-1 ${corStatus(status)} rounded-full`}
        >
          {status}
        </div>

        {/* Camada de sobreposição sutil*/}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Informações da Obra */}
      <div className="flex flex-col gap-2.5">
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Data de Início e Nota */}
        <div className="flex flex-col gap-1.5 border-t border-zinc-800 pt-3 mt-1">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar size={14} className="text-zinc-500" />
            <span>
              Iniciado:{" "}
              <span className="font-medium text-zinc-500">{startDate}</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 just">
            <div className="flex gap-3">{renderStars(rating)}</div>
          </div>
        </div>
      </div>

      {/* Efeito de brilho sutil no hover */}
      <div
        className={`absolute inset-0 -z-10 rounded-2xl bg-indigo-500/0 blur-2xl transition-all duration-300 ${isHovered ? "bg-indigo-500/5" : ""}`}
      />
    </div>
  );
}
