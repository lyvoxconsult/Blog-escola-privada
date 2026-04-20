import { SEO } from "@/components/common/SEO";
import { SectionHeader } from "@/components/common/SectionHeader";
import { teachers, testimonials } from "@/mocks/teachers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Teachers = () => (
  <>
    <SEO title="Professores" description="Conheça o time internacional de educadores da Lumina English Academy." />

    <section className="bg-gradient-soft border-b border-border">
      <div className="container-page py-16 md:py-20">
        <SectionHeader eyebrow="Time" title="Professores nativos e apaixonados" description="Educadores certificados de 6 países, dedicados ao seu progresso." />
      </div>
    </section>

    <section className="container-page py-12 md:py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teachers.map((t) => (
          <Card key={t.id} className="overflow-hidden hover:shadow-elevated hover:-translate-y-0.5 transition-all group">
            <div className="aspect-square bg-gradient-accent flex items-center justify-center text-primary-foreground">
              <span className="text-5xl font-display font-bold">{t.initials}</span>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.country}</span>
                <span className="text-xs text-muted-foreground">{t.yearsExperience} anos exp.</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary group-hover:text-accent transition-colors">{t.name}</h3>
                <p className="text-sm text-secondary font-medium">{t.role}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.specialties.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Depoimentos" title="O que os alunos dizem" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="bg-card">
              <CardContent className="p-7">
                <Quote className="h-7 w-7 text-accent/30 mb-3" />
                <div className="flex gap-0.5 mb-3">
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
      </div>
    </section>
  </>
);

export default Teachers;
