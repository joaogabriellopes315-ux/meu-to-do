"use client";

import { Navigate } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo!</h1>
        <p className="text-gray-600">Você será redirecionado para o Dashboard em breve...</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Acesse o Dashboard agora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;