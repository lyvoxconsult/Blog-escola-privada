import { Link } from "react-router-dom";
import { ArrowRight, Globe2, Sparkles, Users, Trophy, GraduationCap, Star, Quote } from "lucide-react";
import { SEO } from "@/components/common/SEO";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/mocks/courses";
import { testimonials } from "@/mocks/teachers";

const benefits = [
  { icon: Globe2, title: "Professores nativos", desc: "Time global de 6 países, certificados e apaixonados por ensinar." },
  { icon: Sparkles, title: "Método imersivo", desc: "Aprenda em contexto real, com prática desde a primeira aula." },
  { icon: Users, title: "Turmas reduzidas", desc: "Máximo de 8 alunos por turma para atenção individualizada." },
  { icon: Trophy, title: "Resultado garantido", desc: "Suba um nível em até 6 meses ou continue gratuitamente." },
];

const Home = () => {
  const featured = courses.filter((c) => c.highlight).slice(0, 3);

  return (
    <>
      <SEO title="Aprenda inglês de verdade" description="Lumina English Academy — escola internacional com método imersivo, professores nativos e turmas reduzidas. Matricule-se hoje." />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container-page relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl animate-fade-in">
            <Badge className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/15 mb-6">
              <Sparkles className="h-3 w-3 mr-1.5" /> Novas turmas em maio
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance">
              Aprenda inglês de verdade,{" "}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">viva o mundo.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl">
              Educação internacional com método imersivo, professores nativos e tecnologia de ponta. Mais de 12.000 alunos transformados desde 2015.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow h-12 px-7">
                <Link to="/cursos">
                  Matricule-se agora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/cursos">Ver cursos</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { v: "12k+", l: "Alunos formados" },
                { v: "6", l: "Países de origem" },
                { v: "4.9★", l: "Avaliação média" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-bold">{s.v}</div>
                  <div className="text-xs md:text-sm text-primary-foreground/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="container-page py-20 md:py-28">
        <SectionHeader eyebrow="Por que Lumina" title="Tudo que você precisa para aprender inglês de verdade" description="Combinamos pedagogia comprovada, tecnologia moderna e um time apaixonado para entregar resultado real." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border/60 hover:border-accent/40 hover:shadow-soft transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <SectionHeader eyebrow="Cursos" title="Programas em destaque" description="Selecionamos os caminhos mais procurados para você começar." align="left" className="max-w-xl" />
            <Button asChild variant="outline">
              <Link to="/cursos">Ver todos os cursos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((c) => (
              <Card key={c.id} className="overflow-hidden hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group bg-card">
                <div className="aspect-video bg-gradient-accent flex items-center justify-center text-primary-foreground">
                  <GraduationCap className="h-12 w-12 opacity-90" />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">{c.level}</Badge>
                    <span className="text-xs text-muted-foreground">{c.duration}</span>
                  </div>
                  <h3 className="font-display font-semibold text-xl text-primary group-hover:text-accent transition-colors">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.shortDescription}</p>
                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">R$ {c.price}<span className="text-muted-foreground font-normal">/mês</span></span>
                    <Link to="/cursos" className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
                      Saiba mais <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="container-page py-20 md:py-28">
        <SectionHeader eyebrow="Depoimentos" title="Histórias reais de quem aprendeu com a gente" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="border-border/60 bg-card relative">
              <CardContent className="p-7">
                <Quote className="h-7 w-7 text-accent/30 mb-3" />
                <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} estrelas`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center font-semibold text-sm">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-sm text-primary">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground p-10 md:p-16 text-center">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Pronto para destravar seu inglês?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Faça uma aula experimental gratuita e descubra o nível ideal para você.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-8 shadow-glow">
              <Link to="/contato">Quero minha aula gratuita <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
