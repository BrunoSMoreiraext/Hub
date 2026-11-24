"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";


type AuthContextType = {
  user: User | null;      
  carregando: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  carregando: true,
});
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelarEscuta = onAuthStateChanged(auth, (usuarioAtual) => {
      setUser(usuarioAtual);      
      setCarregando(false);       
    });

    return cancelarEscuta;
  }, []);

  return (
    <AuthContext.Provider value={{ user, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

export function useRequireAuth() {
  const authState = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.carregando && !authState.user) {
      router.replace("/login");
    }
  }, [authState.carregando, authState.user, router]);

  return authState;
}