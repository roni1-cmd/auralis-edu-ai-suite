
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: BarChart3,
    title: 'Automatic Grading',
    description: 'AI-powered grading with detailed analytics and feedback',
    href: '/automatic-grading',
    color: 'bg-blue-600'
  },
  {
    icon: FileText,
    title: 'Summarize Articles',
    description: 'Generate comprehensive summaries of educational content',
    href: '/summarize-articles',
    color: 'bg-green-600'
  },
  {
    icon: Shield,
    title: 'Plagiarism Check',
    description: 'Detect potential plagiarism with AI analysis',
    href: '/plagiarism-check',
    color: 'bg-red-600'
  },
  {
    icon: Users,
    title: 'IEP-Aware Rewrite',
    description: 'Adapt content for students with special needs',
    href: '/iep-rewrite',
    color: 'bg-purple-600'
  },
  {
    icon: ClipboardList,
    title: 'Rubric Generator',
    description: 'Create detailed rubrics for assignments',
    href: '/rubric-generator',
    color: 'bg-yellow-600'
  },
  {
    icon: MessageSquare,
    title: 'Report Card Comments',
    description: 'Generate professional report card comments',
    href: '/report-card-comments',
    color: 'bg-pink-600'
  },
  {
    icon: BookOpen,
    title: 'Curriculum Analyzer',
    description: 'Analyze curriculum alignment with standards',
    href: '/curriculum-analyzer',
    color: 'bg-indigo-600'
  },
  {
    icon: GraduationCap,
    title: 'Lesson Plan Generator',
    description: 'Create comprehensive lesson plans instantly',
    href: '/lesson-plan-generator',
    color: 'bg-teal-600'
  }
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, {user?.displayName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-400 text-lg">
          Choose a tool below to start automating your teaching tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.href} to={feature.href}>
              <Card className="bg-card border-border hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
