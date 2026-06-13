"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Task = {
  id: string;
  title: string;
  created_at: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Load tasks for current user
  const fetchTasks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
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
    if (!newTitle.trim() || !user) return;

    setSubmitting(true);
    const { error } = await supabase.from("tasks").insert({
      title: newTitle.trim(),
      user_id: user.id,
    });

    if (error) {
      toast.error("Erro ao salvar tarefa");
    } else {
      toast.success("Tarefa adicionada com sucesso");
      setNewTitle("");
      setShowAddDialog(false);
      fetchTasks();
    }
    setSubmitting(false);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </Button>
        </div>

        {/* Add Task Button */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full mb-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus size={18} />
              Adicionar Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da tarefa</Label>
                <Input
                  id="title"
                  placeholder="Digite o título da tarefa"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={submitting}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTask} disabled={submitting || !newTitle.trim()}>
                  {submitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tasks List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando tarefas...</div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Nenhuma tarefa cadastrada</p>
                <p className="text-sm text-gray-400 mt-2">Clique no botão acima para adicionar sua primeira tarefa</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(task.created_at).toLocaleString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;