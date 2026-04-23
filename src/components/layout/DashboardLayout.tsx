import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  TrendingUp,
  Bell,
  LogOut,
  Menu,
  X,
  Users,
  Megaphone,
  FileText,
  Newspaper,
  History,
  GraduationCap,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth, type AppRole } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const studentNav = [
  { to: "/aluno/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/aluno/itinerario", label: "Itinerário", icon: CalendarDays },
  { to: "/aluno/materiais", label: "Materiais", icon: BookOpen },
  { to: "/aluno/progresso", label: "Progresso", icon: TrendingUp },
  { to: "/aluno/comunicacoes", label: "Comunicações", icon: Bell },
];

const managerNav = [
  { to: "/gestor/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/gestor/itinerarios", label: "Itinerários", icon: CalendarDays },
  { to: "/gestor/materiais", label: "Materiais", icon: BookOpen },
  { to: "/gestor/alunos", label: "Alunos", icon: Users },
  { to: "/gestor/comunicacoes", label: "Comunicações", icon: Megaphone },
  { to: "/gestor/cursos", label: "Cursos", icon: GraduationCap },
  { to: "/gestor/historico", label: "Histórico", icon: History },
  { to: "/gestor/blog", label: "Blog", icon: Newspaper },
  { to: "/gestor/conteudo", label: "Conteúdo", icon: FileText },
];

interface DashboardLayoutProps {
  role: AppRole;
}

export const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const nav = role === "gestor" ? managerNav : studentNav;
  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();
  const roleLabel = role === "gestor" ? "Gestor" : "Aluno";

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      setUnread(count ?? 0);
    };
    load();
    const channel = supabase
      .channel("notif-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border bg-card flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Navegação do painel">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-1 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center text-xs font-bold">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/40" onClick={() => setOpen(false)}>
          <aside className="w-72 max-w-[85%] h-full bg-card flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <Logo />
              <button onClick={() => setOpen(false)} className="p-2 -mr-2" aria-label="Fechar menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {nav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    )
                  }
                >
                  <Icon className="h-4 w-4" /> {label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Conteúdo */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-background/85 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-primary" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
            <span className="text-sm font-medium text-muted-foreground">Portal {roleLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="Notificações" className="relative">
              <Link to={role === "gestor" ? "/gestor/historico" : "/aluno/comunicacoes"}>
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-accent text-accent-foreground border-2 border-background text-[10px]">
                    {unread > 9 ? "9+" : unread}
                  </Badge>
                )}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 w-9 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center text-xs font-bold" aria-label="Menu do usuário">
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-xs text-muted-foreground">Logado como</div>
                  <div className="text-sm font-medium truncate max-w-[200px]">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>Site público</DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}><LogOut className="h-4 w-4 mr-2" /> Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
