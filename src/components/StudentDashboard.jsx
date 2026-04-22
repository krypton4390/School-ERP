import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CalendarCheck, Award, CreditCard, Bell, Clock, TrendingUp, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const StudentDashboard = ({ studentId }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      // Get student profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, role')
        .eq('id', studentId)
        .single();

      const { data: student } = await supabase
        .from('students')
        .select('*, sections(name, classes(name))')
        .eq('profile_id', studentId)
        .single();

      if (profile && student) {
        setStudentInfo({
          name: profile.full_name,
          class: `${student.sections?.classes?.name} - ${student.sections?.name}`,
          roll: student.roll_no,
          regNo: student.registration_no
        });
      }

      // Calculate attendance rate
      const { data: attData } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', student?.id);

      if (attData?.length > 0) {
        const present = attData.filter(a => a.status === 'present').length;
        setAttendanceRate(Math.round((present / attData.length) * 100));
      }

      setIsLoading(false);
    };
    if (studentId) fetchStudentData();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const quickStats = [
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: <CalendarCheck size={20} />, color: 'green' },
    { label: 'Current Class', value: studentInfo?.class || '—', icon: <BookOpen size={20} />, color: 'blue' },
    { label: 'Roll Number', value: `#${studentInfo?.roll || '—'}`, icon: <Award size={20} />, color: 'purple' },
    { label: 'Fee Status', value: 'Up to date', icon: <CreditCard size={20} />, color: 'green' },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Welcome Banner */}
      <div className="card p-8 bg-gradient-to-r from-indigo-500 to-purple-600 border-none text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-8" />
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-1">{studentInfo?.name || 'Student'}</h2>
          <p className="text-indigo-200 text-sm mt-1">Registration: {studentInfo?.regNo} • {studentInfo?.class}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`stat-card ${stat.color}`}
          >
            <div className={`p-2.5 rounded-xl w-fit mb-3 ${
              stat.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              {stat.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" /> Upcoming Schedule
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Math Unit Test', date: 'Tomorrow, 10:00 AM', type: 'Exam' },
              { title: 'Science Project Due', date: 'Apr 25, 2083', type: 'Assignment' },
              { title: 'Parent-Teacher Meeting', date: 'Apr 28, 2083', type: 'Event' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
                <span className={`badge ${item.type === 'Exam' ? 'badge-warning' : item.type === 'Assignment' ? 'badge-info' : 'badge-success'}`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Bell size={16} className="text-indigo-500" /> Recent Notices
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Annual Day celebration on April 30', time: '2 hours ago' },
              { title: 'Library books return reminder', time: '1 day ago' },
              { title: 'Sports week registration open', time: '3 days ago' },
            ].map((notice, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">{notice.title}</p>
                  <p className="text-xs text-slate-400">{notice.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
