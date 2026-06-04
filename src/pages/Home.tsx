"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo!</h1>
            <p className="text-gray-600">Você está logado com sucesso</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Informações da Conta</CardTitle>
              <CardDescription>Detalhes do seu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Último login:</strong> {new Date().toLocaleString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Recursos Disponíveis</CardTitle>
              <CardDescription>Ferramentas e funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>✓ Dashboard personalizado</p>
                <p>✓ Gerenciamento de tarefas</p>
                <p>✓ Configurações de perfil</p>
                <p>✓ Suporte 24/7</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Próximos Passos</CardTitle>
              <CardDescription>Ações recomendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>📝 Complete seu perfil</p>
                <p>🔧 Configure suas preferências</p>
                <p>📊 Explore o dashboard</p>
                <p>💡 Leia o guia do usuário</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;