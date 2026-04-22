import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Check, 
  XCircle, 
  RotateCw, 
  Users,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const AttendanceModule = ({ userRole, studentId }) => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => { fetchInitialData(); }, []);
  useEffect(() => { if (selectedSectionId) fetchSectionData(); }, [selectedSectionId, selectedDate]);

  const fetchInitialData = async () => {
    const { data: secData } = await supabase.from('sections').select('*, classes(name)').order('id');
    setSections(secData || []);
    if (secData?.length > 0) setSelectedSectionId(secData[0].id);
  };

  const fetchSectionData = async () => {
    setIsLoading(true);
    try {
      const { data: stdData } = await supabase.from('students').select('*, profiles(full_name)').eq('section_id', selectedSectionId).order('roll_no', { ascending: true });
      setStudents(stdData || []);
      const { data: attData } = await supabase.from('attendance').select('student_id, status').eq('date', selectedDate);
      const mapping = {};
      attData?.forEach(item => { mapping[item.student_id] = item.status; });
      setAttendanceData(mapping);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const handleStatusChange = async (targetId, status) => {
    const old = attendanceData[targetId];
    if (old === status) return;
    setAttendanceData(prev => ({ ...prev, [targetId]: status }));
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error } = await supabase.from('attendance').upsert({ student_id: targetId, date: selectedDate, status, marked_by: session?.user.id }, { onConflict: 'student_id,date' });
      if (error) throw error;
    } catch (err) {
      alert('Save failed: ' + err.message);
      setAttendanceData(prev => ({ ...prev, [targetId]: old }));
    } finally { setIsSyncing(false); }
  };

  const handleBulkAttendance = async (status) => {
    if (!window.confirm(`Mark all students ${status}?`)) return;
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const payloads = students.map(s => ({ student_id: s.id, date: selectedDate, status, marked_by: session?.user.id }));
      const { error } = await supabase.from('attendance').upsert(payloads, { onConflict: 'student_id,date' });
      if (error) throw error;
      const mapping = { ...attendanceData };
      payloads.forEach(p => mapping[p.student_id] = p.status);
      setAttendanceData(mapping);
    } catch (err) { alert(err.message); } finally { setIsSyncing(false); }
  };

  const presentCount = Object.values(attendanceData).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceData).filter(v => v === 'absent').length;
  const rate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Daily Attendance</h2>
          <p className="text-sm text-slate-400 mt-0.5">Mark and monitor student presence</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none" />
          <select value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none">
            {sections.map(s => <option key={s.id} value={s.id}>{s.classes?.name} - {s.name}</option>)}
          </select>
          {isSyncing && <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg"><RotateCw size={12} className="animate-spin" /> Saving</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16} className="text-indigo-500" /> Student Roster</h3>
            <button onClick={() => handleBulkAttendance('present')} className="btn btn-primary text-xs py-2 px-4">
              <CheckCircle2 size={14} /> Mark All Present
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">Roll</th>
                <th>Student Name</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="3" className="text-center py-16"><Loader2 size={24} className="animate-spin text-indigo-500 mx-auto" /></td></tr>
              ) : students.map((s, idx) => (
                <tr key={s.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                  <td className="font-semibold text-slate-400 text-sm">#{s.roll_no}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xs">{s.profiles?.full_name?.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{s.profiles?.full_name}</p>
                        <p className="text-[10px] text-slate-400">{s.registration_no}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleStatusChange(s.id, 'present')} className={`p-2.5 rounded-xl transition-all ${attendanceData[s.id] === 'present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`}>
                        <Check size={18} strokeWidth={3} />
                      </button>
                      <button onClick={() => handleStatusChange(s.id, 'absent')} className={`p-2.5 rounded-xl transition-all ${attendanceData[s.id] === 'absent' ? 'bg-red-500 text-white shadow-md shadow-red-200' : 'bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
                        <XCircle size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-5">
          <div className="card p-6 border-t-3 border-t-indigo-500">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Attendance Summary</h4>
            <div className="text-center mb-5">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366F1" strokeWidth="3" strokeDasharray={`${rate}, 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-800">{rate}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Overall Presence</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase">Present</p>
                <p className="text-lg font-bold text-emerald-700">{presentCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                <p className="text-[10px] font-semibold text-red-500 uppercase">Absent</p>
                <p className="text-lg font-bold text-red-600">{absentCount}</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Total Students:</span> {students.length}</p>
            <p className="text-xs text-slate-500 mt-1"><span className="font-semibold text-slate-700">Date:</span> {selectedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
