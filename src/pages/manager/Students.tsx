import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Search, Eye } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

interface Student {
  id: string;
  full_name: string | null;
  created_at: string;
  lessonsCount: number;
  materialsCount: number;
  avgScore: number;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Student | null>(null);

  useEffect(() => {
    const load = async () => {
      const [profilesRes, rolesRes, lessonsRes, materialsRes, progressRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, created_at"),
        supabase.from("user_roles").select("user_id").eq("role", "aluno"),
        supabase.from("lessons").select("student_id"),
        supabase.from("materials").select("student_id"),
        supabase.from("progress").select("student_id, score"),
      ]);
      const ids = new Set((rolesRes.data ?? []).map((r) => r.user_id));
      const enriched: Student[] = (profilesRes.data ?? [])
        .filter((p) => ids.has(p.id))
        .map((p) => {
          const lessons = (lessonsRes.data ?? []).filter((l) => l.student_id === p.id).length;
          const materials = (materialsRes.data ?? []).filter((m) => m.student_id === p.id).length;
          const scores = (progressRes.data ?? []).filter((pr) => pr.student_id === p.id).map((pr) => pr.score);
          const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
          return { ...p, lessonsCount: lessons, materialsCount: materials, avgScore: avg };
        });
      setStudents(enriched);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter((x) => (x.full_name ?? "").toLowerCase().includes(s));
  }, [students, q]);

  return (
    <div className="space-y-6">
      <SEO title="Alunos — Gestor" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Alunos</h1>
        <p className="text-muted-foreground mt-1">{students.length} aluno(s) cadastrado(s).</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nome..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState icon={Users} title="Nenhum aluno encontrado" /></CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const initials = (s.full_name ?? "AL").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
            return (
              <Card key={s.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">{s.full_name ?? "Sem nome"}</p>
                      <p className="text-xs text-muted-foreground">desde {new Date(s.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted rounded-lg py-2">
                      <p className="text-lg font-bold text-primary">{s.lessonsCount}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">aulas</p>
                    </div>
                    <div className="bg-muted rounded-lg py-2">
                      <p className="text-lg font-bold text-primary">{s.materialsCount}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">materiais</p>
                    </div>
                    <div className="bg-muted rounded-lg py-2">
                      <p className="text-lg font-bold text-accent">{s.avgScore}%</p>
                      <p className="text-[10px] text-muted-foreground uppercase">score</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActive(s)}>
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> Ver detalhes
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.full_name ?? "Aluno"}</DialogTitle>
                <DialogDescription>Resumo do aluno.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono text-xs">{active.id.slice(0, 18)}...</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cadastrado em</span><span>{new Date(active.created_at).toLocaleDateString("pt-BR")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total de aulas</span><Badge variant="outline">{active.lessonsCount}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total de materiais</span><Badge variant="outline">{active.materialsCount}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Score médio</span><Badge className="bg-accent/10 text-accent border-accent/20">{active.avgScore}%</Badge></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
