import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  Clock,
  MapPin
} from 'lucide-react';

const CalendarView = () => {
  const [view, setView] = useState('Month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Mock events
  const events = [
    { id: 1, title: 'Final Exams', type: 'exam', date: '2026-04-22', color: 'red' },
    { id: 2, title: 'Spring Break', type: 'holiday', date: '2026-04-20', color: 'green' },
    { id: 3, title: 'Staff Meeting', type: 'event', date: '2026-04-25', color: 'blue' },
    { id: 4, title: 'Science Fair', type: 'event', date: '2026-04-22', color: 'blue' },
  ];

  // Simple calendar math for demo
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Add empty slots for the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const currentDays = getDaysInMonth(selectedDate);
  const currentMonthName = selectedDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="glass rounded-3xl p-6 border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">{currentMonthName} {selectedDate.getFullYear()}</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1 glass rounded-2xl">
              {['Month', 'Week', 'Day'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                    view === v 
                      ? 'bg-blue-600/30 text-blue-400 border border-blue-400/20' 
                      : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              <Plus size={18} /> Add Event
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {days.map(day => (
              <div key={day} className="bg-[#0f172a] p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                {day}
              </div>
            ))}
            {currentDays.map((day, idx) => (
              <div key={idx} className={`bg-[#0f172a] min-h-[120px] p-2 border-t border-white/5 ${day === null ? 'opacity-20' : ''}`}>
                {day && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-semibold ${day === 22 ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {events.filter(e => e.date === `2026-04-${day.toString().padStart(2, '0')}`).map(event => (
                        <div 
                          key={event.id}
                          className={`text-[10px] p-1.5 rounded-lg border flex items-center gap-1.5 ${
                            event.color === 'red' 
                              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                              : event.color === 'green'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-400/20'
                          }`}
                        >
                          <div className={`w-1 h-1 rounded-full ${
                             event.color === 'red' ? 'bg-red-400' : event.color === 'green' ? 'bg-emerald-400' : 'bg-blue-400'
                          }`} />
                          <span className="truncate font-medium">{event.title}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Management Area */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="glass rounded-3xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Quick Add</h3>
            <button className="text-slate-500 hover:text-white"><MoreVertical size={18} /></button>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Title</label>
              <input 
                type="text" 
                placeholder="Ex. Parent Teacher Meeting" 
                className="w-full p-3 rounded-xl glass-input text-white text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
              <select className="w-full p-3 rounded-xl glass-input text-white text-sm outline-none">
                <option value="event">General Event</option>
                <option value="exam">Examination</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                <div className="relative">
                  <input type="date" className="w-full p-3 pl-10 rounded-xl glass-input text-white text-xs" />
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</label>
                <div className="relative">
                  <input type="time" className="w-full p-3 pl-10 rounded-xl glass-input text-white text-xs" />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl bg-blue-600/20 text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all">
              Save Event
            </button>
          </form>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5 flex-1">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Filter size={18} className="text-blue-400" /> Legend
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/20" />
              <span className="text-sm text-slate-300 font-medium">Exams & Tests</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
              <span className="text-sm text-slate-300 font-medium">Holidays</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
              <span className="text-sm text-slate-300 font-medium">Events & Activities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
