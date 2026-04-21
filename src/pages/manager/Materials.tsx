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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, BookOpen, FileText, Headphones, Video } from "lucide-react";
import { toast } from "sonner";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

interface Material { id: string; title: string; description: string | null; type: string; url: string | null; student_id: string; }
interface Student { id: string; full_name: string | null; }

interface FormState { id?: string; title: string; description: string; type: string; url: string; student_id: string; }
const emptyForm: FormState = { title: "", description: "", type: "pdf", url: "", student_id: "" };

const iconFor = (t: string) => (t === "audio" ? Headphones : t === "video" ? Video : FileText);

const ManagerMaterials = () => {
  const [items, setItems] = useState<Material[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    setLoading(true);
    const [mRes, pRes, rRes] = await Promise.all([
      supabase.from("materials").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("user_roles").select("user_id").eq("role", "aluno"),
    ]);
    const ids = new Set((rRes.data ?? []).map((r) => r.user_id));
    setStudents((pRes.data ?? []).filter((p) => ids.has(p.id)));
    setItems(mRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(emptyForm); setOpen(true); };
  const openEdit = (m: Material) => {
    setForm({ id: m.id, title: m.title, description: m.description ?? "", type: m.type, url: m.url ?? "", student_id: m.student_id });
    setOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.student_id) return toast.error("Preencha título e aluno.");
    const payload = { title: form.title, description: form.description || null, type: form.type, url: form.url || null, student_id: form.student_id };
    const op = form.id ? supabase.from("materials").update(payload).eq("id", form.id) : supabase.from("materials").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Material atualizado" : "Material criado");
    setOpen(false); load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Material removido"); load();
  };

  const studentName = (id: string) => students.find((s) => s.id === id)?.full_name ?? "—";

  return (
    <div className="space-y-6">
      <SEO title="Materiais — Gestor" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Materiais</h1>
          <p className="text-muted-foreground mt-1">Atribua recursos de estudo aos alunos.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-accent hover:opacity-95">
              <Plus className="h-4 w-4 mr-2" /> Novo material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.id ? "Editar material" : "Novo material"}</DialogTitle>
              <DialogDescription>Atribua um recurso de estudo a um aluno.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="audio">Áudio</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Aluno *</Label>
                  <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.id.slice(0, 8)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
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
      ) : items.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState icon={BookOpen} title="Nenhum material cadastrado" /></CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((m) => {
            const Icon = iconFor(m.type);
            return (
              <Card key={m.id}>
                <CardContent className="p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="font-semibold text-primary">{m.title}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase">{m.type}</Badge>
                    </div>
                    {m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Aluno: {studentName(m.student_id)}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => openEdit(m)}>
                        <Pencil className="h-3 w-3 mr-1.5" /> Editar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1.5" /> Excluir
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover material?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(m.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagerMaterials;
