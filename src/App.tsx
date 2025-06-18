
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AutomaticGrading from "./pages/AutomaticGrading";
import SummarizeArticles from "./pages/SummarizeArticles";
import PlagiarismCheck from "./pages/PlagiarismCheck";
import IEPRewrite from "./pages/IEPRewrite";
import RubricGenerator from "./pages/RubricGenerator";
import ReportCardComments from "./pages/ReportCardComments";
import CurriculumAnalyzer from "./pages/CurriculumAnalyzer";
import LessonPlanGenerator from "./pages/LessonPlanGenerator";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="automatic-grading" element={<AutomaticGrading />} />
              <Route path="summarize-articles" element={<SummarizeArticles />} />
              <Route path="plagiarism-check" element={<PlagiarismCheck />} />
              <Route path="iep-rewrite" element={<IEPRewrite />} />
              <Route path="rubric-generator" element={<RubricGenerator />} />
              <Route path="report-card-comments" element={<ReportCardComments />} />
              <Route path="curriculum-analyzer" element={<CurriculumAnalyzer />} />
              <Route path="lesson-plan-generator" element={<LessonPlanGenerator />} />
              <Route path="history" element={<History />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
