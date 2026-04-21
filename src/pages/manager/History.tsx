import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, History as HistoryIcon } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

interface Notif { id: string; title: string; body: string; recipient_id: string | null; created_at: string; read: boolean; }
interface Profile { id: string; full_name: string | null; }

const ManagerHistory = () => {
  const [items, setItems] = useState<Notif[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [n, p] = await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name"),
      ]);
      setItems(n.data ?? []);
      setProfiles(p.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const nameOf = (id: string | null) => id ? profiles.find((p) => p.id === id)?.full_name ?? "Aluno" : "Todos (broadcast)";
  const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <SEO title="Histórico de comunicações" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Histórico de comunicações</h1>
        <p className="text-muted-foreground mt-1">Todos os avisos enviados pela equipe.</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState icon={HistoryIcon} title="Nada enviado ainda" /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-5 flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-primary">{n.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{fmt(n.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{n.body}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">Para: {nameOf(n.recipient_id)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerHistory;
