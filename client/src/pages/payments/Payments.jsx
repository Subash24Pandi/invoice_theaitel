import React, { useState, useEffect } from 'react';
import { Plus, Banknote, Trash2, Edit2, CheckCircle2, QrCode, Building2, User } from 'lucide-react';
import axios from 'axios';
import BankDrawer from '../../components/BankDrawer';

const Payments = () => {
    const [banks, setBanks] = useState([]);
    const [isBankDrawerOpen, setIsBankDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/banks');
            setBanks(res.data);
        } catch (err) {
            console.error('Fetch Banks Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bank account?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/banks/${id}`);
            setBanks(banks.filter(b => b.id !== id));
        } catch (err) {
            console.error('Delete Bank Error:', err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Methods</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your bank accounts and UPI IDs for invoicing.</p>
                </div>
                <button 
                    onClick={() => setIsBankDrawerOpen(true)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={18} /> Add Bank Account
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : banks.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <Banknote size={48} className="text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">No bank accounts added yet</h3>
                        <p className="text-slate-500 mt-2 max-w-xs">Add your first bank account to start receiving payments and generating QR codes.</p>
                    </div>
                    <button 
                        onClick={() => setIsBankDrawerOpen(true)}
                        className="text-primary-600 font-bold hover:underline flex items-center gap-2"
                    >
                        <Plus size={18} /> Create your first bank
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banks.map((bank) => (
                        <div key={bank.id} className="group relative premium-card p-8 hover:shadow-primary-100/20 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-primary-50 transition-colors duration-500" />
                            
                            <div className="relative space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 group-hover:bg-primary-600 group-hover:shadow-primary-100 transition-all duration-500">
                                        <Building2 size={28} />
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(bank.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{bank.bankName}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{bank.branchName}</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <User size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Holder</span>
                                            <span className="text-sm font-bold text-slate-700">{bank.accountHolder}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</span>
                                            <span className="text-sm font-bold text-slate-700">{bank.accountNo}</span>
                                        </div>
                                    </div>

                                    {bank.upiId && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <QrCode size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPI ID</span>
                                                <span className="text-sm font-bold text-slate-700">{bank.upiId}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">IFSC Code</span>
                                        <span className="text-sm font-black text-slate-900 tracking-wider uppercase">{bank.ifscCode}</span>
                                    </div>
                                    {bank.isDefault && (
                                        <span className="bg-green-100 text-green-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Default Account</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <BankDrawer 
                isOpen={isBankDrawerOpen} 
                onClose={() => setIsBankDrawerOpen(false)} 
                onSave={() => {
                    fetchBanks();
                    setIsBankDrawerOpen(false);
                }} 
            />
        </div>
    );
};

export default Payments;
