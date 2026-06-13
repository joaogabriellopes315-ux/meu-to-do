"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load tasks from Supabase
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tarefas");
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create new task
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Digite o título da tarefa");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTaskTitle.trim(),
        completed: false,
      });

      if (error) {
        toast.error("Erro ao criar tarefa");
        console.error("Supabase insert error:", error);
        return;
      }

      toast.success("Tarefa criada com sucesso");
      setNewTaskTitle("");
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message ?? "Erro inesperado ao criar tarefa");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir tarefa");
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("Tarefa excluída");
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>

      {/* Create Task */}
      <Card className="bg-white shadow mb-6">
        <CardHeader>
          <CardTitle>Criar Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Digite o título da tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isSaving}
              className="flex-1"
            />
            <Button onClick={handleCreateTask} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="bg-white shadow">
        <CardHeader>
          <CardTitle>Minhas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Carregando tarefas...</p>
          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma tarefa criada ainda</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                  />
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;