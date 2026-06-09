"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Transaction = {
  id: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
  categoria: string;
  data: string; // ISO date
};

const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Outros",
];

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    tipo: "receita",
    categoria: "Outros",
    data: new Date().toISOString().split("T")[0],
  });

  // Load user transactions
  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("data", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar lançamentos");
    } else {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Totals
  const totalIncome = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((sum, t) => sum + t.valor, 0);
  const totalExpense = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((sum, t) => sum + t.valor, 0);
  const balance = totalIncome - totalExpense;

  // Chart data
  const incomeExpenseData = [
    { name: "Receita", value: totalIncome },
    { name: "Despesa", value: totalExpense },
  ];

  const expenseByCategory = CATEGORIES.map((cat) => ({
    name: cat,
    value:
      transactions
        .filter((t) => t.tipo === "despesa" && t.categoria === cat)
        .reduce((s, t) => s + t.valor, 0) || 0,
  })).filter((d) => d.value > 0);

  const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#9c27b0", "#ff5722", "#607d8b", "#795548"];

  // Add new transaction
  const handleAdd = async () => {
    if (!newTx.descricao || !newTx.valor || !newTx.tipo || !newTx.categoria || !newTx.data) {
      toast.error("Preencha todos os campos");
      return;
    }

    const { error } = await supabase.from("transactions").insert({
      descricao: newTx.descricao,
      valor: Number(newTx.valor),
      tipo: newTx.tipo,
      categoria: newTx.categoria,
      data: newTx.data,
    });

    if (error) {
      toast.error("Erro ao salvar lançamento");
    } else {
      toast.success("Lançamento adicionado");
      setShowAdd(false);
      setNewTx({ tipo: "receita", categoria: "Outros", data: new Date().toISOString().split("T")[0] });
      fetchTransactions();
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowAdd(true)}>+ Novo Lançamento</Button>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatCurrency(balance)}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-red-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow p-4">
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeExpenseData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(v) => formatCurrency(v as number)} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow p-4">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma despesa registrada</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {expenseByCategory.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v as number)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Lançamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Descrição"
              value={newTx.descricao || ""}
              onChange={(e) => setNewTx({ ...newTx, descricao: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={newTx.valor?.toString() || ""}
              onChange={(e) => setNewTx({ ...newTx, valor: Number(e.target.value) })}
            />
            <Select
              value={newTx.tipo}
              onValueChange={(v) => setNewTx({ ...newTx, tipo: v as "receita" | "despesa" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newTx.categoria}
              onValueChange={(v) => setNewTx({ ...newTx, categoria: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={newTx.data?.toString() || ""}
              onChange={(e) => setNewTx({ ...newTx, data: e.target.value })}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;