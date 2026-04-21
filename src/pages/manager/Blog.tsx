import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { posts as seedPosts, type Post } from "@/mocks/posts";
import { EmptyState } from "@/components/common/EmptyState";
import { SEO } from "@/components/common/SEO";

/**
 * Blog Manager — CRUD local (mock) sobre os posts.
 * PLACEHOLDER: migrar para tabela `posts` no banco em próxima fase.
 */
const STORAGE_KEY = "lumina:posts";

const loadPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedPosts;
  } catch {
    return seedPosts;
  }
};

interface FormState { id?: string; slug: string; title: string; excerpt: string; content: string; category: string; author: string; tags: string; }
const emptyForm: FormState = { slug: "", title: "", excerpt: "", content: "", category: "Aprendizado", author: "Equipe Lumina", tags: "" };

const ManagerBlog = () => {
  const [items, setItems] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => { setItems(loadPosts()); }, []);

  const persist = (next: Post[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openNew = () => { setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Post) => {
    setForm({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author, tags: p.tags.join(", ") });
    setOpen(true);
  };

  const save = () => {
    if (!form.title || !form.excerpt || !form.content) return toast.error("Preencha título, resumo e conteúdo.");
    const slug = form.slug || slugify(form.title);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const authorInitials = form.author.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    if (form.id) {
      const next = items.map((p) => p.id === form.id ? { ...p, slug, title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, author: form.author, authorInitials, tags } : p);
      persist(next);
      toast.success("Post atualizado");
    } else {
      const newPost: Post = {
        id: `p-${Date.now()}`,
        slug, title: form.title, excerpt: form.excerpt, content: form.content,
        category: form.category, author: form.author, authorInitials,
        publishedAt: new Date().toISOString().slice(0, 10),
        readingTime: Math.max(2, Math.round(form.content.split(" ").length / 200)),
        tags,
      };
      persist([newPost, ...items]);
      toast.success("Post publicado");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    persist(items.filter((p) => p.id !== id));
    toast.success("Post removido");
  };

  return (
    <div className="space-y-6">
      <SEO title="Blog Manager" />
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Blog Manager</h1>
          <p className="text-muted-foreground mt-1">Gerencie os artigos publicados.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-accent hover:opacity-95">
              <Plus className="h-4 w-4 mr-2" /> Novo post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? "Editar post" : "Novo post"}</DialogTitle>
              <DialogDescription>Preencha os campos para publicar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Título *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-gerado se vazio" />
                </div>
                <div className="space-y-1.5">
                  <Label>Categoria</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Autor</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Resumo *</Label>
                <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Conteúdo (Markdown) *</Label>
                <Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Tags (separadas por vírgula)</Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save} className="bg-gradient-accent hover:opacity-95">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-8"><EmptyState icon={Newspaper} title="Sem posts" /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-primary">{p.title}</h3>
                    <Badge variant="outline" className="text-xs">{p.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.author} • {p.publishedAt} • {p.readingTime} min</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
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
                        <AlertDialogTitle>Remover post?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(p.id)}>Excluir</AlertDialogAction>
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

export default ManagerBlog;
