import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

interface Notif { id: string; title: string; body: string; created_at: string; read: boolean; }

const Communications = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id,title,body,created_at,read")
        .or(`recipient_id.eq.${user.id},recipient_id.is.null`)
        .order("created_at", { ascending: false });
      setItems(data ?? []);
      setLoading(false);

      // Marca como lidas
      const unread = (data ?? []).filter((n) => !n.read).map((n) => n.id);
      if (unread.length) {
        await supabase.from("notifications").update({ read: true }).in("id", unread);
      }
    };
    load();
  }, [user]);

  const fmt = (iso: string) => new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <SEO title="Comunicações" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Comunicações</h1>
        <p className="text-muted-foreground mt-1">Avisos enviados pela equipe Lumina.</p>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-6"><EmptyState icon={Bell} title="Sem comunicações" description="Quando houver avisos, aparecerão aqui." /></CardContent></Card>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communications;
