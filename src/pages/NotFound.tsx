import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/Logo";
import { SEO } from "@/components/common/SEO";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-soft">
    <SEO title="Página não encontrada" description="A página que você procura não existe." />
    <Logo />
    <div className="mt-12 text-center max-w-md">
      <p className="text-7xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">404</p>
      <h1 className="mt-3 text-2xl md:text-3xl font-bold text-primary">Página não encontrada</h1>
      <p className="mt-3 text-muted-foreground">A página que você está procurando não existe ou foi movida.</p>
      <Button asChild className="mt-7 bg-gradient-accent hover:opacity-95">
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
