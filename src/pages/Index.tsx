"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  // States
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load user and tasks
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error) {
          setTasks(data);
        } else {
          toast.error("Erro ao carregar tarefas");
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  // Refresh tasks when user changes
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error) {
          setTasks(data);
        } else {
          toast.error("Erro ao atualizar tarefas");
        }
        setLoading(false);
      };
      fetchTasks();
    }
  }, [user]);

  // Save (create or update) a task
  const handleSave = async () => {
    if (!newTaskTitle.trim() || !user) return;

    try {
      if (editingId) {
        // Update existing task
        const { error } = await supabase
          .from("tasks")
          .update({ title: newTaskTitle.trim() })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Tarefa atualizada com sucesso");
        setEditingId(null);
      } else {
        // Insert new task
        const { error } = await supabase.from("tasks").insert({
          title: newTaskTitle.trim(),
          user_id: user.id,
        });
        if (error) throw error;
        toast.success("Tarefa criada com sucesso");
      }

      // Refresh tasks list
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setTasks(data);
      setNewTaskTitle("");
    } catch (error: any) {
      toast.error(error.message ?? "Erro ao salvar tarefa");
    }
  };

  // Start editing a task
  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // Delete a task
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Tarefa removida");
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setTasks(data);
    } catch (error: any) {
      toast.error(error.message ?? "Erro ao excluir tarefa");
    }
  };

  // Render each task item
  const renderTask = (task: any) => {
    const isEditing = editingId === task.id;
    return (
      <Card className="bg-white shadow-sm mb-2 rounded-lg overflow-hidden">
        <CardContent className="p-3">
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900">{task.title}</p>
              <div className="mt-2 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(task)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(task.id)}
                >
                  Excluir                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  // Main UI  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Minha Lista de Tarefas
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {/* Task Form */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input              type="text"
              placeholder="Nova tarefa..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Salvando..." : "Adicionar"}
            </Button>
          </form>
        </div>

        {/* Tasks List */}
        {user ? (
          <>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando tarefas...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Nenhuma tarefa ainda. Crie a primeira!
                  </p>
                ) : (
                  tasks.map(renderTask)
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-10">
            <p className="text-gray-500">
              Faça login para gerenciar suas tarefas.
            </p>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center mt-12 text-sm text-gray-500">
          © {new Date().getFullYear()} Seu App Web
        </div>
      </div>
    </div>
  );
};

export default Index;