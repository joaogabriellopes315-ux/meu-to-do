import { ScrollArea } from "@/components/ui/scroll-area";
import type { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { Inbox } from "lucide-react";

type TaskListProps = {
  tasks: Task[];
  loading: boolean;
  saving: boolean;
  editingTaskId: string | null;
  editingTitle: string;
  editingDescription: string;
  editingDueDate: string;
  editingTask: Task | null;
  onEditingTitleChange: (value: string) => void;
  onEditingDescriptionChange: (value: string) => void;
  onEditingDueDateChange: (value: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: (id: string, title: string, description: string, dueDate: string) => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
};

export function TaskList({
  tasks,
  loading,
  saving,
  editingTaskId,
  editingTitle,
  editingDescription,
  editingDueDate,
  editingTask,
  onEditingTitleChange,
  onEditingDescriptionChange,
  onEditingDueDateChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-sm text-slate-500">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
            <Inbox className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-950">Nenhuma tarefa ainda</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Crie sua primeira tarefa para começar a organizar seu dia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[520px] rounded-3xl border border-slate-200 bg-white pr-4 shadow-sm">
      <div className="space-y-3 p-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            editingTitle={editingTaskId === task.id ? editingTitle : ""}
            editingDescription={editingTaskId === task.id ? editingDescription : ""}
            editingDueDate={editingTaskId === task.id ? editingDueDate : ""}
            editingTask={editingTaskId === task.id ? task : null}
            onEditingTitleChange={onEditingTitleChange}
            onEditingDescriptionChange={onEditingDescriptionChange}
            onEditingDueDateChange={onEditingDueDateChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
            loading={saving}
          />
        ))}
      </div>
    </ScrollArea>
  );
}