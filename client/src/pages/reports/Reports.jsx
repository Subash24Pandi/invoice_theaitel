import React, { useState, useEffect } from 'react';
import { 
    TrendingUp, Users, Package, FileText, 
    Download, Calendar, Filter, ArrowUpRight,
    ArrowDownRight, IndianRupee, ShieldCheck,
    ChevronDown, Printer, ExternalLink
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../../utils/api';

const Reports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('Last 6 Months');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/reports/summary');
                setData(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchReports();
    }, []);

    const handleExport = () => {
        alert('Generating Comprehensive Business Report... Your download will start in a moment.');
        // In a real app, this would trigger a window.location.href to a PDF generation endpoint
    };

    const handleFileGST = () => {
        if (window.confirm('You are being redirected to the GST Portal (gst.gov.in) to file your returns. Do you wish to continue?')) {
            window.open('https://services.gst.gov.in/services/login', '_blank');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
        </div>
    );

    const COLORS = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];

    return (
        <div className="p-10 max-w-[1400px] mx-auto space-y-10 font-poppins">
            {/* CLEAN HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#10b981] font-bold mb-1">
                        <TrendingUp size={16} />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Analytics</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button 
                            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs flex items-center gap-3 hover:border-[#10b981] transition-all"
                        >
                            <Calendar size={16} className="text-slate-400" /> 
                            {period}
                            <ChevronDown size={14} className={`transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showPeriodDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                {['This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'].map((p) => (
                                    <button 
                                        key={p} 
                                        onClick={() => { setPeriod(p); setShowPeriodDropdown(false); }}
                                        className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#10b981] transition-all"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleExport}
                        className="bg-[#10b981] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-[#10b981]/20"
                    >
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* NEAT STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Sales', value: `₹${data.totalSales.toLocaleString('en-IN')}`, icon: TrendingUp, trend: '+12.5%' },
                    { label: 'GST Collected', value: `₹${data.totalTax.toLocaleString('en-IN')}`, icon: ShieldCheck, trend: '+8.2%' },
                    { label: 'Pending Dues', value: `₹${data.totalPending.toLocaleString('en-IN')}`, icon: IndianRupee, trend: '-2.4%', negative: true },
                    { label: 'Active Clients', value: data.topCustomers.length, icon: Users, trend: '+3' }
                ].map((stat, i) => (
                    <div key={i} className="group">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">{stat.label}</p>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#10b981]/30 transition-all">
                            <div className="flex items-baseline justify-between">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                                <span className={`text-[10px] font-bold ${stat.negative ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LEFT SIDE: CHARTS */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Trend</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Monthly billing performance</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full"></div>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">Sales</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.monthlySales}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}}
                                        tickFormatter={(val) => `₹${val/1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)'}}
                                        itemStyle={{fontSize: '11px', fontWeight: 900, color: '#10b981'}}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
