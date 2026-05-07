import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LayoutDashboard, 
  Settings, 
  Users, 
  LogOut, 
  BrainCircuit,
  MessageSquare,
  Moon,
  Sun,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Layout({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.role === 'admin';

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'AI Predictor', icon: BrainCircuit, path: '/predict' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    ...(isAdmin ? [
      { name: 'Admin Panel', icon: Users, path: '/admin' },
      { name: 'Subjects', icon: BookOpen, path: '/subjects' }
    ] : []),
    { name: 'AI Chatbot', icon: MessageSquare, path: '/chatbot' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] hidden md:flex flex-col">
        <div className="p-6 border-b border-[#E2E8F0] flex items-center gap-3">
          <div className="bg-[#4F46E5] p-2 rounded-lg">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">EduPredict AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-3 w-full text-[#64748B] hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-[#1E293B]">
            {navItems.find(i => i.path === location.pathname)?.name || 'Welcome'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg">
              <Sun className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{profile?.displayName || profile?.email}</p>
                <p className="text-xs text-[#64748B] capitalize">{profile?.role}</p>
              </div>
              <div className="w-9 h-9 bg-[#4F46E5] rounded-full flex items-center justify-center text-white font-bold">
                {profile?.displayName?.[0] || profile?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
