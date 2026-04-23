import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, History as HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";
import { loadCommunications, type Communication } from "@/services/communications";

const ManagerHistory = () => {
  const [items, setItems] = useState<Communication[]>([]);

  useEffect(() => {
    // Carregar comunicados do serviço centralizado (mesma fonte que Communications Manager)
    setItems(loadCommunications());
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Histórico de comunicações" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Histórico de comunicações</h1>
        <p className="text-muted-foreground mt-1">Todos os avisos enviados pela equipe.</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState icon={HistoryIcon} title="Nada enviado ainda" />
          </CardContent>
        </Card>
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{n.body}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      Para: {n.recipientName}
                    </Badge>
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