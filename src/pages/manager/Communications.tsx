import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Send, Pencil, Trash2, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/common/SEO";
import { EmptyState } from "@/components/common/EmptyState";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "lumina:communications";

// Interface para comunicado no localStorage
interface Communication {
  id: string;
  title: string;
  body: string;
  recipientId: string | null; // null = broadcast para todos
  recipientName: string;
  createdAt: string;
  read: boolean;
}

interface Student {
  id: string;
  full_name: string | null;
}

interface FormState {
  id?: string;
  title: string;
  body: string;
  recipient: string;
}

const emptyForm: FormState = {
  title: "",
  body: "",
  recipient: "all",
};

// Comunicados demo para seed
const seedCommunications: Communication[] = [
  {
    id: "comm-1",
    title: "Bem-vindo ao Lumina English Academy!",
    body: "Olá! Seja muito bem-vindo(a) à nossa escola. Estamos felizes em ter você conosco. Prepare-se para uma jornada de aprendizado incrível!",
    recipientId: null,
    recipientName: "Todos os alunos",
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "comm-2",
    title: "Nova aula disponível: Intermediate Conversation",
    body: "Uma nova aula do curso Intermediate Conversation foi disponibilizada. Acesse seu itinerário para verificar.",
    recipientId: null,
    recipientName: "Todos os alunos",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

const loadCommunications = (): Communication[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedCommunications;
  } catch {
    return seedCommunications;
  }
};

const ManagerCommunications = () => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Carregar comunicados do localStorage
    setCommunications(loadCommunications());

    // Carregar alunos do Supabase (se disponível)
    const loadStudents = async () => {
      try {
        const [profilesRes, rolesRes] = await Promise.all([
          supabase.from("profiles").select("id, full_name"),
          supabase.from("user_roles").select("user_id").eq("role", "aluno"),
        ]);
        const ids = new Set((rolesRes.data ?? []).map((r) => r.user_id));
        setStudents((profilesRes.data ?? []).filter((p) => ids.has(p.id)));
      } catch {
        // Se falhar, usa students vazio
        setStudents([]);
      }
    };
    loadStudents();
  }, []);

  const persist = (next: Communication[]) => {
    setCommunications(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const openNew = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (comm: Communication) => {
    setForm({
      id: comm.id,
      title: comm.title,
      body: comm.body,
      recipient: comm.recipientId ?? "all",
    });
    setOpen(true);
  };

  const getRecipientName = (recipientId: string | null): string => {
    if (!recipientId) return "Todos os alunos";
    const student = students.find((s) => s.id === recipientId);
    return student?.full_name ?? `Aluno (${recipientId.slice(0, 8)})`;
  };

  const save = async () => {
    if (!form.title || !form.body) {
      toast.error("Preencha título e mensagem.");
      return;
    }

    setSending(true);

    // Se não está em modo demo, tenta salvar no banco
    try {
      const recipientId = form.recipient === "all" ? null : form.recipient;
      const recipientName = getRecipientName(recipientId);

      if (form.id) {
        // Editar comunicado existente
        const next = communications.map((c) =>
          c.id === form.id
            ? { ...c, title: form.title, body: form.body, recipient: form.recipient, recipientId, recipientName }
            : c
        );
        persist(next);
        toast.success("Comunicado atualizado");
      } else {
        // Criar novo comunicado
        const newComm: Communication = {
          id: `comm-${Date.now()}`,
          title: form.title,
          body: form.body,
          recipientId,
          recipientName,
          createdAt: new Date().toISOString(),
          read: false,
        };
        persist([newComm, ...communications]);
        toast.success("Comunicado criado");

        // Tentar salvar no banco também (para produção futura)
        try {
          await supabase.from("notifications").insert({
            title: form.title,
            body: form.body,
            recipient_id: recipientId,
            read: false,
          });
        } catch {
          // Ignora erro do banco - já salvou no localStorage
        }
      }
    } catch (error) {
      toast.error("Erro ao salvar comunicado");
    } finally {
      setSending(false);
      setOpen(false);
    }
  };

  const remove = (id: string) => {
    persist(communications.filter((c) => c.id !== id));
    toast.success("Comunicado removido");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Comunicações" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Comunicações</h1>
          <p className="text-muted-foreground mt-1">Gerencie avisos e comunicações para os alunos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-accent hover:opacity-95">
              <Send className="h-4 w-4 mr-2" /> Nova mensagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{form.id ? "Editar comunicação" : "Nova comunicação"}</DialogTitle>
              <DialogDescription>Envie avisos para todos os alunos ou um aluno específico.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Destinatário</Label>
                <Select value={form.recipient} onValueChange={(v) => setForm({ ...form, recipient: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os alunos (broadcast)</SelectItem>
                    {students.length > 0 ? (
                      students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name ?? s.id.slice(0, 8)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="aluno-temp" disabled>
                        Cadastre alunos para enviar individually
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Nova aula disponível"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Mensagem *</Label>
                <Textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={5}
                  placeholder="Escreva o conteúdo do aviso..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={save} disabled={sending} className="bg-gradient-accent hover:opacity-95">
                <Send className="h-4 w-4 mr-2" />
                {sending ? "Salvando..." : form.id ? "Atualizar" : "Enviar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Comunicados */}
      {communications.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState icon={MessageSquare} title="Sem comunicações" description="Nenhuma comunicação enviada ainda." />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {communications.map((comm) => (
            <Card key={comm.id} className={!comm.read ? "border-l-4 border-l-accent" : ""}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {!comm.read && (
                      <Badge variant="default" className="text-xs bg-accent">Novo</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {comm.recipientName}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-primary">{comm.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{comm.body}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(comm.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col">
                  <Button variant="outline" size="sm" onClick={() => openEdit(comm)}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover comunicação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A comunicação "{comm.title}" será removida permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(comm.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerCommunications;