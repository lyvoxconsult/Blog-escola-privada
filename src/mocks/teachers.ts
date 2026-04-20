export interface Teacher {
  id: string;
  name: string;
  role: string;
  country: string;
  bio: string;
  specialties: string[];
  initials: string;
  yearsExperience: number;
}

export const teachers: Teacher[] = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    role: "Head of Academic Programs",
    country: "🇺🇸 EUA",
    bio: "Mestre em TESOL pela Columbia University, com 12 anos formando alunos para exames internacionais.",
    specialties: ["IELTS", "TOEFL", "Academic Writing"],
    initials: "SM",
    yearsExperience: 12,
  },
  {
    id: "t2",
    name: "James O'Connor",
    role: "Senior Teacher",
    country: "🇮🇪 Irlanda",
    bio: "Especialista em conversação e pronúncia natural. Apaixonado por cultura pop e storytelling.",
    specialties: ["Conversation", "Pronunciation", "Culture"],
    initials: "JO",
    yearsExperience: 9,
  },
  {
    id: "t3",
    name: "Aisha Patel",
    role: "Business English Lead",
    country: "🇬🇧 Reino Unido",
    bio: "MBA pela LSE. Atua como mentora de executivos em multinacionais há mais de uma década.",
    specialties: ["Business English", "Executive Coaching", "Negotiation"],
    initials: "AP",
    yearsExperience: 11,
  },
  {
    id: "t4",
    name: "Michael Chen",
    role: "Kids & Teens Specialist",
    country: "🇨🇦 Canadá",
    bio: "Pedagogo formado pela University of Toronto. Cria experiências lúdicas e imersivas para jovens.",
    specialties: ["Kids", "Teens", "Storytelling"],
    initials: "MC",
    yearsExperience: 8,
  },
  {
    id: "t5",
    name: "Olivia Brown",
    role: "Teacher Trainer",
    country: "🇦🇺 Austrália",
    bio: "Treina professores há 15 anos e desenvolve metodologias ativas para sala de aula.",
    specialties: ["Methodology", "Teacher Training", "CLIL"],
    initials: "OB",
    yearsExperience: 15,
  },
  {
    id: "t6",
    name: "David Williams",
    role: "Exam Prep Specialist",
    country: "🇳🇿 Nova Zelândia",
    bio: "Examinador certificado Cambridge. Já preparou mais de 2.000 alunos para certificações.",
    specialties: ["Cambridge", "FCE", "CAE"],
    initials: "DW",
    yearsExperience: 10,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  quote: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "tm1",
    name: "Marina Costa",
    role: "Engenheira de software",
    initials: "MC",
    rating: 5,
    quote:
      "Em 8 meses passei de iniciante para conversação fluente. Hoje trabalho em um time global e me comunico com confiança todos os dias.",
  },
  {
    id: "tm2",
    name: "Rafael Almeida",
    role: "Médico",
    initials: "RA",
    rating: 5,
    quote:
      "O preparo para o IELTS foi cirúrgico. Tirei 7.5 e fui aceito em uma residência nos EUA. Suporte impecável de ponta a ponta.",
  },
  {
    id: "tm3",
    name: "Beatriz Lima",
    role: "Designer",
    initials: "BL",
    rating: 5,
    quote:
      "A plataforma é incrível, os professores são apaixonados. Sinto que evoluo a cada aula. Recomendo de olhos fechados.",
  },
];
