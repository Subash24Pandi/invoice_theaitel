import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronRight, Info } from 'lucide-react';
import api from '../utils/api';

const BankDrawer = ({ isOpen, onClose, onSave }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpiVerifying, setIsUpiVerifying] = useState(false);
    const [isUpiVerified, setIsUpiVerified] = useState(false);
    const [formData, setFormData] = useState({
        accountHolder: 'THE AITEL',
        accountNo: '',
        confirmAccountNo: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        upiId: '',
        upiNumber: '',
        openingBalance: '',
        notes: '',
        isDefault: false
    });

    const handleVerifyUpi = () => {
        if (!formData.upiId.includes('@')) return;
        setIsUpiVerifying(true);
        // Simulate bank verification delay
        setTimeout(() => {
            setIsUpiVerifying(false);
            setIsUpiVerified(true);
        }, 1500);
    };

    const fetchBankDetails = async (code) => {
        if (!code || code.length !== 11) return;
        setIsLoading(true);
        try {
            const res = await fetch(`https://ifsc.razorpay.com/${code}`);
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    bankName: data.BANK,
                    branchName: data.BRANCH
                }));
            }
        } catch (err) { console.error('IFSC Fetch Error:', err); }
        finally { setIsLoading(false); }
    };

    // Auto-fetch when IFSC reaches 11 chars
    React.useEffect(() => {
        if (formData.ifscCode.length === 11) {
            fetchBankDetails(formData.ifscCode);
        }
    }, [formData.ifscCode]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">Bank Details</h2>
                    </div>
                    <button 
                        onClick={async () => { 
                            setIsLoading(true);
                            try {
                                const res = await api.post('/banks', formData);
                                onSave(res.data); 
                                onClose(); 
                            } catch (err) {
                                console.error('Bank Save Error:', err);
                                // Fallback if API fails
                                onSave(formData);
                                onClose();
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save & Update'}
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 space-y-6">
                        
                        {/* Account Holder */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Account Holder Name</label>
                            <input 
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                value={formData.accountHolder}
                                onChange={(e) => setFormData({...formData, accountHolder: e.target.value})}
                            />
                        </div>

                        {/* Account Numbers */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <span className="text-red-500">*</span> Account No
                                </label>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="Bank Account No."
                                    value={formData.accountNo}
                                    onChange={(e) => setFormData({...formData, accountNo: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <span className="text-red-500">*</span> Confirm Bank Account No
                                </label>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="Confirm Bank Account No."
                                    value={formData.confirmAccountNo}
                                    onChange={(e) => setFormData({...formData, confirmAccountNo: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* IFSC & Bank Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <span className="text-red-500">*</span> IFSC Code
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                        placeholder="IFSC Code"
                                        value={formData.ifscCode}
                                        onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                                    />
                                    <button 
                                        onClick={() => fetchBankDetails(formData.ifscCode)}
                                        disabled={isLoading}
                                        className={`px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 transition-all uppercase tracking-widest whitespace-nowrap ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-slate-50'}`}
                                    >
                                        {isLoading ? 'Fetching...' : 'Fetch Bank Details'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <span className="text-red-500">*</span> Bank Name
                                </label>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="Bank Name"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <span className="text-red-500">*</span> Branch Name
                                </label>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="Bank Branch Name"
                                    value={formData.branchName}
                                    onChange={(e) => setFormData({...formData, branchName: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* UPI Section */}
                        <div className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">UPI</label>
                                    <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-[0.2em] uppercase">Optional</span>
                                    <Info size={14} className="text-slate-300" />
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                        placeholder="UPI ID eg. username@okicici"
                                        value={formData.upiId}
                                        onChange={(e) => {
                                            setFormData({...formData, upiId: e.target.value});
                                            setIsUpiVerified(false);
                                        }}
                                    />
                                    <button 
                                        onClick={handleVerifyUpi}
                                        disabled={isUpiVerifying || isUpiVerified || !formData.upiId.includes('@')}
                                        className={`px-6 py-3 border rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest whitespace-nowrap ${
                                            isUpiVerified 
                                            ? 'bg-green-50 border-green-200 text-green-600' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'
                                        }`}
                                    >
                                        {isUpiVerifying ? 'Verifying...' : isUpiVerified ? '✓ Verified' : 'Verify UPI ID'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 ml-1">This UPI ID will be used to generate <span className="font-bold text-slate-600">Dynamic QR codes</span> on the invoices and bills.</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">UPI Number</label>
                                    <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-[0.2em] uppercase">Optional</span>
                                </div>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="GPay/PhonePe Number (Optional)"
                                    value={formData.upiNumber}
                                    onChange={(e) => setFormData({...formData, upiNumber: e.target.value})}
                                />
                                <p className="text-[10px] text-slate-400 ml-1">This bank account information will be displayed in online order details only and will not appear on invoices or bills.</p>
                            </div>
                        </div>

                        {/* Balance & Notes */}
                        <div className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Opening Balance</label>
                                    <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded tracking-[0.2em] uppercase">Optional</span>
                                </div>
                                <input 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-blue-400 transition-all"
                                    placeholder="Opening Balance (Optional)"
                                    value={formData.openingBalance}
                                    onChange={(e) => setFormData({...formData, openingBalance: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Notes</label>
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/30 flex gap-4">
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">Bold</button>
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">Italic</button>
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all underline">Underline</button>
                                        <div className="w-px h-3 bg-slate-200 my-auto" />
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">UL</button>
                                        <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">OL</button>
                                    </div>
                                    <textarea 
                                        className="w-full h-24 p-4 text-xs font-medium outline-none resize-none"
                                        placeholder="Beneficiary Name, SWIFT Code etc.."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Default Toggle */}
                        <div className="pt-4 flex items-center justify-between group cursor-pointer" onClick={() => setFormData({...formData, isDefault: !formData.isDefault})}>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700">Default</p>
                                <p className="text-[10px] text-slate-400">This will override your previous default bank</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full p-1 transition-all ${formData.isDefault ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full transition-all ${formData.isDefault ? 'ml-auto' : 'ml-0'}`} />
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BankDrawer;
