/**
 * Cria dados de exemplo (lessons, materials, notifications, progress)
 * para o usuário logado caso ele não tenha nenhum registro ainda.
 * Útil para a experiência demo sem precisar de gestor inserindo manualmente.
 */
import { supabase } from "@/integrations/supabase/client";

export const seedStudentDataIfEmpty = async (userId: string) => {
  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("student_id", userId);

  if ((count ?? 0) > 0) return;

  const now = new Date();
  const inDays = (d: number, h = 19, m = 0) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString();
  };

  await supabase.from("lessons").insert([
    { student_id: userId, title: "Conversation Class — Travel Vocabulary", teacher: "James O'Connor", scheduled_at: inDays(1), zoom_url: "https://zoom.us/j/placeholder" },
    { student_id: userId, title: "Grammar Workshop — Present Perfect", teacher: "Sarah Mitchell", scheduled_at: inDays(3, 20), zoom_url: "https://zoom.us/j/placeholder" },
    { student_id: userId, title: "Pronunciation Lab", teacher: "Olivia Brown", scheduled_at: inDays(7, 18, 30), zoom_url: "https://zoom.us/j/placeholder" },
    { student_id: userId, title: "Business English — Negotiation", teacher: "Aisha Patel", scheduled_at: inDays(-3), status: "completed" },
    { student_id: userId, title: "Reading Comprehension", teacher: "David Williams", scheduled_at: inDays(-7), status: "completed" },
  ]);

  await supabase.from("materials").insert([
    { student_id: userId, title: "Unit 4 — Workbook (PDF)", description: "Exercícios complementares da Unit 4", type: "pdf", url: "#" },
    { student_id: userId, title: "Listening Practice — Episode 12", description: "Audio com transcrição", type: "audio", url: "#" },
    { student_id: userId, title: "Pronunciation Video — TH sounds", description: "Aula gravada de 14 min", type: "video", url: "#" },
    { student_id: userId, title: "Vocabulário — Business Terms", description: "Lista de 80 termos essenciais", type: "pdf", url: "#" },
  ]);

  await supabase.from("notifications").insert([
    { recipient_id: userId, title: "Bem-vindo à Lumina! 🎉", body: "Sua jornada começa agora. Explore seu painel e prepare-se para a primeira aula." },
    { recipient_id: userId, title: "Nova aula agendada", body: "Conversation Class amanhã às 19h com James O'Connor." },
    { recipient_id: userId, title: "Material disponível", body: "Workbook Unit 4 já está no seu painel." },
  ]);

  await supabase.from("progress").insert([
    { student_id: userId, skill: "speaking", score: 72 },
    { student_id: userId, skill: "listening", score: 80 },
    { student_id: userId, skill: "reading", score: 78 },
    { student_id: userId, skill: "writing", score: 65 },
    { student_id: userId, skill: "grammar", score: 70 },
    { student_id: userId, skill: "vocabulary", score: 75 },
  ]);
};
