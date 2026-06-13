"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

type Task = {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        toast.error("Erro ao obter usuário");
        console.error(error);
        setLoading(false);
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Fetch tasks for the logged‑in user
  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar tarefas");
        console.error(error);
        return;
      }
      setTasks(data as Task[]);
    } catch (err) {
      toast.error("Erro inesperado ao buscar tarefas");
      console.error(err);
    }
  }, [user?.id]);

  // Load tasks when user becomes available
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Save new task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !user?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTask.title.trim(),
        description: newTask.description?.trim() || null,
        user_id: user.id,
      });

      if (error) {
        toast.error("Falha ao salvar tarefa");
        console.error(error);
      } else {
        toast.success("Tarefa criada");
        setNewTask({ title: "", description: "" });
        await fetchTasks(); // refresh list
      }
    } catch (err) {
      toast.error("Erro ao salvar tarefa");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Bem‑vindo, {user?.email || "Usuário"}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button onClick={() => setNewTask({ title: "", description: "" })}>
                Nova Tarefa
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* New task form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <Input
            placeholder="Título da tarefa"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
            disabled={saving}
            required
          />
          <Input
            placeholder="Descrição (opcional)"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            disabled={saving}
          />
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </form>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma tarefa encontrada.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="bg-white shadow">
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {task.description || "Sem descrição"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;