import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  UserSquare, 
  MoreVertical,
  Shield,
  Briefcase,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const StaffRecords = () => {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'teacher',
    phone: '',
    email: ''
  });

  const fetchStaff = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'student') // Only non-students (staff/admin)
      .order('full_name', { ascending: true });
    
    if (!error) setStaff(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Note: Creating staff usually involves creating an AUTH user too if they need login.
    // For now, we create the profile.
    const { error } = await supabase
      .from('profiles')
      .insert([{ 
        full_name: formData.name, 
        role: formData.role, 
        phone: formData.phone 
      }]);
    
    if (!error) {
      setIsModalOpen(false);
      setFormData({ name: '', role: 'teacher', phone: '', email: '' });
      fetchStaff();
    } else {
      alert(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Staff Directory</h2>
          <p className="text-slate-500">Manage teachers, administrators, and support staff</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white/5 text-slate-300 font-bold rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus size={20} /> Add Staff
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Staff', value: staff.length, icon: <Users size={20} />, color: 'blue' },
          { label: 'Teachers', value: staff.filter(s => s.role === 'teacher').length, icon: <Briefcase size={20} />, color: 'emerald' },
          { label: 'Admins', value: staff.filter(s => s.role === 'admin').length, icon: <Shield size={20} />, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-${s.color}-500/10 text-${s.color}-400`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h4 className="text-2xl font-bold text-white">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center glass-input rounded-2xl px-4 py-2 gap-3 w-80">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staff.filter(s => s.full_name.toLowerCase().includes(searchTerm.toLowerCase())).map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-blue-400">
                        {member.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{member.full_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">Joined {new Date(member.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-slate-400">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                       member.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                     }`}>
                        {member.role}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                       <button className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all"><Phone size={14} /></button>
                       <button className="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 transition-all"><Mail size={14} /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-600 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md glass rounded-3xl border border-white/10 p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Register New Staff</h3>
                <form onSubmit={handleCreateStaff} className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                      <input required className="w-full glass-input p-3 rounded-xl text-white underline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Designation/Role</label>
                      <select className="w-full glass-input p-3 rounded-xl text-white outline-none appearance-none" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                         <option value="teacher" className="bg-slate-900">Teacher</option>
                         <option value="admin" className="bg-slate-900">Administrator</option>
                         <option value="accountant" className="bg-slate-900">Accountant</option>
                         <option value="staff" className="bg-slate-900">Other Staff</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <input required className="w-full glass-input p-3 rounded-xl text-white underline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                   </div>
                   <div className="flex gap-3 pt-6">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 glass text-slate-400 font-bold rounded-xl border border-white/5">Cancel</button>
                      <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">{isLoading ? 'Saving...' : 'Register'}</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffRecords;
