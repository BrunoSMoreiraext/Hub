"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";


function senhaEhValida(senha: string): string | null {
  if (senha.length < 7) {
    return "A senha deve ter no mínimo 7 caracteres.";
  }
  if (!/[0-9]/.test(senha)) {
    return "A senha deve conter pelo menos um número.";
  }
  if (!/[@#!$%^&*]/.test(senha)) {
    return "A senha deve conter pelo menos um caractere especial (@, #, !, etc).";
  }
  return null;
}

function traduzirErro(codigo: string): string {
  const erros: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "O e-mail informado não é válido.",
    "auth/weak-password": "Senha muito fraca.",
  };
  return erros[codigo] ?? "Ocorreu um erro. Tente novamente.";
}

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro("Preencha todos os campos.");
      return;
    }

    const erroSenha = senhaEhValida(senha);
    if (erroSenha) {
      setErro(erroSenha);
      return;
    }

    setCarregando(true);

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, senha);

      await updateProfile(credencial.user, { displayName: nome });

      router.push("/");
    } catch (erro: any) {
      setErro(traduzirErro(erro.code));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 items-center justify-center font-bold text-white text-2xl mb-4">
            G
          </div>
          <h1 className="text-3xl font-bold text-white">Criar conta</h1>
          <p className="text-zinc-500 mt-2">Cadastre-se para acessar o Geek Hub</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-1">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold block mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 7 caracteres, 1 número e 1 especial"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Mensagem de erro (CA01, CA02, CA03) */}
          {erro && (
            <p className="text-red-400 text-sm text-center" role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 text-sm">
          Já tem conta?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}