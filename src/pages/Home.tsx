"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

type Task = {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState<any>(null);

  // Fetch user session and tasks
  const loadUserAndTasks = async () => {
    setLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        // Redirect to login if no user
        window.location.href = "/login";
        return;
      }
      setUser(currentUser);

      // Fetch tasks for this user
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data as Task[]);
    } catch (err: any) {
      toast.error("Erro ao carregar tarefas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Digite uma tarefa válida");
      return;
    }
    if (!user) return;

    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTask.trim(),
        user_id: user.id,
      });

      if (error) throw error;
      toast.success("Tarefa adicionada!");
      setNewTask("");
      loadUserAndTasks(); // Refresh tasks
    } catch (err: any) {
      toast.error("Erro ao salvar tarefa: " + err.message);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Tarefa removida!");
      loadUserAndTasks(); // Refresh tasks
    } catch (err: any) {
      toast.error("Erro ao remover tarefa: " + err.message);
    }
  };

  // Toggle task completion (if we had a completed field, but we don't in the schema)
  // For now, we'll just note that we don't have a completed field in the tasks table.
  // If we wanted to add completion, we would need to alter the table.
  // Since the requirement doesn't mention completion, we'll skip it.

  useEffect(() => {
    loadUserAndTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
          <Button onClick={() => {
            supabase.auth.signOut();
            toast.success("Logout realizado!");
            window.location.href = "/login";
          }} className="btn-outline">
            Sair
          </Button>
        </div>

        {/* Add task form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Digite uma nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} className="btn-primary">
              Adicionar
            </Button>
          </div>
        </div>

        {/* Tasks list */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma tarefa cadastrada. Adicione uma acima!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="bg-white shadow hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center space-x-3 p-4">
                  <Checkbox className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(task.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;