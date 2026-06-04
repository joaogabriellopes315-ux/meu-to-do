"use client";

import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = supabase.auth.user();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}