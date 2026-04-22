import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bus, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  Search, 
  Users,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const TransportModule = () => {
  const [activeRoute, setActiveRoute] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransportData = async () => {
    setIsLoading(true);
    // 1. Fetch Vehicles
    const { data: vData } = await supabase.from('vehicles').select('*');
    if (vData) setVehicles(vData);

    // 2. Fetch Routes
    const { data: rData } = await supabase
      .from('routes')
      .select('*, vehicles(*)');
    if (rData) setRoutes(rData);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransportData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Transport Fleet</h2>
          <p className="text-slate-500">Manage {routes.length} active routes and student transportation</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20">
            Add New Route
          </button>
          <button className="px-6 py-3 glass text-slate-300 font-bold rounded-2xl border border-white/5 hover:bg-white/5">
            Fleet Settings
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full p-20 text-center text-slate-500 italic">Syncing fleet status...</div>
        ) : routes.map((route, idx) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-6 rounded-3xl border transition-all cursor-pointer ${
              activeRoute === route.id ? 'border-blue-500/50 bg-blue-600/5' : 'border-white/5 hover:border-white/10'
            }`}
            onClick={() => setActiveRoute(route.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${
                route.vehicles?.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 
                route.vehicles?.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                <Bus size={24} />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                route.vehicles?.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 
                route.vehicles?.status === 'Maintenance' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {route.vehicles?.status || 'Unknown'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{route.route_name}</h3>
            <p className="text-slate-500 text-xs mb-4 uppercase font-bold tracking-widest">{route.vehicles?.plate_number || 'No Bus Assigned'}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={14} className="text-slate-600" /> {route.vehicles?.driver_name || 'TBD'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users size={14} className="text-slate-600" /> {route.vehicles?.capacity || '--'} Cap.
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
              Track Live Location
            </button>
          </motion.div>
        ))}
        {!isLoading && routes.length === 0 && (
          <div className="col-span-full glass p-20 text-center rounded-3xl border border-white/5">
             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-600">
               <MapPin size={32} />
             </div>
             <p className="text-slate-400 font-medium">No transport routes configured yet.</p>
             <button className="mt-4 text-blue-400 text-sm font-bold underline">Setup Initial Fleet</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Route Details / GPS Simulation */}
        <div className="xl:col-span-2 glass rounded-3xl p-8 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Fleet Intelligence</h3>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live System Status
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            {[
              { time: '08:00 AM', location: 'City Terminal', status: 'Passed' },
              { time: '08:15 AM', location: 'Main Highway Stop', status: 'Passed' },
              { time: '08:30 AM', location: 'Residential Block 4', status: 'In Transit', isCurrent: true },
              { time: '09:00 AM', location: 'Kalyan Campus', status: 'Upcoming' },
            ].map((stop, i) => (
              <div key={i} className="flex gap-6 relative">
                {i < 3 && <div className="absolute left-[7px] top-6 bottom-[-32px] w-[2px] bg-white/5"></div>}
                <div className={`w-4 h-4 rounded-full border-2 mt-1 z-10 ${
                   stop.isCurrent ? 'bg-blue-500 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                   stop.status === 'Passed' ? 'bg-emerald-500 border-transparent text-white flex items-center justify-center' : 'bg-transparent border-white/20'
                }`}>
                   {stop.status === 'Passed' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className={`font-bold ${stop.isCurrent ? 'text-blue-400' : 'text-slate-200'}`}>{stop.location}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{stop.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                       <Clock size={14} className="text-slate-600" /> {stop.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 right-0 bottom-0 left-0 opacity-[0.02] pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 800 400">
               <path d="M0 200 Q200 100 400 200 T800 200" stroke="white" fill="none" strokeWidth="40" />
               <circle cx="400" cy="200" r="150" stroke="white" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Assigned Drivers & Staff */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Active Duty Staff</h3>
              <Settings size={18} className="text-slate-600" />
            </div>
            <div className="space-y-4">
              {vehicles.map((v, i) => (
                <div key={v.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center font-bold text-blue-400">
                    {v.driver_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{v.driver_name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{v.plate_number} • Driver</p>
                  </div>
                  <a href={`tel:${v.driver_phone}`} className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
                    <Phone size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
             <div className="flex items-center gap-3 text-amber-500 mb-3">
               <AlertTriangle size={20} />
               <h4 className="font-bold text-sm uppercase">Maintenance Forecast</h4>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Fleet sensors and history indicate that <b>2 vehicles</b> require scheduled safety inspections this weekend.
             </p>
             <button className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20">
                View Maintenance Log
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportModule;
