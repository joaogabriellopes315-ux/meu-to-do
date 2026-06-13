"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TodoFormProps = {
  userId: string;
  onTaskCreated: () => void | Promise<void>;
};

export function TodoForm({ userId, onTaskCreated }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const taskTitle = title.trim();

    if (!taskTitle) {
      toast.error("Digite o nome da tarefa antes de salvar.");
      return;
    }

    if (!userId) {
      toast.error("Usuário não identificado. Faça login novamente.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("tasks").insert({
      title: taskTitle,
      user_id: userId,
    });

    if (error) {
      toast.error("Não foi possível criar a tarefa. Tente novamente.");
      setSaving(false);
      return;
    }

    toast.success("Tarefa criada com sucesso.");
    setTitle("");
    setSaving(false);

    await onTaskCreated();
  };

  return (
    <Card id="nova-tarefa" className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-indigo-600" />
          Nova tarefa
        </CardTitle>
        <CardDescription>
          Adicione uma nova tarefa para sua lista pessoal.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex.: Finalizar relatório"
            disabled={saving}
          />

          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Salvando..." : "Salvar tarefa"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}