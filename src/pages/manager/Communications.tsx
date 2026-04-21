import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";

interface Student { id: string; full_name: string | null; }

const ManagerCommunications = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [recipient, setRecipient] = useState<string>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name"),
        supabase.from("user_roles").select("user_id").eq("role", "aluno"),
      ]);
      const ids = new Set((rolesRes.data ?? []).map((r) => r.user_id));
      setStudents((profilesRes.data ?? []).filter((p) => ids.has(p.id)));
    };
    load();
  }, []);

  const send = async () => {
    if (!title || !body) {
      toast.error("Preencha título e mensagem.");
      return;
    }
    setSending(true);
    let payload: { title: string; body: string; recipient_id: string | null }[] = [];
    if (recipient === "all") {
      // null = broadcast (visível a todos)
      payload = [{ title, body, recipient_id: null }];
    } else {
      payload = [{ title, body, recipient_id: recipient }];
    }
    const { error } = await supabase.from("notifications").insert(payload);
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Comunicação enviada!");
    setTitle("");
    setBody("");
    setRecipient("all");
    // PLACEHOLDER: integrar Resend para enviar email correspondente
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <SEO title="Enviar comunicação" />
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Enviar comunicação</h1>
        <p className="text-muted-foreground mt-1">Envie avisos para todos os alunos ou um aluno específico.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-accent" /> Nova mensagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Destinatário</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os alunos (broadcast)</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.id.slice(0, 8)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Nova aula disponível" />
          </div>
          <div className="space-y-1.5">
            <Label>Mensagem *</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Escreva o conteúdo do aviso..." />
          </div>
          <Button onClick={send} disabled={sending} className="bg-gradient-accent hover:opacity-95">
            <Send className="h-4 w-4 mr-2" /> {sending ? "Enviando..." : "Enviar comunicação"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerCommunications;
