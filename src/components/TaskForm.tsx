import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskFormProps = {
  onSubmit: (title: string, description: string, dueDate: string) => void | Promise<void>;
  loading?: boolean;
  isEditing?: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialDueDate?: string;
  onCancel?: () => void;
};

export function TaskForm({
  onSubmit,
  loading = false,
  isEditing = false,
  initialTitle = "",
  initialDescription = "",
  initialDueDate = "",
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setDueDate(initialDueDate);
  }, [initialTitle, initialDescription, initialDueDate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      return;
    }

    await onSubmit(normalizedTitle, normalizedDescription, dueDate);

    if (!isEditing) {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"
    >
      <div>
        <Label htmlFor="task-title" className="text-slate-700">
          {isEditing ? "Editar tarefa" : "Nova tarefa"}
        </Label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Entregar relatório semanal"
          disabled={loading}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="task-description" className="text-slate-700">
          Descrição (opcional)
        </Label>
        <Input
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Detalhes da tarefa..."
          disabled={loading}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="task-due-date" className="text-slate-700">
          Data de vencimento (opcional)
        </Label>
        <Input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          disabled={loading}
          className="mt-2"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}

        <Button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loading
            ? "Salvando..."
            : isEditing
              ? "Salvar alteração"
              : "Adicionar tarefa"}
        </Button>
      </div>
    </form>
  );
}