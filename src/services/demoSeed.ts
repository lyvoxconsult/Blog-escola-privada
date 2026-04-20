/**
 * Garante que os usuários demo existam no Lovable Cloud.
 * Roda uma única vez por device (flag em localStorage).
 * Tenta signUp dos dois usuários — se já existir, ignora.
 *
 * Demo:
 *   aluno@lumina.com / 123456
 *   gestor@lumina.com / 123456
 */
import { supabase } from "@/integrations/supabase/client";

const FLAG_KEY = "lumina:demo-seeded";

const seedUser = async (email: string, password: string, fullName: string, role: "aluno" | "gestor") => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: { full_name: fullName, role },
    },
  });
  // Se o usuário já existe, o erro será "User already registered" — ignoramos.
  if (error && !/already/i.test(error.message)) {
    console.warn(`[demo seed] ${email}:`, error.message);
  }
  // signUp pode autenticar; deslogamos para não vazar sessão
  await supabase.auth.signOut();
};

export const ensureDemoUsers = async () => {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(FLAG_KEY)) return;
  try {
    await seedUser("aluno@lumina.com", "123456", "Aluno Demo", "aluno");
    await seedUser("gestor@lumina.com", "123456", "Gestor Demo", "gestor");
    localStorage.setItem(FLAG_KEY, "1");
  } catch (e) {
    console.warn("[demo seed] failed:", e);
  }
};
