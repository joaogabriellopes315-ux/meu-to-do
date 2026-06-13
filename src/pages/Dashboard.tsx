"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, LogOut, CheckCircle, Circle } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const user = supabase.auth.user();

  const fetchTasks = async () => {
    if (!user) return;
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

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Descrição da tarefa é obrigatória");
      return;
    }
    if (!user) return;

    setAdding(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        title: newTaskTitle.trim(),
        user_id: user.id,
        completed: false,
        created_at: new Date().toISOString(),
      });
      if (error) {
        toast.error("Erro ao salvar tarefa");
      } else {
        toast.success("Tarefa adicionada!");
        setNewTaskTitle("");
        setShowAdd(false);
        fetchTasks();
      }
    } catch (err) {
      toast.error("Erro inesperado");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (task: Task) => {
    if (!user) return;
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Erro ao atualizar tarefa");
    } else {
      fetchTasks();
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Erro ao excluir tarefa");
    } else {
      toast.success("Tarefa excluída");
      fetchTasks();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Minhas Tarefas</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {pendingTasks} pendente{pendingTasks !== 1 ? "s" : ""} • {completedTasks} concluída{completedTasks !== 1 ? "s" : ""}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Add Task Button */}
          <div className="mb-6">
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start gap-2" onClick={() => setShowAdd(true)}>
                  <Plus className="h-5 w-5" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Adicionar Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="O que precisa ser feito?"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    disabled={adding}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
                    <Button onClick={handleAdd} disabled={adding}>
                      {adding ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="py-12 text-center">
                  <Circle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Nenhuma tarefa cadastrada</p>
                  <p className="text-sm text-gray-400 mt-1">Clique em "Nova Tarefa" para começar</p>
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(task)}
                        className={task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"}
                        aria-label={task.completed ? "Marcar como pendente" : "Marcar como concluída"}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 fill-current" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </Button>
                      <span
                        className={`flex-1 text-lg ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}
                      >
                        {task.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Excluir tarefa"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;