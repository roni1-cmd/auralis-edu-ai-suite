
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Shield, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  BarChart3, 
  GraduationCap,
  History as HistoryIcon
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: BarChart3, label: 'Automatic Grading', href: '/automatic-grading' },
  { icon: FileText, label: 'Summarize Articles', href: '/summarize-articles' },
  { icon: Shield, label: 'Plagiarism Check', href: '/plagiarism-check' },
  { icon: Users, label: 'IEP-Aware Rewrite', href: '/iep-rewrite' },
  { icon: ClipboardList, label: 'Rubric Generator', href: '/rubric-generator' },
  { icon: MessageSquare, label: 'Report Card Comments', href: '/report-card-comments' },
  { icon: BookOpen, label: 'Curriculum Analyzer', href: '/curriculum-analyzer' },
  { icon: GraduationCap, label: 'Lesson Plan Generator', href: '/lesson-plan-generator' },
  { icon: HistoryIcon, label: 'History', href: '/history' },
];

export const Sidebar: React.FC<SidebarProps> = ({ expanded, setExpanded }) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "bg-black border-r border-gray-800 transition-all duration-300 flex flex-col",
        expanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-4">
        <div className={cn(
          "text-white font-bold text-xl",
          !expanded && "text-center"
        )}>
          {expanded ? "Auralis" : "A"}
        </div>
      </div>
      
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors",
                isActive 
                  ? "bg-white text-black" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {expanded && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
