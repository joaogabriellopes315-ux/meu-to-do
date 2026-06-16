import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskFormProps = {
  onSubmit: (title: string) => void | Promise<void>;
  loading?: boolean;
  isEditing?: boolean;
  initialTitle?: string;
  onCancel?: () => void;
};

export function TaskForm({
  onSubmit,
  loading = false,
  isEditing = false,
  initialTitle = "",
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    await onSubmit(normalizedTitle);

    if (!isEditing) {
      setTitle("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="space-y-3">
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
      </div>
    </form>
  );
}