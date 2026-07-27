import { motion } from 'framer-motion';
import {
  Brain,
  Home,
  FileText,
  BookOpen,
  Sparkles,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'My Notes', icon: FileText, href: '/dashboard/notes' },
  { name: 'Explanations', icon: BookOpen, href: '/dashboard/explanations' },
  { name: 'Summaries', icon: Sparkles, href: '/dashboard/summaries' },
  { name: 'Quizzes', icon: HelpCircle, href: '/dashboard/quizzes' },
];

const bottomItems = [
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 bottom-0 w-72 glass-dark border-r border-border z-40"
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative gradient-primary p-2 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-white">
              StudyMind <span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'gradient-primary text-white shadow-glass'
                      : 'text-muted-foreground hover:text-white hover:bg-muted/50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-transform group-hover:scale-110',
                      isActive && 'text-white'
                    )}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          {bottomItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-muted/50 transition-all"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full mt-2">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
