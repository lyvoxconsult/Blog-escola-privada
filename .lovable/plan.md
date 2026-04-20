
# Lumina English Academy — Plano de construção

Stack adaptada: **React + Vite + TypeScript + React Router + Tailwind + shadcn/ui + Lovable Cloud (Supabase)**. Vamos rebuild completo por cima do projeto atual, em **3 fases**.

---

## Design System (base de tudo)

Tokens em `index.css` + `tailwind.config.ts`:
- `--primary`: 211 85% 15% (#0A2540 azul escuro)
- `--secondary`/info: 192 100% 42% (#00B4D8 azul claro)
- `--accent`: 174 62% 47% (#2EC4B6 verde-água)
- `--background`: 0 0% 100% / `--muted`: 210 20% 97% (#F5F7FA)
- Tipografia: Inter (sans) + Plus Jakarta Sans (display/headings)
- Radius padrão `0.75rem`, sombras suaves, transições 200–300ms
- Logo: SVG inline minimalista — "L" estilizado dentro de um círculo com arco de globo, em accent verde-água
- `StyleGuide` page para referência viva

---

## Arquitetura de pastas

```text
src/
  pages/                rotas (públicas + aluno + gestor)
  components/
    ui/                 shadcn (existente)
    layout/             Header, Footer, PublicLayout, DashboardLayout
    common/             Logo, SectionHeader, EmptyState, LoadingState
  modules/
    courses/  blog/  teachers/  student/  manager/
  context/              AuthContext, NotificationsContext
  hooks/                useAuth, useRequireRole, useToast
  services/             auth.service, courses.service, blog.service, etc.
  mocks/                courses.json, posts.json, teachers.json, lessons.json
  lib/                  utils, validators (zod schemas)
```

Princípio: **componentes UI puros**, **services** encapsulam acesso a dados (mock ou Supabase), **modules** = features de domínio.

---

## Fase 1 — Fundação + Site público (esta entrega)

1. **Limpar projeto**: remover páginas/dados do blog "Perspective", manter shadcn/ui.
2. **Design system**: tokens HSL, fontes Google, Logo, `PublicLayout` (Header sticky com nav + CTA "Matricule-se", Footer 4 colunas).
3. **Mocks** completos: 8 cursos, 5 posts blog, 6 professores, depoimentos.
4. **Páginas públicas**:
   - `/` Home — Hero (gradient sutil + CTA), 4 benefícios em grid, cursos em destaque (3 cards), 3 depoimentos, CTA secundária, Footer
   - `/sobre` — História, Missão, 4 diferenciais com ícones
   - `/cursos` — Grid + filtros (nível: A1–C2, formato: online/presencial), modal de detalhe
   - `/blog` — Lista + busca + filtro categoria + sidebar
   - `/blog/:slug` — Artigo completo + sidebar de relacionados
   - `/professores` — Grid com foto, bio curta, especialidade
   - `/contato` — Formulário validado com zod (nome, email, mensagem) + mapa placeholder + toast de sucesso
   - `/login` — Tabs Aluno/Gestor (visual; auth real vem na Fase 2)
5. **404** customizada.
6. **SEO**: `<title>` por rota via componente `SEO`, meta description, og tags, alts em todas imagens.
7. **A11y**: navegação por teclado, ARIA em menu mobile, focus rings, contraste AA.
8. **Mobile-first**: hamburger menu, breakpoints sm/md/lg testados.

Estados visuais: `LoadingState`, `EmptyState`, toasts (sonner) já no kit comum.

**Entregável Fase 1**: site público navegável, design system consistente, login só visual.

---

## Fase 2 — Auth + Área do Aluno

- Habilitar Lovable Cloud, criar tabela `profiles` (id → auth.users, full_name, role)
- Tabela `user_roles` + enum `app_role` ('aluno','gestor') + função `has_role` (security definer, segue regra anti-recursão)
- `AuthContext` com `onAuthStateChange` + `getSession`
- `ProtectedRoute` (redirect /login) e `RoleRoute` (checa role)
- Seed dos dois usuários: `aluno@lumina.com` / `gestor@lumina.com` / `123456`
- `DashboardLayout` (sidebar colapsável shadcn + topbar com sino de notificações + avatar/logout)
- Páginas aluno: `/aluno/dashboard`, `/aluno/itinerario`, `/aluno/materiais`, `/aluno/progresso` (Recharts), `/aluno/comunicacoes`, modal `Aula ao Vivo` (iframe placeholder Zoom)

---

## Fase 3 — Área do Gestor + CRUDs reais

- Tabelas Supabase: `lessons`, `materials`, `notifications`, `posts`, `students_view`
- RLS: aluno lê o seu, gestor lê/escreve tudo (via `has_role(auth.uid(),'gestor')`)
- Páginas gestor: dashboard com KPIs (Recharts), CRUD itinerários, envio de comunicações com toast, editor de conteúdo institucional, lista de alunos com filtros, blog manager (CRUD), histórico de notificações
- Placeholders de integração comentados: `// PLACEHOLDER: Stripe`, `// PLACEHOLDER: Zoom`, `// PLACEHOLDER: Resend email`

---

## Próximas integrações (documentadas no README)

Pagamentos (Stripe/Paddle), Zoom real, Resend (email), notificações push, multi-tenant SaaS.

---

**Vou começar pela Fase 1** assim que aprovar. Ao final dela, te peço aprovação para seguir para auth + áreas protegidas.
