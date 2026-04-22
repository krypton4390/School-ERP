import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  UserCircle, 
  Bell, 
  Globe, 
  Key,
  Smartphone,
  ChevronRight,
  Save,
  Trash2,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsManager = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  
  const [privacySettings, setPrivacySettings] = useState([
    { id: 'contact', label: 'Show Teacher Contact to Parents', description: 'Allows parents to see the registered mobile number of class teachers.', enabled: false },
    { id: 'attendance', label: 'Public Attendance Records', description: 'Enable publicly viewable attendance percentage for rankings.', enabled: true },
    { id: 'profile', label: 'Student Bio Visibility', description: 'Show student hobby and bio on the student directory.', enabled: false },
    { id: 'results', label: 'Anonymous Result Sharing', description: 'Mask student names in top-performer public boards.', enabled: true },
  ]);

  const togglePrivacy = (id) => {
    setPrivacySettings(privacySettings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-500">Manage your account security, privacy preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation - Tablet/Desktop only sidebar for settings */}
        <div className="hidden lg:flex flex-col gap-2">
          {[
            { id: 'security', label: 'Security & Auth', icon: <Shield size={18} />, active: true },
            { id: 'privacy', label: 'Privacy Control', icon: <Eye size={18} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
            { id: 'account', label: 'Account Info', icon: <UserCircle size={18} /> },
            { id: 'api', label: 'API & Integrations', icon: <Globe size={18} /> },
          ].map(item => (
            <button 
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                item.active 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-400/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.active && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Security Section */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Security Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPass ? "text" : "password"}
                      className="w-full glass-input rounded-xl p-3 pr-10 text-white text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"}
                      className="w-full glass-input rounded-xl p-3 pr-10 text-white text-sm"
                      placeholder="••••••••"
                    />
                    <button 
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
                  <input 
                    type="password"
                    className="w-full glass-input rounded-xl p-3 text-white text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="h-px bg-white/5 my-4"></div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex gap-4">
                  <div className="p-2 h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500">Secure your account with SMS codes.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${twoFactor ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="glass rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Fingerprint size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Privacy Preferences</h3>
            </div>

            <div className="space-y-4">
              {privacySettings.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-all group">
                  <div className="max-w-[80%]">
                    <h4 className="font-bold text-white text-sm">{item.label}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                  </div>
                  <button 
                    onClick={() => togglePrivacy(item.id)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${item.enabled ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <button className="px-8 py-3 rounded-2xl bg-white/5 text-slate-400 font-bold hover:text-white transition-all">
              Discard Changes
            </button>
            <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center gap-2">
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
