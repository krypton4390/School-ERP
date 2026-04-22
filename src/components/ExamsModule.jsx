import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Award, 
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const ExamsModule = ({ setActiveTab }) => {
  const [exams, setExams] = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExams = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('date', { ascending: true });
    
    if (data) {
      setExams(data);
      if (data.length > 0) setActiveExam(data[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="space-y-8">
      {/* Exam Selection Tabs */}
      <div className="glass rounded-3xl p-2 border border-white/5 flex flex-wrap gap-2 overflow-x-auto">
        {isLoading ? (
          <div className="p-4 text-xs text-slate-500 uppercase tracking-widest font-bold">Loading Academic Terms...</div>
        ) : exams.map((exam) => (
          <button
            key={exam.id}
            onClick={() => setActiveExam(exam)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
              activeExam?.id === exam.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {exam.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Exam Details & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 border border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">{activeExam?.name || 'No Active Exam'}</h2>
                <p className="text-slate-500 text-sm">Academic Session 2083-84</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('results')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all border border-white/10"
                >
                  <Award size={18} /> Manage Marks
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Schedule</h3>
              {activeExam ? (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between items-center group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                       {activeExam.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{activeExam.name} Start Date</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                           <Calendar size={10} /> {new Date(activeExam.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">Main Block</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Campus Hall</p>
                    </div>
                    <button className="p-2 rounded-xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 italic">Select an academic term to view schedule</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ClipboardList size={20} className="text-emerald-400" /> Exam Rules
              </h3>
              <ul className="space-y-4">
                {[
                  'Arrive 15 minutes before the start time.',
                  'No electronic gadgets allowed in the hall.',
                  'Maintain silence throughout the duration.',
                  'Carry your admit card at all times.'
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-3xl p-8 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-400" /> Syllabus Status
              </h3>
              <div className="space-y-6">
                {[
                  { sub: 'Mathematics', prog: 90 },
                  { sub: 'English', prog: 100 },
                  { sub: 'Science', prog: 85 },
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-300">{s.sub}</span>
                      <span className="text-blue-400">{s.prog}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${s.prog}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Actions */}
        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl p-8 border border-white/5 bg-blue-600/[0.03]">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Results Center</h3>
            <p className="text-sm text-slate-500 mb-6">Access the bulk marks entry system for teachers and grade reports.</p>
            <button 
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                onClick={() => setActiveTab('results')}
            >
              Enter Student Marks <ArrowRight size={18} />
            </button>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Exam Resources</h3>
            <div className="space-y-4">
              {[
                { title: 'Model Questions', size: '2.4 MB' },
                { title: 'Practice Sets', size: '1.8 MB' },
                { title: 'Previous Year Papers', size: '5.2 MB' },
              ].map((res, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-500" />
                    <div>
                      <p className="text-xs font-bold text-white">{res.title}</p>
                      <p className="text-[10px] text-slate-500">{res.size}</p>
                    </div>
                  </div>
                  <Download size={14} className="text-slate-500 group-hover:text-blue-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsModule;
