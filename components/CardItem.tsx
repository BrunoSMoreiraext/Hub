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
  typeLabel,
}: any) {
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
    <div className="group mb-15 relative flex flex-col gap-3 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/70 bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm p-4 transition-all duration-500 hover:scale-[1.03] cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Container da Imagem */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-inner">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="h-full w-full object-cover transition-all duration-700"
          loading="lazy"
        />

        <div
          className={`absolute text-sm font-bold text-white top-2 left-2 z-10 px-3 py-1 ${corStatus(status)} rounded-full backdrop-blur-sm shadow-lg animate-slideDown`}
        >
          {status}
        </div>

        {typeLabel && (
          <div className="absolute bottom-2 right-2 z-10 px-3 py-1 text-xs font-bold text-amber-400 bg-black/80 border border-amber-500/40 rounded-full backdrop-blur-sm shadow-lg">
            {typeLabel}
          </div>
        )}

        {/* Camada de sobreposição*/}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Efeito de brilho nas bordas */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Informações da Obra */}
      <div className="flex flex-col gap-2.5">
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-white group-hover:text-amber-400 transition-all duration-300 transform group-hover:translate-y-[-2px]">
          {title}
        </h3>

        {/* Data de Início e Nota */}
        <div className="flex flex-col gap-1.5 border-t border-zinc-800/50 pt-3 mt-1">
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

      {/* Efeito de brilho premium no hover */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-amber-500/0 hover:from-amber-500/5 hover:via-amber-500/15 hover:to-amber-500/5 blur-3xl transition-all duration-700" />
      {/* Efeito de partículas sutis */}
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse delay-75" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse delay-150" />
      </div>
    </div>
  );
}
