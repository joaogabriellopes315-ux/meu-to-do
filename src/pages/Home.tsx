"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/format";

type Task = {
  id: string;
  title: string;
  created_at: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user] = supabase.auth.user();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load tasks for current user
  const fetchTasks = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
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
  }, [user]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      setError("A tarefa precisa ter um título");
      return;
    }

    try {
      const { data, error } = await supabase.from("tasks").insert({
        title: newTitle.trim(),
        user_id: user.id,
      });

      if (error) {
        toast.error("Erro ao salvar tarefa");
        console.error("Supabase insert error:", error);
        return;
      }

      toast.success("Tarefa adicionada com sucesso");
      setNewTitle("");
      setSuccess("Tarefa adicionada");
      fetchTasks(); // Refresh tasks    } catch (err: any) {
      toast.error(err.message ?? "Erro inesperado");
      console.error("Unexpected error:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {success && (
              <p className="text-green-600 font-medium mb-2">
                {success}
              </p>
            )}
            Nenhuma tarefa cadastrada. Adicione uma nova tarefa abaixo.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="py-2">
                <Card className="bg-white shadow-sm">
                  <CardContent>
                    <p className="text-sm text-gray-600">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(task.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTask}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;