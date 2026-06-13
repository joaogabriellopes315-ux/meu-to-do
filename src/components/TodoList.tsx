"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Task = {
  id: string;
  title: string;
  created_at: string;
};

type TodoListProps = {
  tasks: Task[];
  loading: boolean;
  onRefresh: () => void | Promise<void>;
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export function TodoList({ tasks, loading, onRefresh }: TodoListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Tarefas cadastradas</CardTitle>
          <CardDescription>
            {tasks.length === 1
              ? "Você tem 1 tarefa registrada."
              : `Você tem ${tasks.length} tarefas registradas.`}
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void onRefresh()}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-700">
              Nenhuma tarefa cadastrada ainda.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Use o formulário ao lado para criar sua primeira tarefa.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-slate-900">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Criada em {formatDate(task.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}