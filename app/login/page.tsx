"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

function traduzirErro(codigo: string): string {
  const erros: Record<string, string> = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/invalid-email": "O e-mail informado não é válido.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  };
  return erros[codigo] ?? "Ocorreu um erro. Tente novamente.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);

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
            B
          </div>
          <h1 className="text-3xl font-bold text-white">Entrar</h1>
          <p className="text-zinc-500 mt-2">Acesse sua conta no Hub</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Sua senha"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Mensagem de erro */}
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
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 text-sm">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-amber-400 hover:text-amber-300 font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}