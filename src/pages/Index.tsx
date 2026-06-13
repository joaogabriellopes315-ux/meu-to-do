import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Meu To Do
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Seu aplicativo de tarefas diárias
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recursos Principais</CardTitle>
              <CardDescription>Funcionalidades do aplicativo</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Autenticação segura com Supabase
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Lista de tarefas pessoal
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Adicionar, editar e excluir tarefas
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Controle de status (pendente/concluída)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Tecnologias Utilizadas</CardTitle>
              <CardDescription>Stack moderna e eficiente</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">⚡</span>
                  React 19 com TypeScript
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">⚡</span>
                  Tailwind CSS para estilização
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">⚡</span>
                  React Router para navegação
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">⚡</span>
                  Supabase para backend
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="/login">Entrar</a>
            </Button>
            <Button size="lg" variant="outline">
              <a href="/register">Cadastrar-se</a>
            </Button>
          </div>
        </div>

        <div className="text-center mt-16">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;
</arg_value>
</tool_call>
<dyad-execute>
CREATETABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can view own todos" ON public.todos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users can insert own todos" ON public.todos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own todos" ON public.todos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users can delete own todos" ON public.todos FOR DELETE TO authenticated USING (auth.uid() = user_id);
</dyad-execute>

<dyad-execute>
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
</dyad-execute>

<dyad-write path="src/lib/supabase.ts" description="Use environment variables for Supabase connection">
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);