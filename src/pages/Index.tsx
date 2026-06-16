"use client";

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { CheckCircle2, Clock, ListTodo, Sparkles } from "lucide-react";

const features = [
  {
    icon: ListTodo,
    title: "Lista simples",
    description: "Crie tarefas rapidamente e mantenha tudo organizado em um só lugar.",
  },
  {
    icon: Clock,
    title: "Atualização em tempo real",
    description: "Alterações são refletidas na tela para acompanhar seu progresso.",
  },
  {
    icon: Sparkles,
    title: "Experiência limpa",
    description: "Interface moderna, responsiva e fácil de usar em qualquer dispositivo.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Meu To Do</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              className="bg-white text-slate-950 hover:bg-slate-100"
              asChild
            >
              <Link to="/register">Criar conta</Link>
            </Button>
          </div>
        </nav>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge className="border-indigo-300 bg-indigo-500/20 text-indigo-100">
              Simples, rápido e sincronizado
            </Badge>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Organize seu dia sem complicação.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Um app de tarefas com login, cadastro, criação, edição, exclusão e
              dashboard personalizado para você focar no que realmente importa.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-indigo-400 text-slate-950 hover:bg-indigo-300"
                asChild
              >
                <Link to="/register">Começar agora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link to="/login">Fazer login</Link>
              </Button>
            </div>
          </div>

          <Card className="border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur">
            <CardHeader>
              <CardTitle>Como funciona</CardTitle>
              <CardDescription className="text-slate-300">
                Fluxo completo para gerenciar suas tarefas diárias.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <MadeWithDyad />
      </div>
    </main>
  );
};

export default Index;