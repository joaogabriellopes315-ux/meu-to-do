"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, PlusCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";

type Task = {
  id: string;
  title: string;
  created_at: string;
};

type Profile = {
  nome?: string | null;
  email?: string | null;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Usuário");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshTasks = async (ownerId: string) => {
    if (!ownerId) return;

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", ownerId)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Erro ao carregar tarefas: " + error.message);
      } else {
        setTasks(data ?? []);
      }
    } catch (err) {
      setError("Erro crítico: " + (err.message || "Falha desconhecida"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialData = async () => {
      if (!isActive) return;

      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        if (isActive) {
          navigate("/login", { replace: true });
        }

        return;
      }

      const { data: profile } = (await supabase
        .from("profiles")
        .select("nome,email")
        .eq("id", user.id)
        .maybeSingle()) as { data: Profile | null };

      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (isActive) {
        setUserId(user.id);
        setDisplayName(profile?.nome || user.email?.split("@")[0] || "Usuário");

        if (tasksError) {
          setError("Erro ao carregar tarefas: " + tasksError.message);
        } else {
          setTasks(tasksData ?? []);
        }
      }
    };

    void loadInitialData();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleCreateTaskClick = () => {
    document.getElementById("nova-tarefa")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <UserCircle className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Meu To Do</p>
              <h1 className="text-2xl font-bold text-slate-950">
                Olá, {displayName}
              </h1>
              <p className="text-sm text-slate-500">
                Organize suas tarefas do dia.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreateTaskClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar nova tarefa
            </Button>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {userId ? (
            <TodoForm
              userId={userId}
              onTaskCreated={() => refreshTasks(userId)}
            />
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-slate-500">
                {error ? (
                  <div className="text-sm text-red-500">
                    {error}
                  </div>
                ) : (
                  "Carregando usuário..."
                )}
              </CardContent>
            </Card>
          )}

          <TodoList
            tasks={tasks}
            loading={loading}
            onRefresh={() => (userId ? refreshTasks(userId) : Promise.resolve())}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;