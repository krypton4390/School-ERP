import React, { useState, useEffect } from 'react';
import { 
  Plus, MoreHorizontal, Users, Edit2, Trash2, ChevronLeft, UserPlus, MapPin, Key, Layers, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionStudents, setSectionStudents] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('classes').select('id, name, numeric_level, sections (id, name, students (count))').order('numeric_level', { ascending: true });
    if (data) setClasses(data);
    setIsLoading(false);
  };

  const fetchSectionStudents = async (section) => {
    setIsLoading(true);
    const { data } = await supabase.from('students').select('*, profiles(full_name, phone)').eq('section_id', section.id).order('roll_no', { ascending: true });
    setSectionStudents(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedSection) fetchSectionStudents(selectedSection); }, [selectedSection]);

  const handleGenerateSectionLogins = async () => {
    if (!window.confirm(`Generate logins for ${selectedSection?.className} - ${selectedSection?.name}?`)) return;
    setIsLoading(true);
    try {
      const payloads = sectionStudents.map(s => ({
        profile_id: s.profile_id,
        username: `OSS-${String(s.roll_no).padStart(4, '0')}`,
        password_plain: String(s.roll_no).padStart(4, '0')
      }));
      const { error } = await supabase.from('student_credentials').upsert(payloads, { onConflict: 'profile_id' });
      if (error) throw error;
      alert(`Credentials generated for ${payloads.length} students.`);
    } catch (err) { alert(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <AnimatePresence mode="wait">
        {!selectedSection ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Class Management</h2>
                <p className="text-sm text-slate-400 mt-0.5">Manage classes, sections & student allocation</p>
              </div>
            </div>

            {/* Class Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {classes.map((cls, idx) => (
                <motion.div 
                  key={cls.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                  className="card p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {cls.name.replace('Class ', '').charAt(0)}
                    </div>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === cls.id ? null : cls.id); }} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                      <AnimatePresence>
                        {activeMenu === cls.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"><Edit2 size={12} /> Edit</button>
                              <button onClick={() => { if(window.confirm('Delete this class?')) supabase.from('classes').delete().eq('id', cls.id).then(fetchData); setActiveMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 border-t border-slate-100"><Trash2 size={12} /> Delete</button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-4">{cls.name}</h3>

                  <div className="space-y-2">
                    {cls.sections?.map(sec => (
                      <button 
                        key={sec.id} 
                        onClick={() => setSelectedSection({...sec, className: cls.name})}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all text-left group/sec"
                      >
                        <div className="flex items-center gap-2.5">
                          <Layers size={14} className="text-slate-400 group-hover/sec:text-indigo-500" />
                          <span className="text-sm font-medium text-slate-600 group-hover/sec:text-indigo-600">Section {sec.name}</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">
                          <Users size={10} /> {sec.students?.[0]?.count || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ═══ Section Drill-down ═══ */
          <motion.div key="drill" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedSection(null)} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedSection.className} — Section {selectedSection.name}</h2>
                  <p className="text-sm text-slate-400">{sectionStudents.length} students enrolled</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleGenerateSectionLogins} className="btn btn-secondary text-xs">
                  <Key size={14} /> Generate Logins
                </button>
                <button className="btn btn-primary text-xs">
                  <UserPlus size={14} /> Add Student
                </button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="w-16">Roll</th>
                    <th>Student Name</th>
                    <th>Guardian / Address</th>
                    <th>Phone</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionStudents.map((student, idx) => (
                    <tr key={student.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                      <td className="font-semibold text-slate-400">#{String(student.roll_no).padStart(2, '0')}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {student.profiles?.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{student.profiles?.full_name}</p>
                            <p className="text-[10px] text-slate-400">{student.registration_no}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-sm text-slate-600">{student.father_name || '—'}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <MapPin size={10} /> {student.address || 'Not specified'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone size={12} className="text-slate-400" /> {student.profiles?.phone || '—'}
                        </div>
                      </td>
                      <td className="text-right">
                        <button onClick={() => { if(window.confirm('Delete student?')) supabase.from('students').delete().eq('id', student.id).then(() => fetchSectionStudents(selectedSection)); }} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sectionStudents.length === 0 && (
                <div className="p-12 text-center text-sm text-slate-400">No students in this section yet</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassManagement;
