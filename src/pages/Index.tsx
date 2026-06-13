import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao seu App Web
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Uma aplicação moderna com autenticação segura
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recursos Principais</CardTitle>
              <CardDescription>Funcionalidades que tornam seu app especial</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Autenticação segura com Supabase
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Rotas protegidas para usuários autenticados
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Interface moderna e responsiva
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Sistema de notificações com toast
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