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

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    loadUser();
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      toast.error("Não foi possível carregar suas tarefas.");
      return;
    }

    setTasks(data ?? []);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`tasks:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks, user]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      editing: editingId ? "1 em edição" : "Nenhuma edição",
      sync: user ? "Sincronizado" : "Aguardando login",
    };
  }, [editingId, tasks.length, user]);

  const handleCreateTask = async (title: string) => {
    if (!user) {
      toast.error("Faça login para criar tarefas.");
      return;
    }

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      toast.error("Digite um título para a tarefa.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("tasks").insert({
      title: normalizedTitle,
      user_id: user.id,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Tarefa adicionada com sucesso.");
    await fetchTasks();
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (id: string, title: string) => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      toast.error("Digite um título para a tarefa.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("tasks")
      .update({ title: normalizedTitle })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Tarefa atualizada com sucesso.");
    cancelEdit();
    await fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    setSaving(true);

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Tarefa removida com sucesso.");
    await fetchTasks();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da conta.");
    navigate("/login", { replace: true });
  };

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
              isEditing={Boolean(editingId)}
              initialTitle={editingTitle}
              onCancel={cancelEdit}
            />

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Dicas rápidas</CardTitle>
                <CardDescription>
                  Mantenha suas tarefas objetivas e revise sua lista todos os dias.
                </CardDescription>
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

              <Button
                size="sm"
                variant="secondary"
                onClick={() => document.getElementById("task-title")?.focus()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova tarefa
              </Button>
            </div>

            <TaskList
              tasks={tasks}
              loading={loading}
              saving={saving}
              editingId={editingId}
              editingTitle={editingTitle}
              onEditingTitleChange={setEditingTitle}
              onStartEdit={startEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={cancelEdit}
              onDelete={handleDeleteTask}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;