import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Smartphone, 
  MessageSquare, 
  History,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Notifications = () => {
  const [recipient, setRecipient] = useState('All');
  const [channels, setChannels] = useState({ push: true, sms: false });
  const [message, setMessage] = useState('');

  const recipients = [
    { id: 'All', label: 'All Students & Staff', icon: <Users size={18} /> },
    { id: 'Grade 10', label: 'Grade 10 Only', icon: <GraduationCap size={18} /> },
    { id: 'Staff', label: 'Teaching Staff', icon: <UserCheck size={18} /> },
  ];

  const recentAlerts = [
    { id: 1, title: 'Holiday Notice', date: '2h ago', type: 'SMS', status: 'Delivered' },
    { id: 2, title: 'Fee Reminder', date: '5h ago', type: 'Push', status: 'Delivered' },
    { id: 3, title: 'Exam Schedule', date: 'Yesterday', type: 'Both', status: 'Failed (2)', error: true },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Alert Composer */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="glass rounded-3xl p-8 border border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Send New Alert</h2>
              <p className="text-slate-500 text-sm">Broadcast messages to your institution</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Recipient Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-300">Select Recipients</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recipients.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRecipient(r.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${
                      recipient === r.id 
                        ? 'bg-blue-600/20 text-blue-400 border-blue-400/30' 
                        : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {r.icon}
                    <span className="font-semibold text-sm">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-300">Your Message</label>
              <textarea 
                rows="5"
                placeholder="Type your announcement here..."
                className="w-full glass-input rounded-2xl p-4 text-white text-sm outline-none resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 min-w-[200px]">
                <div className={`p-2 rounded-lg ${channels.push ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Smartphone size={18} />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-300">Push Notification</span>
                <button 
                  onClick={() => setChannels({...channels, push: !channels.push})}
                  className={`w-10 h-5 rounded-full relative transition-colors ${channels.push ? 'bg-blue-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${channels.push ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 min-w-[200px]">
                <div className={`p-2 rounded-lg ${channels.sms ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <MessageSquare size={18} />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-300">SMS Alert</span>
                <button 
                  onClick={() => setChannels({...channels, sms: !channels.sms})}
                  className={`w-10 h-5 rounded-full relative transition-colors ${channels.sms ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${channels.sms ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3">
              <Send size={20} />
              Broadcast Announcement
            </button>
          </div>
        </div>
      </div>

      {/* History / Status Area */}
      <div className="flex flex-col gap-8">
        <div className="glass rounded-3xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <History size={20} className="text-slate-500" /> Recent Alerts
            </h3>
          </div>
          
          <div className="space-y-6">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white">{alert.title}</h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{alert.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold">{alert.type}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold ${alert.error ? 'text-red-400' : 'text-emerald-400'}`}>
                    {alert.error ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {alert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl bg-white/5 text-slate-400 font-semibold hover:text-white transition-all text-sm">
            View Full Log
          </button>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/5 bg-blue-500/5">
          <h3 className="font-bold text-white mb-2">Usage Limit</h3>
          <p className="text-xs text-slate-500 mb-4">Your monthly SMS quota is remaining.</p>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div className="w-3/4 h-full bg-blue-500" />
          </div>
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-blue-400">750 Sent</span>
            <span className="text-slate-500">1000 Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
