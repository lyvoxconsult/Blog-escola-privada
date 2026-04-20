import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { Logo } from "@/components/common/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Auth real será habilitada na Fase 2 (Lovable Cloud)
    setTimeout(() => {
      setLoading(false);
      toast.info("Autenticação em breve", {
        description: "A área protegida será liberada na próxima fase.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <SEO title="Entrar" description="Acesse o portal Lumina English Academy." />

      {/* Lado visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <Logo variant="white" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight mb-4 text-balance">Aprenda inglês de verdade, viva o mundo.</h2>
          <p className="text-primary-foreground/80 leading-relaxed max-w-md">
            Acesse seu portal para acompanhar progresso, aulas, materiais e comunicações.
          </p>
        </div>
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" aria-hidden="true" />
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} Lumina English Academy</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo /></div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Entrar no portal</h1>
          <p className="text-muted-foreground text-sm mb-7">Selecione seu perfil e faça login</p>

          <Tabs defaultValue="aluno">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="aluno" className="gap-2"><GraduationCap className="h-4 w-4" /> Aluno</TabsTrigger>
              <TabsTrigger value="gestor" className="gap-2"><ShieldCheck className="h-4 w-4" /> Gestor</TabsTrigger>
            </TabsList>

            {(["aluno", "gestor"] as const).map((role) => (
              <TabsContent key={role} value={role}>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor={`${role}-email`}>E-mail</Label>
                        <Input
                          id={`${role}-email`}
                          type="email"
                          placeholder={`${role}@lumina.com`}
                          defaultValue={`${role}@lumina.com`}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`${role}-pass`}>Senha</Label>
                        <Input id={`${role}-pass`} type="password" placeholder="••••••" defaultValue="123456" className="mt-1.5" />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full bg-gradient-accent hover:opacity-95 h-11">
                        {loading ? "Entrando..." : `Entrar como ${role === "aluno" ? "Aluno" : "Gestor"}`}
                      </Button>
                    </form>
                    <div className="mt-5 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                      <Info className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <p>Auth real será habilitada na próxima fase com Lovable Cloud. Credenciais demo: <strong>{role}@lumina.com</strong> / <strong>123456</strong>.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Voltar para <Link to="/" className="text-accent hover:underline font-medium">página inicial</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
