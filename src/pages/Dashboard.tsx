"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [user, setUser] = useState(null);

  // Get current user from Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch tasks for current user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user?.id);
        setTasks(data);
      } catch (error) {
        toast.error("Failed to load tasks");
        console.error("Supabase error:", error);
      }
    };
    fetchTasks();
  }, [user?.id]);

  // Handle task creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .insert({
          title: newTask.title,
          description: newTask.description,
          user_id: user?.id,
        });

      if (error) {
        toast.error("Failed to save task");
        console.error("Supabase error:", error);
      } else {
        toast.success("Task saved successfully");
        setNewTask({ title: "", description: "" });
        fetchTasks(); // Refresh tasks
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.name || "User"}
          </h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => setNewTask({ title: "", description: "" })}>New Task</Button>
          <Button variant="outline" onClick={() => window.location.href = "/login"}>
            Logout
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Input
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />

          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </form>

        <div className="mt-8">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600">No tasks found</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 border-b border-gray-200">
                  <h2 className="text-xl font-bold">{task.title}</h2>
                  <p className="text-gray-600">{task.description || "No description"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;