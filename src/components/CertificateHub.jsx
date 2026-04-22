import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UserCircle, 
  Download, 
  Check, 
  Search, 
  IdCard, 
  Award, 
  ArrowRight,
  Printer,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import logo from '../assets/logo.png';

const CertificateHub = () => {
  const [selectedType, setSelectedType] = useState('ID Card');

  const templates = [
    { name: 'Student ID Card', icon: <IdCard size={24} />, desc: 'Standard biometric format' },
    { name: 'Character Certificate', icon: <Award size={24} />, desc: 'For graduating students' },
    { name: 'Transfer Certificate', icon: <FileText size={24} />, desc: 'Official school leaving' },
    { name: 'Merit Award', icon: <Smartphone size={24} />, desc: 'Academic excellence' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Certificate Center</h2>
          <p className="text-slate-500">Generate and issue official school documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass p-6 rounded-3xl border cursor-pointer transition-all ${
              selectedType === template.name ? 'border-blue-500 bg-blue-600/5' : 'border-white/5 hover:border-white/10'
            }`}
            onClick={() => setSelectedType(template.name)}
          >
            <div className={`p-4 w-fit rounded-2xl mb-6 ${
              selectedType === template.name ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'
            }`}>
              {template.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
            <p className="text-sm text-slate-500">{template.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: Preview */}
        <div className="xl:col-span-2 glass rounded-3xl p-12 border border-white/5 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Preview</span>
          </div>

          <AnimatePresence mode="wait">
            {selectedType === 'ID Card' ? (
              <motion.div
                key="id-card"
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                className="w-80 h-[480px] bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative"
              >
                {/* ID Card Front */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-emerald-600 p-4 flex items-center gap-3">
                  <img src={logo} alt="Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                  <div>
                    <h4 className="text-white text-xs font-bold leading-tight">KALYAN ACADEMY</h4>
                    <p className="text-white/70 text-[8px]">Innovation in Education</p>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col items-center">
                   <div className="w-32 h-32 rounded-xl bg-slate-800 border-4 border-white/10 mb-4 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-4xl">S.K</div>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-1">Shiva Kalyan</h3>
                   <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/5 pb-2 w-full text-center">STUDENT</p>
                   
                   <div className="space-y-3 w-full text-left">
                      <div className="flex justify-between">
                         <span className="text-[10px] text-slate-500">Roll Number</span>
                         <span className="text-[10px] text-white font-mono">2083-1024</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] text-slate-500">Class</span>
                         <span className="text-[10px] text-white">Grade 10 - 'A'</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] text-slate-500">Blood Group</span>
                         <span className="text-[10px] text-rose-400 font-bold">B +ve</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] text-slate-500">Validity</span>
                         <span className="text-[10px] text-white">2084 Kartik</span>
                      </div>
                   </div>

                   <div className="mt-8 pt-4 border-t border-white/5 w-full flex flex-col items-center gap-2">
                      <div className="w-full h-8 bg-white/5 rounded flex items-center justify-center">
                         <div className="flex gap-1">
                            {[1,1,2,1,2,1,1,2,1,2,2,1,1].map((n, i) => (
                              <div key={i} className={`w-[2px] h-4 bg-slate-500 ${n === 2 ? 'w-[4px]' : ''}`}></div>
                            ))}
                         </div>
                      </div>
                      <span className="text-[8px] text-slate-600">kalyan_erp_verified_v01</span>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cert"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-[500px] aspect-[1.41] bg-white p-12 shadow-2xl relative border-8 border-double border-slate-200"
              >
                 <div className="absolute top-8 right-8 text-slate-300">
                    <ShieldCheck size={48} />
                 </div>
                 <div className="flex flex-col items-center text-center text-slate-900 space-y-6">
                    <img src={logo} alt="Logo" className="w-12 h-12 grayscale" />
                    <div>
                      <h4 className="text-xl font-serif font-black tracking-widest text-slate-800">KALYAN ACADEMY</h4>
                      <p className="text-[10px] uppercase font-bold text-slate-500 border-t border-slate-200 pt-1">Kathmandu, Nepal</p>
                    </div>
                    
                    <h2 className="text-3xl font-serif font-bold text-amber-700 italic border-b-2 border-amber-100 pb-2">
                       {selectedType.toUpperCase()}
                    </h2>

                    <p className="text-xs leading-relaxed max-w-sm">
                       This is to certify that <b>John Doe</b> has successfully completed 
                       his academic cycle for the year 2083 with excellence.
                    </p>

                    <div className="w-full flex justify-between mt-12 pt-8">
                       <div className="flex flex-col items-center">
                          <div className="w-24 h-px bg-slate-300 mb-2"></div>
                          <span className="text-[10px] font-bold text-slate-500">Date Issued</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <div className="w-24 h-px bg-slate-300 mb-2"></div>
                          <span className="text-[10px] font-bold text-slate-500">Principal Signature</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Controls */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Issue New Document</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Search Student</label>
                <div className="glass-input p-3 rounded-xl flex items-center gap-2">
                   <Search size={16} className="text-slate-500" />
                   <input type="text" placeholder="Student ID or Name..." className="bg-transparent border-none outline-none text-white text-sm w-full" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                    <div>
                       <p className="text-sm font-bold text-white">No student selected</p>
                       <p className="text-xs text-slate-500">Please search to begin</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
                  <Printer size={18} /> Print Document
                </button>
                <button className="w-full py-4 glass text-slate-300 font-bold rounded-2xl border border-white/5 hover:bg-white/5 flex items-center justify-center gap-2">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Verification Check</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
               Every issued certificate contains a unique cryptographic hash for digital verification.
            </p>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
               <ShieldCheck size={32} className="text-blue-400 mx-auto mb-3" />
               <p className="text-xs font-bold text-blue-300">Blockchain Secured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateHub;
