import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Trophy, 
  ArrowUpRight, 
  Calendar,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { Student, Prediction } from '../types';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    if (!user) return;
    
    // Listen to current user's performance submissions specifically if not admin 
    // to satisfy Firestore security rules (rules are not filters)
    const emailFilter = profile?.role === 'admin' ? undefined : user.email || undefined;
    
    const unsubscribe = studentService.listenStudents((data) => {
      setStudentsData(data);
    }, emailFilter);

    return () => unsubscribe();
  }, [user, profile]);

  const stats = [
    { label: 'Current GPA', value: studentsData[0]?.previousGPA || '0.0', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Attendance', value: `${studentsData[0]?.attendance || 0}%`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Study Hours', value: `${studentsData[0]?.studyHours || 0}h/d`, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Assignments', value: `${studentsData[0]?.assignmentsCompleted || 0}/10`, icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const chartData = [...studentsData].reverse().map(s => ({
    name: new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    gpa: s.previousGPA,
    attendance: s.attendance
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#4F46E5] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hello, {profile?.displayName || 'Student'}! 👋</h1>
          <p className="text-indigo-100 max-w-md">Your performance tracking is live. Keep pushing for your goals with AI-guided insights.</p>
          <div className="mt-6 flex gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Latest Grade: A+
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Next Exam: 12 Days
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[#10B981] text-xs font-bold bg-[#10B981]/10 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +2.4%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
              <h4 className="text-2xl font-bold text-[#0F172A] mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Performance Trends</h3>
            <select className="bg-[#F8FAFC] border-none rounded-lg text-xs font-bold py-2 px-3 outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="gpa" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col gap-6">
          <h3 className="text-lg font-bold">Recommendations</h3>
          <div className="space-y-4 flex-1">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-4">
              <div className="bg-orange-100 p-2 rounded-lg h-fit">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-orange-950">Study Hours Insight</h5>
                <p className="text-xs text-orange-800 mt-1">Based on your recent GPA, increasing study hours by 1.5h/day could boost scores by 8%.</p>
              </div>
            </div>

            <div className="bg-[#EEF2FF] p-4 rounded-2xl border border-[#E2E8F0] flex gap-4">
              <div className="bg-[#4F46E5] p-2 rounded-lg h-fit">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-[#1E293B]">Assignment Tracking</h5>
                <p className="text-xs text-[#64748B] mt-1">You've completed 8/10 assignments. Submit the final 2 to ensure maximum internals.</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] font-bold py-3 rounded-xl transition-all text-sm">
            View All Insights
          </button>
        </div>
      </div>
    </div>
  );
}
