import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Brain, BarChart3, Target, Zap, ShieldCheck } from 'lucide-react';

const modelAccuracy = [
  { name: 'Linear Regression', accuracy: 82, color: '#94A3B8' },
  { name: 'Logistic Regression', accuracy: 85, color: '#64748B' },
  { name: 'Decision Tree', accuracy: 89, color: '#4F46E5' },
  { name: 'Random Forest', accuracy: 94, color: '#10B981' },
];

const attributeCorrelation = [
  { subject: 'Study Hours', A: 90, fullMark: 100 },
  { subject: 'Attendance', A: 95, fullMark: 100 },
  { subject: 'Assignments', A: 88, fullMark: 100 },
  { subject: 'Internals', A: 82, fullMark: 100 },
  { subject: 'Participation', A: 75, fullMark: 100 },
];

const gradeDistribution = [
  { name: 'A+', value: 15 },
  { name: 'A', value: 25 },
  { name: 'B', value: 35 },
  { name: 'C', value: 15 },
  { name: 'D/F', value: 10 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#94A3B8'];

export default function Analytics() {
  return (
    <div className="space-y-8 pb-12">
      {/* ML Accuracy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Brain className="text-[#4F46E5] w-6 h-6" />
                Model Accuracy Comparison
              </h3>
              <p className="text-sm text-[#64748B] mt-1">Comparing different ML algorithms on current dataset.</p>
            </div>
            <ShieldCheck className="text-[#10B981] w-8 h-8 opacity-20" />
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelAccuracy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#1E293B'}} width={120} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value}% Accuracy`, 'Result']}
                />
                <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={24}>
                  {modelAccuracy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
             <div className="flex-1">
               <p className="text-xs font-bold text-[#94A3B8] uppercase">Best Performer</p>
               <p className="text-sm font-black text-[#10B981]">Random Forest Classifier (94.2%)</p>
             </div>
             <div className="w-px h-10 bg-[#E2E8F0]"></div>
             <div className="flex-1">
               <p className="text-xs font-bold text-[#94A3B8] uppercase">Current Prediction Confidence</p>
               <p className="text-sm font-black text-[#4F46E5]">High (92.5%)</p>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
            <Zap className="text-[#F59E0B] w-6 h-6" />
            Attribute Correlation (Radar)
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attributeCorrelation}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 600, fill: '#64748B'}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar
                  name="Correlation Strength"
                  dataKey="A"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.4}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <h3 className="text-lg font-bold mb-6">Grade Distribution</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-black text-[#1E293B]">85%</span>
               <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Passing Rate</span>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {gradeDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs font-bold text-[#64748B]">{item.name}</span>
                </div>
                <span className="text-xs font-black text-[#1E293B]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0F172A] p-8 rounded-3xl text-white overflow-hidden relative shadow-2xl">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-2 rounded-xl">
                  <BarChart3 className="text-[#38BDF8] w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Predictive Confidence Report</h3>
              </div>
              <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed">
                Our AI model has analyzed over 10,000 student data points to identify the strongest indicators of academic success. 
                Currently, <span className="text-white font-bold italic">Attendance</span> and <span className="text-white font-bold italic">Active Participation</span> 
                are 94% correlated with A-grade outcomes.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Predictions</p>
                   <p className="text-2xl font-black">1.2K+</p>
                 </div>
                 <div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Mean Absolute Error</p>
                   <p className="text-2xl font-black text-[#38BDF8]">2.41</p>
                 </div>
                 <div className="hidden md:block">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Insight Accuracy</p>
                   <p className="text-2xl font-black text-[#10B981]">98%</p>
                 </div>
              </div>
           </div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
