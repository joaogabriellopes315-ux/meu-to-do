import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-extrabold text-slate-950">404</h1>
        <p className="mt-4 text-lg text-slate-600">
          Esta página não existe ou foi movida.
        </p>
        <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" asChild>
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;