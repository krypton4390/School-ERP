import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Search, 
  Download, 
  ChevronRight,
  Filter,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  IndianRupee,
  MoreHorizontal,
  Calendar,
  CreditCard
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const FinanceModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState({ total: 0, pending: 0, targetPct: 0, activePayers: 0 });
  
  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({ regNo: '', amount: '', category: 'Tuition Fee', remarks: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    const { data: payData } = await supabase
      .from('payments')
      .select(`
        id, 
        amount_paid, 
        payment_date, 
        payment_method, 
        remarks,
        students (registration_no, profiles (full_name))
      `)
      .order('created_at', { ascending: false })
      .limit(25);

    if (payData) {
      setTransactions(payData.map((p, idx) => ({
        id: `TXN-${String(p.id).padStart(4, '0')}`,
        student: p.students?.profiles?.full_name || 'Unknown',
        regNo: p.students?.registration_no || '—',
        date: new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: parseFloat(p.amount_paid),
        method: p.payment_method || 'Cash',
        status: 'Paid',
        remarks: p.remarks || ''
      })));

      const total = payData.reduce((acc, p) => acc + parseFloat(p.amount_paid), 0);
      setCollections({ total, pending: 412000, targetPct: 78, activePayers: payData.length });
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchFinanceData(); }, []);

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('registration_no', paymentForm.regNo)
        .single();
      if (!student) throw new Error('Student not found with this Registration Number');

      const { error } = await supabase.from('payments').insert([{
        student_id: student.id,
        amount_paid: parseFloat(paymentForm.amount),
        remarks: `${paymentForm.category}: ${paymentForm.remarks}`.trim(),
        payment_method: 'Cash'
      }]);
      if (error) throw error;

      setPaymentForm({ regNo: '', amount: '', category: 'Tuition Fee', remarks: '' });
      fetchFinanceData();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTxns = transactions
    .filter(t => t.student.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => filterMethod === 'All' || t.method === filterMethod);

  const statCards = [
    { 
      label: 'Total Collected', 
      value: `रू ${collections.total.toLocaleString()}`, 
      change: '+18.2%', 
      trend: 'up',
      icon: <TrendingUp size={20} />, 
      iconBg: 'bg-emerald-50', 
      iconColor: 'text-emerald-600',
      cardClass: 'green'
    },
    { 
      label: 'Pending Fees', 
      value: `रू ${collections.pending.toLocaleString()}`, 
      change: '-4.1%', 
      trend: 'down',
      icon: <AlertCircle size={20} />, 
      iconBg: 'bg-red-50', 
      iconColor: 'text-red-500',
      cardClass: 'red'
    },
    { 
      label: 'Monthly Target', 
      value: `${collections.targetPct}%`, 
      change: 'On track', 
      trend: 'up',
      icon: <Target size={20} />, 
      iconBg: 'bg-indigo-50', 
      iconColor: 'text-indigo-600',
      cardClass: 'blue'
    },
    { 
      label: 'Active Payers', 
      value: collections.activePayers, 
      change: '+12', 
      trend: 'up',
      icon: <Users size={20} />, 
      iconBg: 'bg-purple-50', 
      iconColor: 'text-purple-600',
      cardClass: 'purple'
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ═══ KPI Stat Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`stat-card ${stat.cardClass}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                stat.trend === 'up' 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-red-500 bg-red-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
            
            {/* Progress bar for Monthly Target */}
            {stat.cardClass === 'blue' && (
              <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${collections.targetPct}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ═══ Main Content Grid ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ═══ Transaction Table ═══ */}
        <div className="xl:col-span-2 card overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Showing latest {filteredTxns.length} records</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {/* Search */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 gap-2 flex-1 md:w-56">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Filter */}
              <select 
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none cursor-pointer"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <Loader2 size={24} className="animate-spin text-indigo-500 mx-auto" />
                      <p className="text-sm text-slate-400 mt-2">Loading transactions...</p>
                    </td>
                  </tr>
                ) : filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16 text-sm text-slate-400">
                      No transactions found
                    </td>
                  </tr>
                ) : filteredTxns.map((txn, idx) => (
                  <tr key={txn.id} className={idx % 2 === 1 ? 'bg-slate-50/50' : ''}>
                    <td>
                      <span className="text-xs font-mono font-semibold text-slate-500">{txn.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                          {txn.student.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{txn.student}</p>
                          <p className="text-[10px] text-slate-400">{txn.regNo}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar size={12} className="text-slate-400" />
                        {txn.date}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-bold text-slate-800">रू {txn.amount.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{txn.method}</span>
                    </td>
                    <td className="text-right">
                      <span className="badge badge-success">
                        <CheckCircle2 size={10} /> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ Right Sidebar ═══ */}
        <div className="space-y-6">
          {/* Quick Fee Collection */}
          <div className="card p-6 border-t-3 border-t-indigo-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Quick Collection</h3>
                <p className="text-[11px] text-slate-400">Record a new payment</p>
              </div>
            </div>
            
            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Student Reg. No</label>
                <input 
                  required type="text" placeholder="e.g. AD-2024-001" 
                  className="input text-sm" 
                  value={paymentForm.regNo}
                  onChange={(e) => setPaymentForm({...paymentForm, regNo: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Amount (रू)</label>
                <input 
                  required type="number" placeholder="Enter amount" 
                  className="input text-sm font-bold" 
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Category</label>
                <select 
                  className="input text-sm"
                  value={paymentForm.category}
                  onChange={(e) => setPaymentForm({...paymentForm, category: e.target.value})}
                >
                  <option>Tuition Fee</option>
                  <option>Exam Fee</option>
                  <option>Bus Fee</option>
                  <option>Misc Fee</option>
                </select>
              </div>
              <button 
                type="submit" disabled={isProcessing}
                className="btn btn-primary w-full py-3 text-sm mt-2"
              >
                {isProcessing 
                  ? <Loader2 size={16} className="animate-spin" /> 
                  : <>Process Payment <ChevronRight size={14} /></>
                }
              </button>
            </form>
          </div>

          {/* Reports */}
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Financial Reports</h3>
            <div className="space-y-2">
              {['Annual Fee Report', 'Defaulters List', 'Expense Summary', 'Monthly Statement'].map((report) => (
                <button 
                  key={report} 
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-sm group"
                >
                  <span className="text-slate-600 font-medium">{report}</span>
                  <Download size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;
