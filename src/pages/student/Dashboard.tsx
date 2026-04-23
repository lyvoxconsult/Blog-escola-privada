import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BookOpen, TrendingUp, Bell, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { seedStudentDataIfEmpty } from "@/services/studentSeed";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";
import { countUnreadCommunications, loadCommunications } from "@/services/communications";

interface Lesson { id: string; title: string; teacher: string; scheduled_at: string; }

const StudentDashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<{id: string; title: string; body: string}[]>([]);
  const [overall, setOverall] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      await seedStudentDataIfEmpty(user.id);

      // Carregar do Supabase (lessons e progress)
      const [{ data: l }, { data: p }] = await Promise.all([
        supabase.from("lessons").select("id,title,teacher,scheduled_at").eq("student_id", user.id).gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(3),
        supabase.from("progress").select("score").eq("student_id", user.id),
      ]);
      setLessons(l ?? []);
      if (p && p.length) setOverall(Math.round(p.reduce((a, b) => a + b.score, 0) / p.length));

      // Carregar comunicações do serviço centralizado
      const allComms = loadCommunications();
      const userComms = allComms.filter(c => c.recipientId === null || c.recipientId === user.id);
      
      // Contar não lidos
      setUnreadCount(countUnreadCommunications(user.id));
      
      // Pegar os 4 mais recentes
      setRecentNotifs(userComms.slice(0, 4).map(c => ({ id: c.id, title: c.title, body: c.body })));

      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <LoadingState />;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <SEO title="Dashboard do Aluno" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Olá, {user?.email?.split("@")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Veja seu progresso e próximos compromissos.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Progresso geral</span>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary">{overall}%</div>
            <Progress value={overall} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Próximas aulas</span>
              <CalendarDays className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary">{lessons.length}</div>
            <p className="text-xs text-muted-foreground mt-1">agendadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avisos novos</span>
              <Bell className="h-4 w-4 text-accent" />
            </div>
            <div className="text-3xl font-bold text-primary">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-1">não lidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Próximas aulas */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-primary">Próximas aulas</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/aluno/itinerario">Ver tudo <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
            {lessons.length === 0 ? (
              <EmptyState icon={CalendarDays} title="Sem aulas agendadas" description="Aguarde a próxima programação do gestor." />
            ) : (
              <ul className="divide-y divide-border">
                {lessons.map((l) => (
                  <li key={l.id} className="py-3 flex items-center gap-4">
                    <div className="h-11 w-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.teacher} • {fmt(l.scheduled_at)}</p>
                    </div>
                    <Badge variant="outline" className="text-accent border-accent/30 hidden sm:inline-flex"><Sparkles className="h-3 w-3 mr-1" /> Agendada</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-display font-semibold text-primary mb-4">Avisos recentes</h2>
            {recentNotifs.length === 0 ? (
              <EmptyState icon={Bell} title="Sem avisos" />
            ) : (
              <ul className="space-y-4">
                {recentNotifs.map((n) => (
                  <li key={n.id} className="text-sm">
                    <p className="font-medium text-primary">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-gradient-hero text-primary-foreground border-0">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div>
            <h3 className="font-display font-semibold text-xl">Continue de onde parou</h3>
            <p className="text-primary-foreground/80 text-sm mt-1">Revise seus materiais ou explore o próximo módulo.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/aluno/materiais"><BookOpen className="h-4 w-4 mr-2" /> Materiais</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/aluno/progresso">Meu progresso</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;