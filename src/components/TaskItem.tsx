import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/date";
import type { Task } from "@/types/task";
import { CheckCircle2, PencilLine, Trash2, Calendar } from "lucide-react";

type TaskItemProps = {
  task: Task;
  isEditing: boolean;
  editingTitle: string;
  editingTask: Task | null;
  onEditingTitleChange: (value: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

export function TaskItem({
  task,
  isEditing,
  editingTitle,
  editingTask,
  onEditingTitleChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  loading,
}: TaskItemProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSaveEdit(editingTask?.id ?? "");
  };

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="task-edit-title" className="text-slate-700">
                Título da tarefa
              </Label>
              <Input
                id="task-edit-title"
                value={editingTitle}
                onChange={(event) =>
                  onEditingTitleChange(event.target.value)
                }
                disabled={loading}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="task-edit-desc" className="text-slate-700">
                Descrição
              </Label>
              <Input
                id="task-edit-desc"
                value={task.description ?? ""}
                onChange={(event) =>
                  onEditingTitleChange(event.target.value)
                }
                disabled={loading}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="task-edit-due" className="text-slate-700">
                Data de vencimento
              </Label>
              <Input
                id="task-edit-due"
                type="date"
                value={task.due_date?.split("T")[0] ?? ""}
                onChange={(event) =>
                  onEditingTitleChange(event.target.value)
                }
                disabled={loading}
                className="mt-2"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || !editingTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? "Salvando..." : isEditing ? "Salvar alteração" : "Adicionar tarefa"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-950 truncate">
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Criada em {formatDate(task.created_at)}
              </span>
              {task.due_date && (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  Vence em {formatDate(task.due_date)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onStartEdit(task)}
              >
                <PencilLine className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onDelete(task.id)}
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