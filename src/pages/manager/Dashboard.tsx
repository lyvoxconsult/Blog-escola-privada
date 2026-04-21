import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, BookOpen, Megaphone, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { LoadingState } from "@/components/common/LoadingState";
import { SEO } from "@/components/common/SEO";

interface Kpis {
  students: number;
  upcomingLessons: number;
  totalMaterials: number;
  notificationsSent: number;
  avgScore: number;
}

const ManagerDashboard = () => {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [skillsData, setSkillsData] = useState<{ skill: string; média: number }[]>([]);
  const [lessonsByMonth, setLessonsByMonth] = useState<{ month: string; agendadas: number; concluídas: number }[]>([]);

  useEffect(() => {
    const load = async () => {
      const [studentsRes, lessonsRes, materialsRes, notifsRes, progressRes, lessonsAllRes] = await Promise.all([
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "aluno"),
        supabase.from("lessons").select("*", { count: "exact", head: true }).gte("scheduled_at", new Date().toISOString()),
        supabase.from("materials").select("*", { count: "exact", head: true }),
        supabase.from("notifications").select("*", { count: "exact", head: true }),
        supabase.from("progress").select("skill, score"),
        supabase.from("lessons").select("scheduled_at, status"),
      ]);

      // Médias por skill
      const grouped: Record<string, { sum: number; n: number }> = {};
      (progressRes.data ?? []).forEach((p) => {
        if (!grouped[p.skill]) grouped[p.skill] = { sum: 0, n: 0 };
        grouped[p.skill].sum += p.score;
        grouped[p.skill].n += 1;
      });
      const skills = Object.entries(grouped).map(([skill, v]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        média: Math.round(v.sum / v.n),
      }));
      setSkillsData(skills);

      const allScores = (progressRes.data ?? []).map((p) => p.score);
      const avgScore = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

      // Aulas por mês (últimos 6 meses)
      const months: Record<string, { agendadas: number; concluídas: number }> = {};
      const monthLabel = (d: Date) => d.toLocaleString("pt-BR", { month: "short" });
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months[monthLabel(d)] = { agendadas: 0, concluídas: 0 };
      }
      (lessonsAllRes.data ?? []).forEach((l) => {
        const d = new Date(l.scheduled_at);
        const key = monthLabel(d);
        if (months[key]) {
          if (l.status === "completed") months[key].concluídas += 1;
          else months[key].agendadas += 1;
        }
      });
      setLessonsByMonth(Object.entries(months).map(([month, v]) => ({ month, ...v })));

      setKpis({
        students: studentsRes.count ?? 0,
        upcomingLessons: lessonsRes.count ?? 0,
        totalMaterials: materialsRes.count ?? 0,
        notificationsSent: notifsRes.count ?? 0,
        avgScore,
      });
    };
    load();
  }, []);

  if (!kpis) return <LoadingState label="Carregando indicadores..." />;

  const cards = [
    { label: "Alunos ativos", value: kpis.students, icon: Users, color: "text-secondary bg-secondary/10" },
    { label: "Próximas aulas", value: kpis.upcomingLessons, icon: CalendarDays, color: "text-accent bg-accent/10" },
    { label: "Materiais", value: kpis.totalMaterials, icon: BookOpen, color: "text-primary bg-primary/10" },
    { label: "Comunicações", value: kpis.notificationsSent, icon: Megaphone, color: "text-secondary bg-secondary/10" },
    { label: "Score médio", value: `${kpis.avgScore}%`, icon: TrendingUp, color: "text-accent bg-accent/10" },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Painel do Gestor" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Visão geral</h1>
        <p className="text-muted-foreground mt-1">Indicadores em tempo real da escola.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-primary">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Médias por habilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="skill" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="média" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aulas nos últimos 6 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lessonsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="agendadas" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="concluídas" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
