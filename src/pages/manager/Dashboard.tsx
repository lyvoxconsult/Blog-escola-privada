import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/common/LoadingState";

/** Placeholder — Fase 3 vai expandir para dashboard de gestor completo. */
const ManagerDashboard = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role !== "gestor") navigate("/aluno/dashboard");
  }, [role, loading, navigate]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Dashboard do Gestor</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo ao painel administrativo.</p>
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <h2 className="font-display font-semibold text-lg text-primary">Em breve: Fase 3</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          KPIs, CRUD de itinerários, envio de comunicações em massa, gestão de alunos e blog manager serão liberados na próxima fase.
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
