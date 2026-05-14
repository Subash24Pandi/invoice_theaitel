import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, ChevronRight, Calendar, 
    DollarSign, Clock, AlertCircle, CheckCircle2,
    ArrowUpRight, ArrowDownLeft, Trash2, Edit2
} from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Accounts = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/invoices?type=Invoice');
            setInvoices(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleUpdatePayment = async () => {
        if (!selectedInvoice || !paymentAmount) return;
        
        const newPaidAmount = (parseFloat(selectedInvoice.amountPaid || 0) + parseFloat(paymentAmount));
        const totalAmount = selectedInvoice.totalAmount;
        let newStatus = 'Unpaid';
        
        if (newPaidAmount >= totalAmount) newStatus = 'Paid';
        else if (newPaidAmount > 0) newStatus = 'Partially Paid';

        try {
            const updateData = {
                ...selectedInvoice,
                amountPaid: newPaidAmount,
                status: newStatus
            };
            await api.put(`/invoices/${selectedInvoice.id}`, updateData);
            fetchInvoices();
            setPaymentModalOpen(false);
            setPaymentAmount('');
            setSelectedInvoice(null);
        } catch (err) { console.error(err); }
    };

    const handleFullyPaid = async (inv) => {
        if (!window.confirm('Mark this invoice as FULLY PAID?')) return;
        try {
            await api.put(`/invoices/${inv.id}`, {
                ...inv,
                amountPaid: inv.totalAmount,
                status: 'Paid'
            });
            fetchInvoices();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/invoices/${id}`);
            fetchInvoices();
        } catch (err) { console.error(err); }
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.Customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            inv.prefix + inv.invoiceNumber === searchTerm;
        const matchesStatus = filterStatus === 'All' || inv.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Accounts Management</h1>
                    <p className="text-slate-500 font-medium mt-1 text-sm italic">Track payments, pending dues, and client accounts seamlessly.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                        <DollarSign size={20} />
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                        <p className="text-lg font-black text-slate-900">
                            ₹{invoices.reduce((acc, inv) => acc + (inv.totalAmount - (inv.amountPaid || 0)), 0).toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by client name or invoice number..."
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 transition-all shadow-sm shadow-slate-100/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 flex gap-4">
                    <div className="flex-1 relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                            className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-500 appearance-none shadow-sm shadow-slate-100/50"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Paid">Paid</option>
                            <option value="Partially Paid">Partially Paid</option>
                            <option value="Unpaid">Unpaid</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Invoice</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Amount</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredInvoices.map((inv) => {
                            const pending = inv.totalAmount - (inv.amountPaid || 0);
                            const overdue = isOverdue(inv.dueDate) && inv.status !== 'Paid';

                            return (
                                <motion.tr 
                                    key={inv.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{inv.Customer?.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{inv.prefix}{inv.invoiceNumber}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold ${overdue ? 'text-red-500' : 'text-slate-600'}`}>
                                                {new Date(inv.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            {overdue && (
                                                <span className="text-[9px] font-black text-red-400 uppercase tracking-tighter mt-0.5 flex items-center gap-1 animate-pulse">
                                                    <AlertCircle size={10} /> Overdue
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                                    <td className="px-8 py-6 text-sm font-bold text-emerald-600">₹{(inv.amountPaid || 0).toLocaleString('en-IN')}</td>
                                    <td className="px-8 py-6 text-sm font-black text-amber-600">₹{pending.toLocaleString('en-IN')}</td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                                            inv.status === 'Partially Paid' ? 'bg-amber-50 text-amber-600' : 
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {inv.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    setSelectedInvoice(inv);
                                                    setPaymentModalOpen(true);
                                                }}
                                                className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-100 active:scale-95 flex items-center gap-2"
                                            >
                                                <DollarSign size={14} /> Pay
                                            </button>
                                            <button 
                                                onClick={() => handleFullyPaid(inv)}
                                                className={`p-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${
                                                    inv.status === 'Paid' 
                                                    ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed opacity-50' 
                                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100'
                                                }`}
                                                disabled={inv.status === 'Paid'}
                                                title="Mark as Fully Paid"
                                            >
                                                <CheckCircle2 size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Fully Paid</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(inv.id)}
                                                className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {paymentModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setPaymentModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <Edit2 size={24} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Record Payment</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8">Manual entry for partial or full payments.</p>

                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Client</p>
                                    <p className="text-base font-black text-slate-900 uppercase">{selectedInvoice?.Customer?.name}</p>
                                    <div className="flex justify-between mt-4 pt-4 border-t border-slate-200/60">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Remaining Due</p>
                                            <p className="text-sm font-black text-amber-600">₹{(selectedInvoice?.totalAmount - (selectedInvoice?.amountPaid || 0)).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Invoice #</p>
                                            <p className="text-sm font-black text-slate-900">{selectedInvoice?.prefix}{selectedInvoice?.invoiceNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 block ml-1">Payment Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-black text-slate-900 outline-none focus:border-primary-500 transition-all"
                                        placeholder="Enter amount..."
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                </div>

                                <button 
                                    onClick={handleUpdatePayment}
                                    className="w-full bg-primary-500 text-white py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-primary-600 shadow-2xl shadow-primary-100 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <ArrowUpRight size={18} /> Update Ledger
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Accounts;
