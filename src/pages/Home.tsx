"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CheckSquare, Square, Plus } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  user_id: string;
  created_at?: string;
};

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  // Load user's tasks
  const fetchTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar tarefas");
      console.error(error);
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  // Add new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !currentUser) {
      toast.error("Digite o título da tarefa");
      return;
    }

    const { error } = await supabase.from("tasks").insert({
      title: newTaskTitle.trim(),
      user_id: currentUser.id,
      completed: false,
    });

    if (error) {
      toast.error("Erro ao adicionar tarefa");
      console.error(error);
    } else {
      toast.success("Tarefa adicionada com sucesso");
      setNewTaskTitle("");
      setShowAdd(false);
      fetchTasks();
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
    } else {
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      toast.error("Erro ao excluir tarefa");
    } else {
      toast.success("Tarefa excluída");
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Tarefas</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      {/* Tasks Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Total de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{tasks.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-green-600">
              {tasks.filter(t => t.completed).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-orange-600">
              {tasks.filter(t => !t.completed).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma tarefa cadastrada</p>
            <p className="text-gray-400">Clique em "Nova Tarefa" para começar</p>
          </div>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="bg-white shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task)}
                  />
                  <span className={task.completed ? "line-through text-gray-400" : ""}>
                    {task.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="w-4 h-4" />
                  </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Digite o título da tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
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