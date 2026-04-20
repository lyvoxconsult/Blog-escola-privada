import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendarDays, Video, Clock } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

interface Lesson {
  id: string;
  title: string;
  teacher: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_url: string | null;
  status: string;
}

const Itinerary = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("lessons")
      .select("*")
      .eq("student_id", user.id)
      .order("scheduled_at", { ascending: false })
      .then(({ data }) => {
        setLessons(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <LoadingState />;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });

  const upcoming = lessons.filter((l) => new Date(l.scheduled_at) >= new Date() && l.status !== "completed");
  const past = lessons.filter((l) => new Date(l.scheduled_at) < new Date() || l.status === "completed");

  const Section = ({ title, items }: { title: string; items: Lesson[] }) => (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</h2>
      {items.length === 0 ? (
        <Card><CardContent className="p-6"><EmptyState icon={CalendarDays} title="Nada por aqui" /></CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {items.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate">{l.title}</h3>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 mt-1">
                    <span>{l.teacher}</span>
                    <span>•</span>
                    <span>{fmt(l.scheduled_at)}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {l.duration_minutes} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={l.status === "completed" ? "outline" : "secondary"} className={l.status === "completed" ? "" : "bg-accent/10 text-accent border-accent/20"}>
                    {l.status === "completed" ? "Concluída" : "Agendada"}
                  </Badge>
                  {l.status !== "completed" && (
                    <Button size="sm" onClick={() => setActive(l)} className="bg-gradient-accent hover:opacity-95">
                      <Video className="h-4 w-4 mr-1.5" /> Entrar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <SEO title="Itinerário" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Itinerário</h1>
        <p className="text-muted-foreground mt-1">Suas aulas agendadas e histórico.</p>
      </div>
      <Section title="Próximas aulas" items={upcoming} />
      <Section title="Aulas anteriores" items={past} />

      {/* Modal Aula ao Vivo */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>{active.title}</DialogTitle>
                <DialogDescription>{active.teacher} • {fmt(active.scheduled_at)}</DialogDescription>
              </DialogHeader>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-foreground flex items-center justify-center text-background">
                {/* PLACEHOLDER: integração com Zoom — substituir por iframe/zoom Web SDK */}
                <div className="text-center px-6">
                  <Video className="h-12 w-12 mx-auto mb-3 opacity-70" />
                  <p className="font-semibold">Sala de aula virtual</p>
                  <p className="text-sm text-background/60 mt-1">Integração com Zoom será conectada aqui.</p>
                  <a href={active.zoom_url ?? "#"} target="_blank" rel="noreferrer" className="inline-flex mt-4 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90">
                    Abrir Zoom em nova aba
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Itinerary;
