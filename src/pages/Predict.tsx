import React, { useState } from 'react';
import { BrainCircuit, Loader2, CheckCircle2, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { predictPerformance } from '../services/geminiService';
import { studentService } from '../services/studentService';
import { Student, Prediction } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Predict() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt'>>({
    name: profile?.displayName || '',
    email: profile?.email || '',
    attendance: 85,
    studyHours: 4,
    internalMarks: 75,
    assignmentsCompleted: 8,
    sleepHours: 7,
    internetUsage: 'Medium',
    previousGPA: 3.5,
    participationScore: 8
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.email) {
      console.error("User profile not loaded");
      return;
    }
    
    setLoading(true);
    try {
      const studentData: Student = { 
        ...formData, 
        name: profile.displayName || formData.name,
        email: profile.email,
        createdAt: Date.now() 
      };
      const prediction = await predictPerformance(studentData);
      
      const studentDoc = await studentService.addStudent(studentData);
      if (studentDoc) {
        await studentService.savePrediction({ ...prediction, studentId: studentDoc.id });
      }
      
      setResult(prediction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#4F46E5] p-2 rounded-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Performance Input</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Attendance (%)</label>
              <input
                type="number"
                min="0" max="100"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Study Hours (Daily)</label>
              <input
                type="number"
                min="0" max="24"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.studyHours}
                onChange={(e) => setFormData({ ...formData, studyHours: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Internal Marks (1-100)</label>
              <input
                type="number"
                min="0" max="100"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.internalMarks}
                onChange={(e) => setFormData({ ...formData, internalMarks: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Assignments (0-10)</label>
              <input
                type="number"
                min="0" max="10"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.assignmentsCompleted}
                onChange={(e) => setFormData({ ...formData, assignmentsCompleted: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Sleep Hours</label>
              <input
                type="number"
                min="0" max="24"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Previous GPA</label>
              <input
                type="number"
                step="0.01"
                min="0" max="10"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.previousGPA}
                onChange={(e) => setFormData({ ...formData, previousGPA: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Class Participation (1-10)</label>
              <input
                type="number"
                min="0" max="10"
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.participationScore}
                onChange={(e) => setFormData({ ...formData, participationScore: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#64748B]">Internet Usage</label>
              <select
                className="w-full bg-[#F8FAFC] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                value={formData.internetUsage}
                onChange={(e) => setFormData({ ...formData, internetUsage: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="col-span-1 md:col-span-2 mt-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating AI Prediction...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  Generate Prediction
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#E2E8F0] h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="text-[#10B981] w-6 h-6" />
                    AI Prediction Result
                  </h3>
                  <div className="bg-[#10B981]/10 text-[#10B981] px-4 py-1 rounded-full text-sm font-bold">
                    Score: {result.finalScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#F8FAFC] p-6 rounded-2xl text-center">
                    <p className="text-sm text-[#64748B] font-medium mb-1">Predicted Grade</p>
                    <p className="text-4xl font-black text-[#4F46E5]">{result.grade}</p>
                  </div>
                  <div className="bg-[#F8FAFC] p-6 rounded-2xl text-center">
                    <p className="text-sm text-[#64748B] font-medium mb-1">Pass Probability</p>
                    <p className="text-4xl font-black text-[#10B981]">{(result.passProbability * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
                    <CheckCircle2 className="text-[#4F46E5] w-5 h-5" />
                    AI Recommendations
                  </div>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 bg-[#EEF2FF] p-3 rounded-xl text-sm text-[#4338CA]">
                        <span className="font-black bg-[#4F46E5] text-white w-5 h-5 rounded-md flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>Model Confidence: {result.confidence}%</span>
                  <span>Generated: {new Date().toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#F1F5F9] border-2 border-dashed border-[#CBD5E1] rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="bg-white/50 p-4 rounded-full mb-4">
                  <AlertCircle className="w-10 h-10 text-[#94A3B8]" />
                </div>
                <h3 className="text-lg font-semibold text-[#64748B]">No Prediction Data</h3>
                <p className="text-sm text-[#94A3B8] max-w-[250px] mt-2">
                  Enter student details on the left to see AI-powered performance insights.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
