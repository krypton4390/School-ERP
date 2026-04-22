import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Users, 
  GraduationCap, 
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import CalendarView from './CalendarView';
import Notifications from './Notifications';
import ResultsManager from './ResultsManager';
import ClassManagement from './ClassManagement';
import SettingsManager from './SettingsManager';
import StudentManagement from './StudentManagement';
import AttendanceModule from './AttendanceModule';
import ExamsModule from './ExamsModule';
import AdminPanel from './AdminPanel';
import StaffRecords from './StaffRecords';
import ELibrary from './ELibrary';
import FinanceModule from './FinanceModule';
import TransportModule from './TransportModule';
import CertificateHub from './CertificateHub';
import MessengerModule from './MessengerModule';
import StudentDashboard from './StudentDashboard';
import { supabase } from '../lib/supabaseClient';

const DashboardLayout = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [stats, setStats] = useState({ students: 0, teachers: 0 });

  const userRole = user?.role?.toLowerCase() || 'student';

  useEffect(() => {
    const fetchStats = async () => {
      if (userRole === 'admin') {
        const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
        const { count: teacherCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher');
        setStats({ students: studentCount || 0, teachers: teacherCount || 0 });
      }
    };
    if (activeTab === 'dashboard') fetchStats();
  }, [activeTab, userRole]);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return userRole === 'student' ? <StudentDashboard studentId={user.id} /> : <AdminDashboardHome stats={stats} setActiveTab={setActiveTab} />;
      case 'admin': return <AdminPanel />;
      case 'library': return <ELibrary />;
      case 'students': return <StudentManagement />;
      case 'attendance': return <AttendanceModule userRole={userRole} studentId={user.id} />;
      case 'exams': return <ExamsModule userRole={userRole} studentId={user.id} />;
      case 'calendar': return <CalendarView />;
      case 'results': return <ResultsManager />;
      case 'classes': return <ClassManagement />;
      case 'staff': return <StaffRecords />;
      case 'finance': return <FinanceModule userRole={userRole} studentId={user.id} />;
      case 'transport': return <TransportModule studentId={user.id} />;
      case 'certificates': return <CertificateHub studentId={user.id} />;
      case 'messages': return <MessengerModule />;
      case 'settings': return <SettingsManager />;
      default: return <div className="p-10 text-slate-500">Module coming soon...</div>;
    }
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    admin: 'Admin Panel',
    library: 'E-Library',
    students: 'Student Directory',
    attendance: 'Attendance',
    exams: 'Examination',
    calendar: 'Calendar',
    results: 'Results',
    classes: 'Class Management',
    staff: 'Staff Records',
    finance: 'Fees & Payments',
    transport: 'Bus Transport',
    certificates: 'Certificates',
    messages: 'Messages',
    settings: 'Settings',
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} userRole={userRole} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">{pageTitles[activeTab] || 'Dashboard'}</h2>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sm text-slate-400">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 gap-2 w-64">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400" 
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {user.name?.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-700 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{userRole}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{userRole} Account</p>
                    </div>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Profile Settings</button>
                    <button 
                      onClick={onLogout} 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Admin Dashboard Home
   ═══════════════════════════════════════════════════════ */
const AdminDashboardHome = ({ stats, setActiveTab }) => {
  const kpis = [
    { label: 'Total Students', value: stats.students?.toLocaleString() || '0', change: '+12%', trend: 'up', color: 'green', icon: <GraduationCap size={20} /> },
    { label: 'Teaching Staff', value: stats.teachers?.toLocaleString() || '0', change: '+3', trend: 'up', color: 'blue', icon: <Users size={20} /> },
    { label: 'Attendance Today', value: '94%', change: '+2.1%', trend: 'up', color: 'purple', icon: <CalendarCheck size={20} /> },
    { label: 'Fee Collection', value: '₹12.4L', change: '78%', trend: 'up', color: 'red', icon: <TrendingUp size={20} /> },
  ];

  const quickLinks = [
    { label: 'Mark Attendance', tab: 'attendance', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Add Student', tab: 'students', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'Collect Fee', tab: 'finance', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { label: 'View Results', tab: 'results', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`stat-card ${kpi.color}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${
                kpi.color === 'green' ? 'bg-emerald-50 text-emerald-600' :
                kpi.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                kpi.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-red-50 text-red-600'
              }`}>
                {kpi.icon}
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} />
                {kpi.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <button
                key={link.tab}
                onClick={() => setActiveTab(link.tab)}
                className={`p-4 rounded-xl border text-xs font-semibold text-center hover:shadow-md transition-all ${link.color}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-700">Weekly Performance</h3>
            <button className="text-xs text-indigo-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 px-4">
            {[45, 72, 55, 88, 67, 82, 95].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg relative group cursor-pointer"
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    {val}%
                  </div>
                </motion.div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-700">Recent Activity</h3>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">See All</button>
        </div>
        <div className="space-y-3">
          {[
            { text: 'New student registered: Ram Bahadur', time: '2 min ago', color: 'bg-indigo-500' },
            { text: 'Fee payment received: ₹15,000', time: '15 min ago', color: 'bg-emerald-500' },
            { text: 'Attendance marked for Class 10-A', time: '1 hour ago', color: 'bg-blue-500' },
            { text: 'Exam schedule published for 2083', time: '3 hours ago', color: 'bg-amber-500' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
              <p className="text-sm text-slate-600 flex-1">{item.text}</p>
              <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
