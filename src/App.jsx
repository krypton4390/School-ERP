import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import DashboardLayout from './components/DashboardLayout';
import logo from './assets/logo.png';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState('Student');
  const [academicYear, setAcademicYear] = useState('2083');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const localUser = localStorage.getItem('erp_user');
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
        setIsAuthenticated(true);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single();
        const userObj = { username: session.user.email, name: profile?.full_name || 'Admin', role: profile?.role || 'admin', id: session.user.id };
        setCurrentUser(userObj);
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (role === 'Student') {
        const { data: cred, error: cError } = await supabase
          .from('student_credentials')
          .select('*, profiles(full_name, id, role)')
          .eq('username', username)
          .eq('password_plain', password)
          .maybeSingle();
        if (cError || !cred) throw new Error('Invalid Student ID or Password');
        const studentUser = { username: cred.username, name: cred.profiles?.full_name, role: 'student', id: cred.profiles?.id };
        localStorage.setItem('erp_user', JSON.stringify(studentUser));
        setCurrentUser(studentUser);
        setIsAuthenticated(true);
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username}@kalyan.edu.np`,
          password: password,
        });
        if (authError) throw authError;
        const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', data.user.id).single();
        const adminUser = { username: data.user.email, name: profile?.full_name || 'Staff', role: profile?.role || 'admin', id: data.user.id };
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout 
        user={currentUser} 
        onLogout={() => { 
          supabase.auth.signOut(); 
          localStorage.removeItem('erp_user'); 
          setIsAuthenticated(false); 
          setCurrentUser(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-10 shadow-xl shadow-slate-200/50"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Kalyan ERP Logo" className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to Kalyan ERP</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Role Selector */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {['Student', 'Teacher', 'Admin'].map((r) => (
              <button 
                key={r} 
                type="button" 
                onClick={() => { setRole(r); setError(''); }} 
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200
                  ${role === r 
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Academic Year</label>
            <select 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)} 
              className="input"
            >
              <option value="2083">2083 B.S.</option>
              <option value="2084">2084 B.S.</option>
            </select>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">
              {role === 'Student' ? 'Student ID' : 'Email Address'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder={role === 'Student' ? 'OSS-0001' : 'admin@kalyan.edu.np'} 
                className="input pl-10" 
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="input pl-10 pr-10" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Submit */}
          <button 
            disabled={isLoading} 
            className="btn btn-primary w-full py-3 text-sm"
          >
            {isLoading 
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
              : <>Sign In <ChevronRight size={16} /></>
            }
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2083 Kalyan ERP • All rights reserved
        </p>
      </motion.div>
    </div>
  );
};

export default App;
