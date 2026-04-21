import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
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
  student_id: string;
}

interface Student {
  id: string;
  full_name: string | null;
}

interface FormState {
  id?: string;
  title: string;
  teacher: string;
  scheduled_at: string;
  duration_minutes: number;
  zoom_url: string;
  student_id: string;
  status: string;
}

const emptyForm: FormState = {
  title: "",
  teacher: "",
  scheduled_at: "",
  duration_minutes: 60,
  zoom_url: "",
  student_id: "",
  status: "scheduled",
};

const Itineraries = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    setLoading(true);
    const [lessonsRes, profilesRes, rolesRes] = await Promise.all([
      supabase.from("lessons").select("*").order("scheduled_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("user_roles").select("user_id").eq("role", "aluno"),
    ]);
    const studentIds = new Set((rolesRes.data ?? []).map((r) => r.user_id));
    setStudents((profilesRes.data ?? []).filter((p) => studentIds.has(p.id)));
    setLessons(lessonsRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (l: Lesson) => {
    setForm({
      id: l.id,
      title: l.title,
      teacher: l.teacher,
      scheduled_at: new Date(l.scheduled_at).toISOString().slice(0, 16),
      duration_minutes: l.duration_minutes,
      zoom_url: l.zoom_url ?? "",
      student_id: l.student_id,
      status: l.status,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.teacher || !form.scheduled_at || !form.student_id) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const payload = {
      title: form.title,
      teacher: form.teacher,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      duration_minutes: form.duration_minutes,
      zoom_url: form.zoom_url || null,
      student_id: form.student_id,
      status: form.status,
    };
    const op = form.id
      ? supabase.from("lessons").update(payload).eq("id", form.id)
      : supabase.from("lessons").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Aula atualizada" : "Aula criada");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Aula removida");
    load();
  };

  const studentName = (id: string) => students.find((s) => s.id === id)?.full_name ?? "—";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <SEO title="Itinerários — Gestor" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Itinerários</h1>
          <p className="text-muted-foreground mt-1">Gerencie as aulas agendadas dos alunos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-accent hover:opacity-95">
              <Plus className="h-4 w-4 mr-2" /> Nova aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{form.id ? "Editar aula" : "Nova aula"}</DialogTitle>
              <DialogDescription>Preencha os detalhes da aula.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Professor *</Label>
                  <Input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Aluno *</Label>
                <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione um aluno" /></SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.id.slice(0, 8)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Data e hora *</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Agendada</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Link Zoom</Label>
                <Input value={form.zoom_url} onChange={(e) => setForm({ ...form, zoom_url: e.target.value })} placeholder="https://zoom.us/j/..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save} className="bg-gradient-accent hover:opacity-95">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <LoadingState />
      ) : lessons.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState icon={CalendarDays} title="Nenhuma aula cadastrada" /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-primary">{l.title}</h3>
                    <Badge variant="outline" className="text-xs">{l.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {l.teacher} • {fmt(l.scheduled_at)} • {l.duration_minutes} min
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Aluno: {studentName(l.student_id)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(l)}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover aula?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(l.id)}>Excluir</AlertDialogAction>
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

export default Itineraries;
