import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Music, Link as LinkIcon, Download } from "lucide-react";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";
import { toast } from "sonner";

interface Material { id: string; title: string; description: string | null; type: string; url: string | null; created_at: string; }

const iconFor = (type: string) => {
  switch (type) {
    case "video": return Video;
    case "audio": return Music;
    case "link": return LinkIcon;
    default: return FileText;
  }
};

const Materials = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("materials")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const onDownload = (m: Material) => {
    // PLACEHOLDER: download real virá do Storage do Supabase
    toast.success("Download iniciado", { description: m.title });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <SEO title="Materiais" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Materiais</h1>
        <p className="text-muted-foreground mt-1">Conteúdos e recursos para complementar suas aulas.</p>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-6"><EmptyState icon={FileText} title="Nenhum material disponível" description="Em breve seu professor disponibilizará conteúdos aqui." /></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => {
            const Icon = iconFor(m.type);
            return (
              <Card key={m.id} className="hover:shadow-soft transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="capitalize ml-auto">{m.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-primary leading-snug">{m.title}</h3>
                  {m.description && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{m.description}</p>}
                  <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => onDownload(m)}>
                    <Download className="h-4 w-4 mr-2" /> Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Materials;
