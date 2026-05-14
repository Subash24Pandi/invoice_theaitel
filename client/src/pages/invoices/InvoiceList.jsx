import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Download, MoreVertical, Eye, Trash2, Share2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const InvoiceList = ({ type = 'Invoice' }) => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoices();
    }, [type]);

    const fetchInvoices = async () => {
        try {
            const res = await api.get(`/invoices?type=${type}`);
            setInvoices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShare = (inv) => {
        const text = `Invoice Details:\nInvoice #: ${inv.invoiceNumber}\nCustomer: ${inv.Customer?.name || 'N/A'}\nDate: ${new Date(inv.date).toLocaleDateString()}\nAmount: ₹${inv.totalAmount.toLocaleString()}\nStatus: ${inv.status}`;
        if (navigator.share) {
            navigator.share({ title: 'Invoice Details', text }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert('Invoice details copied to clipboard!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;
        try {
            await api.delete(`/invoices/${id}`);
            fetchInvoices();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{type}s</h1>
                    <p className="text-slate-500 font-medium">View and manage your {type.toLowerCase()}s.</p>
                </div>
                <button 
                    onClick={() => navigate(`/app/${type.toLowerCase()}s/create`)}
                    className="bg-primary-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:bg-primary-700 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Create New {type}
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={`Search ${type.toLowerCase()}s...`}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary-50 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {invoices.length > 0 ? invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                                            <FileText size={18} />
                                        </div>
                                        <p className="font-bold text-slate-900">{inv.invoiceNumber}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-bold text-slate-700">{inv.Customer?.name || 'N/A'}</p>
                                    <p className="text-xs text-slate-400">{inv.Customer?.companyName}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm text-slate-600 font-medium">{new Date(inv.date).toLocaleDateString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 
                                        inv.status === 'Sent' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button 
                                            onClick={() => handleShare(inv)}
                                            className="p-2 text-slate-400 hover:text-blue-500 transition-all"
                                            title="Share"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/app/${type.toLowerCase()}s/edit/${inv.id}`)}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-all"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/app/${type.toLowerCase()}s/view/${inv.id}`)}
                                            className="p-2 text-slate-400 hover:text-primary-600 transition-all"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(inv.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-slate-400">
                                    No {type.toLowerCase()}s found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceList;
