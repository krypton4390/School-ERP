import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Calculator,
  Save,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const ResultsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize Data
  useEffect(() => {
    const init = async () => {
      const { data: eData } = await supabase.from('exams').select('*').order('date', { ascending: true });
      const { data: sData } = await supabase.from('sections').select('id, name, classes(name)');
      const { data: subData } = await supabase.from('subjects').select('*').order('name');
      
      if (eData) setExams(eData);
      if (sData) setSections(sData);
      if (subData) setSubjects(subData);

      if (eData?.length) setSelectedExam(eData[0].id);
      if (sData?.length) setSelectedSection(sData[0].id);
      if (subData?.length) setSelectedSubject(subData[0].id);
    };
    init();
  }, []);

  // Fetch Marks Grid
  const fetchMarksGrid = async () => {
    if (!selectedSection || !selectedSubject || !selectedExam) return;
    
    setIsLoading(true);
    try {
      // 1. Fetch Students
      const { data: studentList } = await supabase
        .from('students')
        .select(`id, roll_no, profiles(full_name)`)
        .eq('section_id', selectedSection)
        .order('roll_no', { ascending: true });

      // 2. Fetch Existing Marks
      const { data: existingMarks } = await supabase
        .from('marks')
        .select('*')
        .eq('exam_id', selectedExam)
        .eq('subject_id', selectedSubject);

      const marksMap = {};
      existingMarks?.forEach(m => {
        marksMap[m.student_id] = { theory: m.marks_obtained || '', practical: m.practical_marks || '' };
      });

      const grid = studentList?.map(s => ({
        id: s.id,
        name: s.profiles?.full_name,
        roll: s.roll_no,
        theory: marksMap[s.id]?.theory || '',
        practical: marksMap[s.id]?.practical || '',
      })) || [];

      setStudents(grid);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarksGrid();
  }, [selectedSection, selectedSubject, selectedExam]);

  const handleMarkChange = (id, field, value) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveMarks = async () => {
    setIsSaving(true);
    try {
      const records = students
        .filter(s => s.theory !== '' || s.practical !== '')
        .map(s => ({
          student_id: s.id,
          exam_id: parseInt(selectedExam),
          subject_id: parseInt(selectedSubject),
          marks_obtained: parseFloat(s.theory) || 0,
          practical_marks: parseFloat(s.practical) || 0,
        }));

      // Use the bulk upsert function (RPC) we defined earlier for high performance
      const { error } = await supabase.rpc('bulk_upsert_marks', {
        p_marks_data: records
      });

      if (error) throw error;
      alert('Marks saved successfully!');
    } catch (err) {
      alert('Error saving marks: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Filters & Actions */}
      <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex items-center glass-input rounded-2xl px-4 py-3 gap-3 w-full md:w-64">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="glass-input rounded-2xl px-4 py-3 text-sm text-white outline-none min-w-[140px] cursor-pointer"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {sections.map(s => <option key={s.id} value={s.id} className="bg-[#0f172a] text-white">{s.classes?.name}-{s.name}</option>)}
          </select>

          <select 
            className="glass-input rounded-2xl px-4 py-3 text-sm text-white outline-none min-w-[180px] cursor-pointer"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            {exams.map(e => <option key={e.id} value={e.id} className="bg-[#0f172a] text-white">{e.name}</option>)}
          </select>

          <select 
            className="glass-input rounded-2xl px-4 py-3 text-sm text-white outline-none min-w-[140px] cursor-pointer"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map(s => <option key={s.id} value={s.id} className="bg-[#0f172a] text-white">{s.name}</option>)}
          </select>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <button 
             onClick={saveMarks}
             disabled={isSaving || students.length === 0}
             className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Marks'}
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center min-w-[120px]">Theory</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center min-w-[120px]">Practical</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan="6" className="p-20 text-center text-slate-500 italic">Preparing marksheet grid...</td></tr>
              ) : students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => {
                const total = (parseFloat(student.theory) || 0) + (parseFloat(student.practical) || 0);
                return (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-blue-400">{student.roll}</td>
                    <td className="px-6 py-4 font-semibold text-white">{student.name}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        className="w-full glass-input rounded-xl px-3 py-2 text-center text-white text-sm"
                        placeholder="--"
                        value={student.theory}
                        onChange={(e) => handleMarkChange(student.id, 'theory', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        className="w-full glass-input rounded-xl px-3 py-2 text-center text-white text-sm"
                        placeholder="--"
                        value={student.practical}
                        onChange={(e) => handleMarkChange(student.id, 'practical', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${total >= 40 ? 'text-white' : 'text-rose-400'}`}>{total}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {total >= 40 ? (
                        <CheckCircle2 size={16} className="text-emerald-500 inline ml-2" />
                      ) : (
                        <AlertCircle size={16} className="text-rose-500 inline ml-2" />
                      )}
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && !isLoading && (
                <tr><td colSpan="6" className="p-20 text-center text-slate-500 italic">No students found. Add students to this section first.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
         <p className="text-[10px] text-slate-500 uppercase font-medium">Auto-saving feature coming soon. Press "Save Marks" to commit changes manually.</p>
      </div>
    </div>
  );
};

export default ResultsManager;
