import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, Users, FileText, IndianRupee, 
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Plus, Download, Calendar, Activity, Zap, Sparkles
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, trend, icon: Icon, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="stat-card flex flex-col justify-between h-44 group"
    >
        <div className="flex justify-between items-start relative z-10">
            <div className={`p-3 rounded-xl ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
                <Icon size={22} className={color.replace('bg-', 'text-')} />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(trend)}%
            </div>
        </div>
        <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        revenue: '₹0',
        invoices: '0',
        pending: '₹0',
        customers: '0'
    });
    const [chartData, setChartData] = useState([]);
    const [showNewDocDropdown, setShowNewDocDropdown] = useState(false);

    const handleExport = () => {
        alert('Exporting business summary to CSV...');
        // Simulation of export logic
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch consolidated summary and all invoices (for total document count)
                const [summaryRes, allInvoicesRes, custRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.get('/invoices'),
                    api.get('/customers')
                ]);
                
                const summary = summaryRes.data;
                const allInvoices = allInvoicesRes.data;
                
                setData({
                    revenue: `₹${summary.totalSales.toLocaleString('en-IN')}`,
                    invoices: allInvoices.length.toLocaleString(),
                    pending: `₹${summary.totalPending.toLocaleString('en-IN')}`,
                    customers: custRes.data.length.toLocaleString()
                });

                // Set chart data from summary
                if (summary.monthlySales) {
                    setChartData(summary.monthlySales.map(s => ({ name: s.month, value: s.total })));
                }

            } catch (err) { 
                console.error('Dashboard Fetch Error:', err); 
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            {/* Top Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                        <Zap size={16} fill="currentColor" />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Analytics Overview</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
                    <div className="flex items-center gap-4 text-slate-500 font-medium bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/40 w-fit text-xs">
                        <div className="flex items-center gap-2"><Calendar size={14} /> May 12, 2026</div>
                        <div className="w-px h-3 bg-slate-300" />
                        <div className="flex items-center gap-2 text-green-500 font-bold"><Activity size={14} /> Live</div>
                    </div>
                </div>
                
                <div className="flex gap-3 relative">
                    <button 
                        onClick={handleExport}
                        className="bg-white text-slate-600 font-bold px-5 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-xs flex items-center gap-2 active:scale-95 shadow-sm"
                    >
                        <Download size={16} /> Export
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setShowNewDocDropdown(!showNewDocDropdown)}
                            className="premium-button active:scale-95 shadow-lg shadow-primary-100"
                        >
                            <Plus size={16} /> New Document
                        </button>
                        
                        <AnimatePresence>
                            {showNewDocDropdown && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100]"
                                >
                                    {[
                                        { label: 'Create Quotation', path: '/app/quotations/create', icon: FileText, color: 'text-amber-500' },
                                        { label: 'Create Proforma', path: '/app/proformas/create', icon: FileText, color: 'text-blue-500' },
                                        { label: 'Create Tax Invoice', path: '/app/invoices/create', icon: FileText, color: 'text-emerald-500' },
                                    ].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => { navigate(item.path); setShowNewDocDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-left group"
                                        >
                                            <div className={`p-2 rounded-lg bg-slate-50 ${item.color} group-hover:scale-110 transition-transform`}>
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{item.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Annual Revenue" value={data.revenue} trend={12.5} icon={IndianRupee} color="bg-blue-600" delay={0.1} />
                <StatCard title="Documents Issued" value={data.invoices} trend={8.2} icon={FileText} color="bg-indigo-600" delay={0.2} />
                <StatCard title="Unpaid Balance" value={data.pending} trend={-2.4} icon={TrendingUp} color="bg-orange-600" delay={0.3} />
                <StatCard title="Customer Growth" value={data.customers} trend={14.1} icon={Users} color="bg-emerald-600" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Revenue Analytics Chart */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="premium-card p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Growth Projection</h3>
                            <p className="text-slate-400 text-xs font-medium">Monthly revenue performance for the last 6 months</p>
                        </div>
                        <div className="flex bg-slate-100/50 p-1 rounded-xl">
                            <button className="bg-white shadow-sm px-4 py-1.5 rounded-lg text-xs font-bold text-slate-900">Revenue</button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0e8ce4" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#0e8ce4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '15px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#0e8ce4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
