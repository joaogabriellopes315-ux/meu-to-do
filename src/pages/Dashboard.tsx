"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import type { Task } from "@/types/task";
import { CheckCircle2, ListTodo, LogOut, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);

  // Carrega tarefas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Salva tarefas no localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Carrega usuário autenticado
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    loadUser();
  }, []);

  const handleCreateTask = async (title: string, description: string, dueDate: string) => {
    if (!user) {
      toast.error("Faça login para criar tarefas.");
      return;
    }
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      toast.error("Digite um título para a tarefa.");
      return;
    }
    setSaving(true);
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      description: normalizedDescription || null,
      due_date: dueDate || null,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setSaving(false);
    toast.success("Tarefa adicionada com sucesso.");
  };

  const handleStartEdit = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
    setEditingDueDate(task.due_date?.split("T")[0] || "");
  }, []);

  const handleEditingTitleChange = useCallback((value: string) => {
    setEditingTitle(value);
  }, []);

  const handleEditingDescriptionChange = useCallback((value: string) => {
    setEditingDescription(value);
  }, []);

  const handleEditingDueDateChange = useCallback((value: string) => {
    setEditingDueDate(value);
  }, []);

  const handleSaveEdit = useCallback(
    (id: string, title: string, description: string, dueDate: string) => {
      if (!title.trim()) {
        toast.error("Digite um título para a tarefa.");
        return;
      }
      setSaving(true);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title,
                description: description || null,
                due_date: dueDate || null,
              }
            : task
        )
      );
      setSaving(false);
      toast.success("Tarefa atualizada com sucesso.");
      setEditingTaskId(null);
      setEditingTitle("");
      setEditingDescription("");
      setEditingDueDate("");
    },
    []
  );

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDueDate("");
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setSaving(true);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setSaving(false);
      toast.success("Tarefa removida com sucesso.");
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
    navigate("/login", { replace: true });
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    editing: editingTaskId ? "1 em edição" : "Nenhuma edição",
    sync: user ? "Sincronizado" : "Aguardando login",
  }), [editingTaskId, tasks.length, user]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              <ListTodo className="h-4 w-4" />
              Meu To Do
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {user?.email ?? "Organize suas tarefas com simplicidade."}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">
                Total de tarefas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-950">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">
                Edição ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-950">{stats.editing}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-500">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <p className="text-2xl font-bold text-slate-950">{stats.sync}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            <TaskForm
              onSubmit={handleCreateTask}
              loading={saving}
              isEditing={!!editingTaskId}
              initialTitle={editingTaskId ? editingTitle : ""}
              initialDescription={editingTaskId ? editingDescription : ""}
              initialDueDate={editingTaskId ? editingDueDate : ""}
              onCancel={handleCancelEdit}
            />
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Dicas rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>• Use títulos curtos e específicos.</p>
                <p>• Remova itens concluídos ou que não fazem mais sentido.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Suas tarefas
                </h2>
                <p className="text-sm text-slate-500">
                  Crie, edite e remova tarefas em tempo real.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => document.getElementById("task-title")?.focus()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova tarefa
              </Button>
            </div>
            <TaskList
              tasks={tasks}
              loading={loading}
              saving={saving}
              editingTaskId={editingTaskId}
              editingTitle={editingTitle}
              editingDescription={editingDescription}
              editingDueDate={editingDueDate}
              editingTask={tasks.find((t) => t.id === editingTaskId) || null}
              onEditingTitleChange={handleEditingTitleChange}
              onEditingDescriptionChange={handleEditingDescriptionChange}
              onEditingDueDateChange={handleEditingDueDateChange}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </div>
    </main>
  );
}