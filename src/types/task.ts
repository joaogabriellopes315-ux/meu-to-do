export type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  user_id: string;
  created_at: string;
};