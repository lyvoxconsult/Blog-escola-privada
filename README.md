# 🎓 Lumina English Academy

> Sistema completo de gestão escolar — Plataforma web moderna com área pública de marketing, portal do aluno e painel do gestor.

[![Deploy Status](https://img.shields.io/badge/deploy-lovable-brightgreen)](https://lovable.dev/projects/7410f81b-8218-4f2d-bb32-1ba1f84eabb2)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## ✨ Visão Geral

A **Lumina English Academy** é uma plataforma web completa para escolas de inglês internacional, oferecendo:

- 🌐 **Área pública** — Landing page, blog, cursos, professores e contato
- 👨‍🎓 **Portal do aluno** — Dashboard pessoal, itinerário, materiais, progresso e comunicações
- 📊 **Painel do gestor** — KPIs, gestão de alunos, cursos, comunicações e blog

### Números

| Métrica | Valor |
|---------|-------|
| Alunos formados | 12.000+ |
| Países de origem (professores) | 6 |
| Avaliação média | 4.9★ |
| Ano de fundação | 2015 |

---

## 🚀 Quick Start

```bash
# Clonar repositório
git clone https://github.com/lyvoxconsult/Blog-escola-privada.git
cd Blog-Escola-Privada

# Instalar dependências
npm install

# Iniciar desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🔑 Credenciais Demo

O projeto inclui usuários de demonstração que funcionam sem necessidade de banco de dados configurado:

| Email | Senha | Perfil | Descrição |
|-------|-------|--------|-----------|
| `gestor@lumina.com` | `123456` | Gestor | Painel completo de gestão |
| `aluno@lumina.com` | `123456` | Aluno | Portal pessoal do aluno |

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Runtime | React | 18.3.1 |
| Linguagem | TypeScript | 5.8.3 |
| Build | Vite | 5.4.19 |
| UI | shadcn/ui + Tailwind CSS | 3.4.17 |
| State | TanStack Query | 5.83.0 |
| Router | React Router | 6.30.1 |
| Auth | Supabase JS | 2.103.3 |
| Forms | React Hook Form + Zod | 7.61.1 / 3.25.76 |
| Charts | Recharts | 3.8.1 |
| Icons | Lucide React | 0.462.0 |
| Database | Supabase (PostgreSQL) | - |

---

## 📁 Estrutura do Projeto

```
src/
├── App.tsx                          # Rotas do aplicativo
├── constants/
│   └── index.ts                     # Roles, rotas, demo users
├── types/
│   └── index.ts                     # Interfaces compartilhadas
├── context/
│   └── AuthContext.tsx              # Autenticação + modo demo
├── services/
│   ├── courses.ts                   # CRUD de cursos
│   ├── communications.ts            # CRUD de comunicações
│   ├── demoSeed.ts                  # Seed de usuários demo
│   └── studentSeed.ts               # Dados mock para aluno
├── mocks/
│   ├── courses.ts                   # Dados de cursos
│   ├── posts.ts                     # Posts do blog
│   └── teachers.ts                  # Professores
├── integrations/
│   └── supabase/
│       ├── client.ts                # Cliente Supabase
│       └── types.ts                 # Tipos gerados
├── pages/
│   ├── Home.tsx                     # Landing page
│   ├── About.tsx                    # Sobre
│   ├── Courses.tsx                  # Cursos
│   ├── Blog.tsx                     # Blog
│   ├── BlogPost.tsx                 # Post individual
│   ├── Teachers.tsx                # Professores
│   ├── Contact.tsx                 # Contato
│   ├── Login.tsx                    # Login
│   └── NotFound.tsx                 # 404
│
│   ├── student/                     # Área do aluno
│   │   ├── Dashboard.tsx            # Dashboard pessoal
│   │   ├── Itinerary.tsx            # Aulas agendadas
│   │   ├── Materials.tsx            # Materiais de estudo
│   │   ├── Progress.tsx             # Progresso acadêmico
│   │   └── Communications.tsx       # Notificações
│   │
│   └── manager/                     # Área do gestor
│       ├── Dashboard.tsx            # KPIs e gráficos
│       ├── Itineraries.tsx          # Gestão de aulas
│       ├── Communications.tsx        # Comunicações
│       ├── Students.tsx             # Lista de alunos
│       ├── Materials.tsx            # Gestão de materiais
│       ├── History.tsx              # Histórico
│       ├── Content.tsx             # Conteúdo institucional
│       └── Blog.tsx                 # Gestão do blog
│
├── components/
│   ├── ui/                         # Componentes Shadcn/UI (~50)
│   ├── layout/
│   │   ├── PublicLayout.tsx         # Layout páginas públicas
│   │   ├── Header.tsx              # Header
│   │   ├── Footer.tsx               # Rodapé
│   │   └── DashboardLayout.tsx      # Layout dashboard
│   ├── common/
│   │   ├── SEO.tsx                 # Meta tags
│   │   ├── Logo.tsx                # Logo
│   │   ├── LoadingState.tsx        # Loading
│   │   ├── EmptyState.tsx          # Empty
│   │   └── SectionHeader.tsx       # Section header
│   └── auth/
│       └── ProtectedRoute.tsx       # Proteção de rotas
└── hooks/
    ├── use-mobile.tsx               # Detectar mobile
    └── use-toast.ts                # Toast
```

---

## 🛣️ Sistema de Rotas

### Área Pública

| Caminho | Descrição |
|---------|-----------|
| `/` | Landing page com CTA |
| `/sobre` | Sobre a escola |
| `/cursos` | Listagem de cursos |
| `/blog` | Posts do blog |
| `/blog/:slug` | Post individual |
| `/professores` | Professores |
| `/contato` | Formulário de contato |
| `/login` | Login/Cadastro |

### Portal do Aluno (role: `aluno`)

| Caminho | Descrição |
|---------|-----------|
| `/aluno/dashboard` | Dashboard pessoal |
| `/aluno/itinerario` | Aulas agendadas |
| `/aluno/materiais` | Materiais de estudo |
| `/aluno/progresso` | Progresso acadêmico |
| `/aluno/comunicacoes` | Notificações |

### Painel do Gestor (role: `gestor`)

| Caminho | Descrição |
|---------|-----------|
| `/gestor/dashboard` | KPIs e gráficos |
| `/gestor/itinerarios` | Gestão de aulas |
| `/gestor/comunicacoes` | Comunicações |
| `/gestor/alunos` | Lista de alunos |
| `/gestor/materiais` | Gestão de materiais |
| `/gestor/historico` | Histórico |
| `/gestor/conteudo` | Conteúdo institucional |
| `/gestor/blog` | Gestão do blog |

---

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto funciona em **modo demo** sem configuração adicional. Para produção:

```bash
# .env
VITE_SUPABASE_PROJECT_ID="seu-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-chave-publicavel"
VITE_SUPABASE_URL="https://seu-project.supabase.co"
```

---

## 📊 Features Implementadas

### Portal do Aluno

- ✅ Dashboard pessoal com KPIs
- ✅ Itinerário de aulas
- ✅ Materiais de estudo
- ✅ Progresso por habilidade (com gráficos)
- ✅ Comunicações/notificações

### Painel do Gestor

- ✅ Dashboard com KPIs e gráficos (Recharts)
- ✅ Gestão de alunos (CRUD)
- ✅ Gestão de cursos
- ✅ Gestão de comunicações (broadcast)
- ✅ Gestão de materiais
- ✅ Agenda de aulas/itinerários
- ✅ Blog e conteúdo institucional
- ✅ Histórico de notificações

### Sistema

- ✅ Autenticação via Supabase (email/password)
- ✅ Sistema de roles (aluno/gestor)
- ✅ Row Level Security (RLS)
- ✅ Modo demo funcional
- ✅ SEO otimizado
- ✅ Design responsivo
- ✅ Dark/Light mode

---

## 🗄️ Banco de Dados

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuário |
| `user_roles` | Roles (aluno/gestor) |
| `courses` | Cursos disponíveis |
| `lessons` | Aulas agendadas |
| `materials` | Materiais dos alunos |
| `notifications` | Notificações/comunicações |
| `progress` | Progresso por habilidade |
| `posts` | Posts do blog |
| `site_content` | Conteúdo institucional |

### Roles e Permissões

| Role | Leitura | Escrita | Gestão |
|------|---------|--------|--------|
| **aluno** | Próprios dados | Próprios dados | Próprios dados |
| **gestor** | Todos | Todos | Todos |

---

## 🧪 Comandos

```bash
# Desenvolvimento
npm run dev              # Iniciar dev server

# Build
npm run build            # Build para produção
npm run build:dev        # Build development

# Linting
npm run lint             # Verificar código

# Preview
npm run preview          # Preview do build
```

---

## 📦 Deploy

### Via Lovable (Recomendado)

O deploy acontece automaticamente via Lovable:

1. Faça push para o repositório
2. Aguarde o deploy automático
3. Teste em produção

**URL do projeto Lovable:**
https://lovable.dev/projects/7410f81b-8218-4f2d-bb32-1ba1f84eabb2

### Via Vercel

```bash
npm i -g vercel
vercel --prod
```

---

## 🔮 Roadmap

- [ ] Sistema de pagamentos
- [ ] Upload de imagens (Supabase Storage)
- [ ] Testes automatizados (Vitest + Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] PWA (service worker)
- [ ] App mobile (React Native)
- [ ] Integração com Zoom/Meet

---

## 📝 Documentação Adicional

- [Documentação Técnica](./DOCUMENTATION.md)
- [Changelog](./CHANGELOG.md)

---

## 📄 Licença

MIT License — [LICENSE](./LICENSE)

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

*Desenvolvido com 💜 para a Lumina English Academy*