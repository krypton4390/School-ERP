import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Users, 
  FileText,
  Phone,
  Trash2,
  Edit2,
  X,
  Download,
  MoreHorizontal,
  ChevronRight,
  Loader2,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const [formData, setFormData] = useState({
    name: '', reg_no: '', section_id: '', roll_no: '', parent: '', phone: '', address: ''
  });

  const fetchInitialData = async () => {
    setIsLoading(true);
    const { data: studentData } = await supabase
      .from('students')
      .select('id, registration_no, roll_no, father_name, address, profile_id, profiles(full_name, phone), sections(id, name, classes(name))')
      .order('created_at', { ascending: false });

    if (studentData) {
      setStudents(studentData.map(s => ({
        db_id: s.id, profile_id: s.profile_id,
        id: s.registration_no, name: s.profiles?.full_name || 'Unknown',
        grade: s.sections?.classes?.name ? `${s.sections.classes.name}-${s.sections.name}` : 'N/A',
        section_id: s.sections?.id, parent: s.father_name,
        phone: s.profiles?.phone || 'N/A', address: s.address, roll: s.roll_no
      })));
    }

    const { data: sectionData } = await supabase.from('sections').select('id, name, classes(name)');
    setSections(sectionData || []);
    const { data: classData } = await supabase.from('classes').select('name').order('numeric_level', { ascending: true });
    setAllClasses(classData || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchInitialData(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (modalMode === 'add') {
        const { data: profile, error: pError } = await supabase.from('profiles').insert([{ full_name: formData.name, phone: formData.phone, role: 'student' }]).select().single();
        if (pError) throw pError;
        const { error: sError } = await supabase.from('students').insert([{
          profile_id: profile.id, registration_no: formData.reg_no,
          section_id: parseInt(formData.section_id), roll_no: parseInt(formData.roll_no),
          father_name: formData.parent, address: formData.address
        }]);
        if (sError) throw sError;
      } else {
        const stu = students.find(s => s.db_id === editingId);
        await supabase.from('profiles').update({ full_name: formData.name, phone: formData.phone }).eq('id', stu.profile_id);
        await supabase.from('students').update({ registration_no: formData.reg_no, section_id: parseInt(formData.section_id), roll_no: parseInt(formData.roll_no), father_name: formData.parent, address: formData.address }).eq('id', editingId);
      }
      setIsModalOpen(false);
      setFormData({ name: '', reg_no: '', section_id: '', roll_no: '', parent: '', phone: '', address: '' });
      fetchInitialData();
    } catch (err) { alert(err.message); } finally { setIsLoading(false); }
  };

  const handleDelete = async (id, profileId) => {
    if (!window.confirm('Delete this student record permanently?')) return;
    await supabase.from('students').delete().eq('id', id);
    await supabase.from('profiles').delete().eq('id', profileId);
    fetchInitialData();
    setActiveMenu(null);
  };

  const openEditModal = (student) => {
    setModalMode('edit'); setEditingId(student.db_id);
    setFormData({ name: student.name, reg_no: student.id, section_id: student.section_id, roll_no: student.roll, parent: student.parent, phone: student.phone, address: student.address });
    setIsModalOpen(true); setActiveMenu(null);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGrade === 'All' || s.grade.split('-')[0] === selectedGrade)
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
          <p className="text-sm text-slate-400 mt-0.5">Manage all enrolled students</p>
        </div>
        <button onClick={() => { setModalMode('add'); setIsModalOpen(true); }} className="btn btn-primary">
          <UserPlus size={16} /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { l: 'Total Students', v: students.length, cls: 'green', icon: <Users size={18} /> },
          { l: 'New This Month', v: '12', cls: 'blue', icon: <UserPlus size={18} /> },
          { l: 'Active Records', v: students.length, cls: 'purple', icon: <FileText size={18} /> },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${s.cls === 'green' ? 'bg-emerald-50 text-emerald-600' : s.cls === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{s.l}</p>
                <h4 className="text-xl font-bold text-slate-800">{s.v}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 gap-2 flex-1 sm:w-72">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search by name or ID..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
            <option value="All">All Grades</option>
            {allClasses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <button className="btn btn-secondary text-xs">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>ID & Roll</th>
              <th>Grade</th>
              <th>Parent / Guardian</th>
              <th>Contact</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr key={s.db_id} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">{s.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{s.name}</p>
                      <p className="text-[10px] text-slate-400">Active Student</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="text-xs font-semibold text-indigo-600">{s.id}</p>
                  <p className="text-[10px] text-slate-400">Roll: {s.roll}</p>
                </td>
                <td><span className="badge badge-info">{s.grade}</span></td>
                <td className="text-sm text-slate-600">{s.parent || '—'}</td>
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500"><Phone size={12} className="text-slate-400" /> {s.phone}</div>
                </td>
                <td className="text-right relative">
                  <button onClick={() => setActiveMenu(activeMenu === s.db_id ? null : s.db_id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><MoreHorizontal size={16} /></button>
                  <AnimatePresence>
                    {activeMenu === s.db_id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-4 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                          <button onClick={() => openEditModal(s)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"><Edit2 size={14} className="text-indigo-500" /> Edit</button>
                          <button onClick={() => handleDelete(s.db_id, s.profile_id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t border-slate-100"><Trash2 size={14} /> Delete</button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {students.length} students
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">{modalMode === 'add' ? 'New Student Admission' : 'Edit Student'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleRegister} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Full Name *</label><input required type="text" placeholder="e.g. John Doe" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Registration No. *</label><input required type="text" placeholder="e.g. AD-2024-001" className="input" value={formData.reg_no} onChange={(e) => setFormData({...formData, reg_no: e.target.value})} /></div>
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Class & Section *</label><select required className="input" value={formData.section_id} onChange={(e) => setFormData({...formData, section_id: e.target.value})}><option value="">Select...</option>{sections.map(s => <option key={s.id} value={s.id}>{s.classes?.name} - {s.name}</option>)}</select></div>
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Roll Number *</label><input required type="number" placeholder="1" className="input" value={formData.roll_no} onChange={(e) => setFormData({...formData, roll_no: e.target.value})} /></div>
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Parent Name</label><input type="text" placeholder="Father's name" className="input" value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})} /></div>
                  <div><label className="text-[11px] font-semibold text-slate-500 mb-1 block">Phone</label><input type="text" placeholder="+977-XXXXXXXXXX" className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : modalMode === 'add' ? 'Register Student' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentManagement;
