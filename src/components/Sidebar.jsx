import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare, 
  Settings, 
  LogOut,
  AppWindow,
  CalendarCheck,
  Award,
  ShieldCheck,
  BookOpen,
  CreditCard,
  Bus,
  FileText,
  MessageSquare,
  Library,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'admin', label: 'Admin Panel', icon: <ShieldCheck size={20} />, roles: ['admin'] },
    { id: 'library', label: 'E-Library', icon: <BookOpen size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'students', label: 'Student Directory', icon: <Users size={20} />, roles: ['admin', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'exams', label: 'Examination', icon: <Award size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'classes', label: 'Class Management', icon: <AppWindow size={20} />, roles: ['admin'] },
    { id: 'finance', label: 'Fees & Payments', icon: <CreditCard size={20} />, roles: ['admin', 'student'] },
    { id: 'transport', label: 'Bus Transport', icon: <Bus size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'certificates', label: 'Certificates', icon: <FileText size={20} />, roles: ['admin', 'student'] },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, roles: ['admin', 'teacher', 'student'] },
    { id: 'results', label: 'Results', icon: <Library size={20} />, roles: ['admin', 'teacher'] },
    { id: 'staff', label: 'Staff Records', icon: <UserSquare size={20} />, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: ['admin', 'teacher', 'student'] },
  ].filter(item => item.roles.includes(userRole?.toLowerCase()));

  return (
    <aside className={`h-screen bg-[#1E293B] flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[260px]'} relative`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`px-6 py-6 flex items-center gap-3 border-b border-white/10 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 shrink-0">
          K
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-[15px] text-white leading-none">Kalyan ERP</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                ${isActive 
                  ? 'bg-indigo-500/15 text-white' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full" />
              )}
              <span className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-3 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button 
          onClick={onLogout} 
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-[13px] font-medium">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
