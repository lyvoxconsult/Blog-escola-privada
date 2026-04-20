import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import Itinerary from "./pages/student/Itinerary";
import Materials from "./pages/student/Materials";
import ProgressPage from "./pages/student/Progress";
import Communications from "./pages/student/Communications";
import ManagerDashboard from "./pages/manager/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/cursos" element={<Courses />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/professores" element={<Teachers />} />
              <Route path="/contato" element={<Contact />} />
            </Route>

            <Route path="/login" element={<Login />} />

            {/* Área do Aluno */}
            <Route
              element={
                <ProtectedRoute requireRole="aluno">
                  <DashboardLayout role="aluno" />
                </ProtectedRoute>
              }
            >
              <Route path="/aluno/dashboard" element={<StudentDashboard />} />
              <Route path="/aluno/itinerario" element={<Itinerary />} />
              <Route path="/aluno/materiais" element={<Materials />} />
              <Route path="/aluno/progresso" element={<ProgressPage />} />
              <Route path="/aluno/comunicacoes" element={<Communications />} />
            </Route>

            {/* Área do Gestor */}
            <Route
              element={
                <ProtectedRoute requireRole="gestor">
                  <DashboardLayout role="gestor" />
                </ProtectedRoute>
              }
            >
              <Route path="/gestor/dashboard" element={<ManagerDashboard />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
