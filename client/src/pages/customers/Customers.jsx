import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Edit2, Trash2, Mail, Phone, 
    X, Users, Globe, ExternalLink, ShieldCheck, 
    ChevronRight, ArrowRight, MoreHorizontal, Share2,
    FileText, Receipt, FileStack
} from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import CustomerDrawer from '../../components/CustomerDrawer';

const Customers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedCustomer) await api.put(`/customers/${selectedCustomer.id}`, formData);
            else await api.post('/customers', formData);
            fetchCustomers();
            setIsDrawerOpen(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (err) { console.error(err); }
    };

    const handleShare = (customer) => {
        const text = `Customer Details:\nName: ${customer.name}\nCompany: ${customer.companyName || 'Individual'}\nGSTIN: ${customer.gstin || 'Unregistered'}\nPhone: ${customer.phone || '—'}`;
        if (navigator.share) {
            navigator.share({ title: 'Customer Details', text }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert('Customer details copied to clipboard!');
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                        <Users size={16} fill="currentColor" />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Registry</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
                </div>
                
                <button 
                    onClick={() => { setSelectedCustomer(null); setIsDrawerOpen(true); }}
                    className="premium-button shadow-lg shadow-primary-100"
                >
                    <Plus size={18} /> Register Customer
                </button>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search registry..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border-none rounded-xl outline-none focus:bg-white transition-all text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <ExternalLink size={14} /> Export CSV
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] border border-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Documents</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCustomers.map((c) => (
                            <tr key={c.id} className="hover:bg-primary-50/30 transition-all duration-300 group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm leading-none mb-1">{c.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{c.companyName || 'Individual'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2">
                                        {c.recentDocuments?.quotation && (
                                            <button 
                                                onClick={() => navigate(`/app/invoices/view/${c.recentDocuments.quotation.id}`)}
                                                className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-amber-100 transition-all border border-amber-100"
                                            >
                                                <FileStack size={10} /> Quotation
                                            </button>
                                        )}
                                        {c.recentDocuments?.proforma && (
                                            <button 
                                                onClick={() => navigate(`/app/invoices/view/${c.recentDocuments.proforma.id}`)}
                                                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-blue-100 transition-all border border-blue-100"
                                            >
                                                <Receipt size={10} /> Proforma
                                            </button>
                                        )}
                                        {c.recentDocuments?.invoice && (
                                            <button 
                                                onClick={() => navigate(`/app/invoices/view/${c.recentDocuments.invoice.id}`)}
                                                className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-emerald-100 transition-all border border-emerald-100"
                                            >
                                                <ShieldCheck size={10} /> Tax Invoice
                                            </button>
                                        )}
                                        {!c.recentDocuments?.quotation && !c.recentDocuments?.proforma && !c.recentDocuments?.invoice && (
                                            <span className="text-[10px] font-bold text-slate-300 italic">No activity yet</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-[11px] font-bold text-slate-600">{c.email || '—'}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">{c.phone || '—'}</div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button 
                                            onClick={() => handleShare(c)}
                                            className="p-2 text-slate-300 hover:text-blue-500 transition-all"
                                            title="Share"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedCustomer(c); setIsDrawerOpen(true); }}
                                            className="p-2 text-slate-300 hover:text-primary-600 transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(c.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CustomerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} customer={selectedCustomer} onSave={handleSave} />
        </div>
    );
};

export default Customers;
