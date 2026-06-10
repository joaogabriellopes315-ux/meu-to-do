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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Supabase Auth
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

      const userId = authData.user?.id;

      if (!userId) {
        const message = "Usuário criado no Auth, mas nenhum ID foi retornado.";
        logError(message, authData);
        toast.error(message);
        return;
      }

      // 2. Create profile row after signUp
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        nome,
        email,
      });

      if (profileError) {
        logError("Erro ao criar perfil na tabela profiles", profileError);
        toast.error(`Erro ao criar perfil: ${profileError.message}`);
        return;
      }

      // 3. Sign in automatically
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        logError("Erro ao realizar login automático", signInError);
        toast.error(`Cadastro realizado, mas erro ao entrar: ${signInError.message}`);
        return;
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      logError("Erro inesperado no cadastro", error);
      toast.error("Erro inesperado durante o cadastro. Veja o console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600">
            Cadastre-se para acessar seu dashboard financeiro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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

        <p className="text-center text-sm text-gray-600">
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