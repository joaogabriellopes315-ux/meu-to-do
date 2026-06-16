import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/date";
import type { Task } from "@/types/task";
import { CheckCircle2, PencilLine, Trash2 } from "lucide-react";

type TaskItemProps = {
  task: Task;
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (value: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: (id: string, title: string) => void | Promise<void>;
  onCancelEdit: () => void;
  onDelete: (id: string) => void | Promise<void>;
  loading?: boolean;
};

export function TaskItem({
  task,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  loading = false,
}: TaskItemProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSaveEdit(task.id, editingTitle);
  };

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor={`task-edit-${task.id}`} className="text-slate-700">
                Título da tarefa
              </Label>
              <Input
                id={`task-edit-${task.id}`}
                value={editingTitle}
                onChange={(event) => onEditingTitleChange(event.target.value)}
                disabled={loading}
                className="mt-2"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancelEdit}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !editingTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-base font-semibold text-slate-950">
                  {task.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Criada em {formatDate(task.created_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onStartEdit(task)}
                disabled={loading}
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onDelete(task.id)}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}