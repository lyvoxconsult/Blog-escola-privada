import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export const Footer = () => (
  <footer className="border-t border-border bg-muted/40 mt-24">
    <div className="container-page py-14">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Aprenda inglês de verdade, viva o mundo. Educação internacional com método comprovado.
          </p>
          <div className="flex gap-2 pt-1">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Facebook, label: "Facebook" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-primary mb-4">Explorar</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: "/sobre", label: "Sobre nós" },
              { to: "/cursos", label: "Cursos" },
              { to: "/professores", label: "Professores" },
              { to: "/blog", label: "Blog" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-accent transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-primary mb-4">Recursos</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/login" className="text-muted-foreground hover:text-accent">Portal do aluno</Link></li>
            <li><Link to="/login" className="text-muted-foreground hover:text-accent">Portal do gestor</Link></li>
            <li><Link to="/contato" className="text-muted-foreground hover:text-accent">Suporte</Link></li>
            <li><a href="#" className="text-muted-foreground hover:text-accent">Política de privacidade</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display font-semibold text-primary mb-4">Contato</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
              <span>Av. Paulista, 1000 — São Paulo, BR</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-accent shrink-0" />
              <span>+55 (11) 4000-1000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-accent shrink-0" />
              <a href="mailto:hello@lumina.com" className="hover:text-accent">hello@lumina.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Lumina English Academy. Todos os direitos reservados.</p>
        <p>CNPJ 00.000.000/0001-00</p>
      </div>
    </div>
  </footer>
);
