import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  UserPlus, 
  MoreVertical, 
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
  ArrowUpRight,
  User as UserIcon,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { studentService } from '../services/studentService';
import { Student } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = studentService.listenStudents(setStudents);
    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Attendance', 'GPA', 'Study Hours', 'Internal Marks', 'Assignments', 'Participation', 'Created At'];
    const rows = filteredStudents.map(s => [
      `"${s.name}"`,
      s.email,
      `${s.attendance}%`,
      s.previousGPA,
      s.studyHours,
      s.internalMarks,
      s.assignmentsCompleted,
      s.participationScore,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `student_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Admin Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-[#4F46E5] w-7 h-7" />
            Student Management
          </h2>
          <p className="text-[#64748B] text-sm mt-1">Manage and track all student performance records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#EEF2FF] text-[#4F46E5] font-bold rounded-xl hover:bg-[#E0E7FF] transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] shadow-lg shadow-indigo-200 transition-all">
            <UserPlus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Student Table Column */}
        <div className="xl:col-span-3 space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#4F46E5] outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#E2E8F0] text-[#64748B] font-bold rounded-2xl hover:bg-[#F8FAFC] transition-all">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="px-6 py-4 text-xs font-black text-[#94A3B8] uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-black text-[#94A3B8] uppercase tracking-widest">Performance</th>
                    <th className="px-6 py-4 text-xs font-black text-[#94A3B8] uppercase tracking-widest">Attendance</th>
                    <th className="px-6 py-4 text-xs font-black text-[#94A3B8] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-[#94A3B8] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  <AnimatePresence mode="popLayout">
                    {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={student.id} 
                        className="hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] font-bold">
                              {student.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E293B]">{student.name}</p>
                              <p className="text-xs text-[#64748B]">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-[#1E293B]">GPA: {student.previousGPA}</span>
                             <div className="w-24 bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                               <div className="bg-[#4F46E5] h-full" style={{ width: `${(student.previousGPA / 4) * 100}%` }}></div>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-semibold text-[#1E293B]">
                          {student.attendance}%
                        </td>
                        <td className="px-6 py-5">
                          {student.attendance >= 75 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold ring-1 ring-emerald-100 italic">
                              <CheckCircle className="w-3 h-3" /> Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold ring-1 ring-red-100 italic">
                              <XCircle className="w-3 h-3" /> Shortfall
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-white rounded-lg transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-[#94A3B8] italic font-medium">
                          No students records found.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              <p className="text-sm text-[#64748B]">Showing <span className="font-bold text-[#1E293B]">{filteredStudents.length}</span> students</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#64748B] hover:bg-white transition-all">Previous</button>
                <button className="px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#64748B] hover:bg-white transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#EEF2FF] p-2 rounded-xl">
                <Activity className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h3 className="font-bold text-lg">Activity Feed</h3>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {students.slice(0, 8).map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] group hover:border-[#4F46E5]/20 transition-all cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center ring-2 ring-[#EEF2FF]">
                        <UserIcon className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-[#1E293B] truncate">{student.name}</p>
                        <span className="text-[10px] font-bold text-[#94A3B8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(student.createdAt)} ago
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-2">Updated performance metrics</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-[#4F46E5] border border-[#EEF2FF]">
                          GPA: {student.previousGPA}
                        </span>
                        <span className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-[#10B981] border border-[#ECFDF5]">
                          Att: {student.attendance}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button className="mt-8 w-full bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] font-bold py-3 rounded-2xl transition-all text-xs">
              Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
