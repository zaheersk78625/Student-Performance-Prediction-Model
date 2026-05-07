import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Search,
  User,
  Hash,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { studentService } from '../services/studentService';
import { Subject } from '../types';

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacherName: ''
  });

  useEffect(() => {
    const unsubscribe = studentService.listenSubjects(setSubjects);
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        code: subject.code,
        teacherName: subject.teacherName || ''
      });
    } else {
      setEditingSubject(null);
      setFormData({ name: '', code: '', teacherName: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingSubject?.id) {
        await studentService.updateSubject(editingSubject.id, formData);
      } else {
        await studentService.addSubject({
          ...formData,
          createdAt: Date.now()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await studentService.deleteSubject(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-[#4F46E5] w-7 h-7" />
            Subject Curriculum
          </h2>
          <p className="text-[#64748B] text-sm mt-1">Manage core academic subjects and assigned faculty.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#4338CA] shadow-lg shadow-indigo-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Subject
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search subjects by name or code..."
          className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#4F46E5] outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSubjects.map((subject) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={subject.id}
              className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm group hover:border-[#4F46E5] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#EEF2FF] text-[#4F46E5] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                  {subject.code}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(subject)}
                    className="p-2 text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => subject.id && handleDelete(subject.id)}
                    className="p-2 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-bold text-[#1E293B] mb-2">{subject.name}</h4>
              
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <User className="w-4 h-4" />
                <span className="font-medium">
                  {subject.teacherName || 'No teacher assigned'}
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Created {new Date(subject.createdAt).toLocaleDateString()}</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-[#f1f5f9] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#94a3b8]">
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-[#F8FAFC] p-4 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-[#CBD5E1]" />
            </div>
            <h3 className="text-lg font-bold text-[#64748B]">No subjects found</h3>
            <p className="text-sm text-[#94A3B8] max-w-xs mt-2">Try adjusting your search or add a new subject to the curriculum.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-[#4F46E5] p-6 text-white flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#94A3B8] uppercase tracking-widest pl-1">Subject Name</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
                      <input
                        required
                        type="text"
                        placeholder="e.g. Advanced Mathematics"
                        className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#94A3B8] uppercase tracking-widest pl-1">Subject Code</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
                        <input
                          required
                          type="text"
                          placeholder="e.g. MATH101"
                          className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#94A3B8] uppercase tracking-widest pl-1">Teacher</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
                        <input
                          type="text"
                          placeholder="Instructor Name"
                          className="w-full bg-[#F8FAFC] border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#4F46E5] outline-none"
                          value={formData.teacherName}
                          onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Adding a subject will make it available for performance reporting and analytics across the entire platform.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-[#F1F5F9] text-[#64748B] font-bold rounded-2xl hover:bg-[#E2E8F0] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] px-6 py-4 bg-[#4F46E5] text-white font-bold rounded-2xl hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
