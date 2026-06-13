"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logError = (context: string, error: unknown) => {
    console.error(`[REGISTRO] ${context}`, error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            email,
          },
        },
      });

      if (authError) {
        logError("Erro no signUp", authError);
        toast.error(`Erro no cadastro: ${authError.message}`);
        return;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        const msg = "ID do usuário não encontrado após signUp.";
        logError(msg, authData);
        toast.error(msg);
        return;
      }

      // 2️⃣ Upsert profile row (creates if not exists, updates if exists)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            nome,
            email,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        logError("Erro ao fazer upsert do perfil", profileError);
        toast.error(`Erro ao criar/atualizar perfil: ${profileError.message}`);
        return;
      }

      // 3️⃣ Auto‑login the new user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        logError("Erro no login automático", signInError);
        toast.error(`Cadastro concluído, mas falha ao entrar: ${signInError.message}`);
        return;
      }

      toast.success("Cadastro concluído! Redirecionando...");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      logError("Erro inesperado", err);
      toast.error(err.message ?? "Erro inesperado durante o cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Crie sua conta
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? "Criando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Já tem conta?{" "}
          <a href="/login" className="text-green-600 hover:underline font-medium">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;