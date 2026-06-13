"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user ID
  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    } else {
      // Redirect to login if no user
      window.location.href = "/login";
    }
  };

  // Fetch tasks for current user
  const fetchTasks = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tarefas");
      console.error("Supabase error:", error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("O título da tarefa é obrigatório");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTask.title.trim(),
        description: newTask.description.trim() || null,
        user_id: userId,
      });

      if (error) {
        toast.error("Erro ao salvar tarefa");
        console.error("Supabase insert error:", error);
        return;
      }

      toast.success("Tarefa adicionada com sucesso");
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message ?? "Erro inesperado ao salvar");
      console.error("Unexpected error:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  useEffect(() => {
    getUserId().then(() => {
      if (userId) {
        fetchTasks();
      }
    });
  }, [userId]);

  if (loading || !userId) {
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Nova Tarefa</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Digite uma descrição detalhada"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Adicionar Tarefa</Button>
          </div>
        </form>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 p-6">Tarefas Cadastradas</h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 p-8">
            Nenhuma tarefa cadastrada. Adicione a primeira tarefa acima.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Criado em: {new Date(task.created_at).toLocaleDateString(
                        "pt-BR",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.is_completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {task.is_completed ? "Concluída" : "Pendente"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;