import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, Eye, EyeOff, RefreshCw, Edit2, Check, X, Lock, Cpu, Printer, Filter, UserPlus, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const AdminPanel = () => {
  const [activeSubTab, setActiveSubTab] = useState('students');
  const [showPassword, setShowPassword] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', password: '' });
  
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [credentials, setCredentials] = useState([]);
  
  // Directory Filter States
  const [dirClassId, setDirClassId] = useState('');
  const [dirSectionId, setDirSectionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Generator States
  const [genClassId, setGenClassId] = useState('');
  const [genSectionId, setGenSectionId] = useState('');

  // Single User Creation State
  const [singleUser, setSingleUser] = useState({
    role: 'Student',
    fullName: '',
    email: '',
    password: '',
    sectionId: '',
    rollNo: '',
    regNo: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data: clsData } = await supabase.from('classes').select('*').order('numeric_level');
    setClasses(clsData || []);
    const { data: secData } = await supabase.from('sections').select('*, classes(name)').order('id');
    setSections(secData || []);
    const { data: credData } = await supabase.from('student_credentials').select(`
      id, username, password_plain, profile_id, 
      profiles (id, full_name, students (registration_no, roll_no, section_id, sections(id, name, class_id, classes(name))))
    `).order('username', { ascending: true });
    setCredentials(credData || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (singleUser.role === 'Student') {
        // 1. Create Profile
        const { data: profile, error: pErr } = await supabase.from('profiles').insert([{
           full_name: singleUser.fullName,
           role: 'student',
           phone: ''
        }]).select().single();
        if (pErr) throw pErr;

        // 2. Create Student Record
        const { error: sErr } = await supabase.from('students').insert([{
          profile_id: profile.id,
          registration_no: singleUser.regNo,
          section_id: parseInt(singleUser.sectionId),
          roll_no: parseInt(singleUser.rollNo)
        }]);
        if (sErr) throw sErr;

        // 3. Create Credentials
        const uniqueSuffix = singleUser.regNo.replace(/[^a-zA-Z0-9]/g, '');
        const { error: cErr } = await supabase.from('student_credentials').insert([{
          profile_id: profile.id,
          username: `OSS-${uniqueSuffix}`,
          password_plain: singleUser.password || String(singleUser.rollNo).padStart(4, '0')
        }]);
        if (cErr) throw cErr;

        alert('Student created successfully!');
      } else {
        // Staff Creation (Admin, Accountant, Teacher, Incharge, etc.)
        // This is a profile-only creation for now as full Auth needs email signup
        const { error: pErr } = await supabase.from('profiles').insert([{
          full_name: singleUser.fullName,
          role: singleUser.role.toLowerCase(),
          phone: singleUser.email // Store email in phone field as a temp identifier if needed
        }]);
        if (pErr) throw pErr;
        alert(`${singleUser.role} Profile created. Note: Staff must sign up with ${singleUser.email} to gain Auth access.`);
      }

      setSingleUser({ role: 'Student', fullName: '', email: '', password: '', sectionId: '', rollNo: '', regNo: '' });
      fetchData();
    } catch (err) {
      alert('Error creating user: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCredentials = credentials.filter(c => {
    const student = c.profiles?.students?.[0];
    const section = student?.sections;
    const matchesQuery = c.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !dirClassId || String(section?.class_id) === String(dirClassId);
    const matchesSection = !dirSectionId || String(section?.id) === String(dirSectionId);
    return matchesQuery && matchesClass && matchesSection;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
          <p className="text-sm text-slate-400 mt-0.5">Control center for school identities</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveSubTab('students')} className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'students' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400'}`}>Directory</button>
          <button onClick={() => setActiveSubTab('bulk')} className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'bulk' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400'}`}>Bulk Generator</button>
          <button onClick={() => setActiveSubTab('create')} className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'create' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400'}`}>User Creation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activeSubTab === 'students' && (
          <div className="card overflow-hidden">
             {/* Filter Bar */}
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 gap-2 flex-1 min-w-[200px]">
                  <Search size={14} className="text-slate-400" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search students..." className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400" />
                </div>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none" value={dirClassId} onChange={(e) => { setDirClassId(e.target.value); setDirSectionId(''); }}>
                  <option value="">All Classes</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none" value={dirSectionId} onChange={(e) => setDirSectionId(e.target.value)}>
                  <option value="">All Sections</option>
                  {sections.filter(s => !dirClassId || String(s.class_id) === String(dirClassId)).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <button onClick={() => {}} className="btn btn-secondary text-xs px-4 ml-auto" title="Click to print the filtered directory">
                   <Printer size={14} /> Print IDs
                </button>
              </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class / Section</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCredentials.map((cred, idx) => (
                  <tr key={cred.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                    <td className="text-sm font-semibold text-slate-700">{cred.profiles?.full_name}</td>
                    <td><span className="badge badge-info">{cred.profiles?.students?.[0]?.sections?.classes?.name} - {cred.profiles?.students?.[0]?.sections?.name}</span></td>
                    <td className="font-mono text-xs font-bold text-indigo-600">{cred.username}</td>
                    <td><code className="bg-slate-100 px-2 py-1 rounded text-slate-500">{cred.password_plain}</code></td>
                    <td className="text-right"><button onClick={() => handleStartEdit(cred)} className="p-2 text-slate-300 hover:text-indigo-500"><Edit2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'bulk' && (
          <div className="card p-8 max-w-xl mx-auto">
             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><Cpu size={24} /></div>
                <h3 className="text-lg font-bold text-slate-800">Bulk Credential Factory</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <select className="input" value={genClassId} onChange={(e) => { setGenClassId(e.target.value); setGenSectionId(''); }}>
                  <option value="">Select Class...</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select className="input" value={genSectionId} onChange={(e) => setGenSectionId(e.target.value)}>
                  <option value="">Select Section...</option>
                  {sections.filter(s => !genClassId || String(s.class_id) === String(genClassId)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button onClick={handleBulkGenerate} disabled={isLoading} className="btn btn-primary w-full py-4 uppercase tracking-widest">
                {isLoading ? <RefreshCw size={20} className="animate-spin" /> : 'Initialize Access Records'}
              </button>
          </div>
        )}

        {activeSubTab === 'create' && (
          <div className="card p-8 max-w-2xl mx-auto">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><UserPlus size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Single User Creation</h3>
                  <p className="text-sm text-slate-400">Instantly provision a new identity in the system</p>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">System Role</label>
                    <select 
                      className="input" 
                      value={singleUser.role} 
                      onChange={(e) => setSingleUser({...singleUser, role: e.target.value})}
                    >
                      {['Student', 'Admin', 'Accountant', 'Incharge', 'Teacher', 'Non-teaching staff'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Full Legal Name</label>
                    <input required type="text" placeholder="e.g. Roshan Bhandari" className="input" value={singleUser.fullName} onChange={(e) => setSingleUser({...singleUser, fullName: e.target.value})} />
                  </div>

                  {singleUser.role === 'Student' ? (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Registration ID</label>
                        <input required type="text" placeholder="AD-2024-001" className="input" value={singleUser.regNo} onChange={(e) => setSingleUser({...singleUser, regNo: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Grade & Section</label>
                        <select required className="input" value={singleUser.sectionId} onChange={(e) => setSingleUser({...singleUser, sectionId: e.target.value})}>
                          <option value="">Select Target...</option>
                          {sections.map(s => <option key={s.id} value={s.id}>{s.classes?.name} - {s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Roll Number</label>
                        <input required type="number" placeholder="1" className="input" value={singleUser.rollNo} onChange={(e) => setSingleUser({...singleUser, rollNo: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Corporate Email</label>
                      <input required type="email" placeholder="staff@kalyan.edu.np" className="input" value={singleUser.email} onChange={(e) => setSingleUser({...singleUser, email: e.target.value})} />
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Initial Password</label>
                    <input type="text" placeholder="Leave empty for auto-PIN" className="input" value={singleUser.password} onChange={(e) => setSingleUser({...singleUser, password: e.target.value})} />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase font-medium border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50">
                      <Lock size={12} /> Encrypted Identity Packet
                   </div>
                   <button type="submit" disabled={isLoading} className="btn btn-primary px-8">
                     {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Deploy User Identity'}
                   </button>
                </div>
              </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
