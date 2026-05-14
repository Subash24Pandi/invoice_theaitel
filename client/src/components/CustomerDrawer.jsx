import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Plus, ArrowRight, ChevronDown, MapPin, 
    AlertCircle, Globe, CheckCircle2
} from 'lucide-react';
import api from '../utils/api';

const AddressModal = ({ isOpen, onClose, onSave, title, initialData }) => {
    const [data, setData] = useState({
        country: 'India', line1: '', line2: '', pincode: '', city: '', state: ''
    });

    useEffect(() => {
        if (initialData) {
            // Simple parser if data is already a string
            const parts = initialData.split(', ');
            if (parts.length > 3) {
                setData({ country: 'India', line1: parts[0], line2: parts[1], city: parts[2], state: parts[3], pincode: '' });
            }
        }
    }, [initialData, isOpen]);

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300]" />
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[310] overflow-hidden font-poppins">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <MapPin className="text-primary-600" size={24} /> {title}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Country</label>
                                <div className="relative">
                                    <select className="premium-input appearance-none pr-10" value={data.country} onChange={(e) => setData({...data, country: e.target.value})}>
                                        <option>India</option>
                                        <option>United States</option>
                                        <option>United Arab Emirates</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest"><span className="text-red-500">*</span>Address Line 1</label>
                                <input className="premium-input" placeholder="House/Office No, Building Name" value={data.line1} onChange={(e) => setData({...data, line1: e.target.value})} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Address Line 2</label>
                                <input className="premium-input" placeholder="Street, Locality, Area" value={data.line2} onChange={(e) => setData({...data, line2: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pincode</label>
                                    <input className="premium-input" placeholder="6-digit code" value={data.pincode} onChange={(e) => setData({...data, pincode: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">City</label>
                                    <input className="premium-input" placeholder="City name" value={data.city} onChange={(e) => setData({...data, city: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest"><span className="text-red-500">*</span>State</label>
                                <div className="relative">
                                    <select className="premium-input appearance-none pr-10" value={data.state} onChange={(e) => setData({...data, state: e.target.value})}>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                                <p className="text-[9px] font-medium text-slate-400 leading-relaxed mt-2 italic">
                                    Billing State is responsible for deciding CGST + SGST or IGST calculation on the invoice.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex gap-4">
                            <button onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
                            <button 
                                onClick={() => {
                                    const formatted = `${data.line1}, ${data.line2 ? data.line2 + ', ' : ''}${data.city}, ${data.state} ${data.pincode}`;
                                    onSave(formatted);
                                    onClose();
                                }}
                                className="flex-1 py-4 bg-primary-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                            >
                                Save and Update <CheckCircle2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const CustomerDrawer = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', companyName: '', gstin: '', email: '', phone: '', 
        billingAddress: '', shippingAddress: '',
        openingBalance: 0, balanceType: 'Debit',
        tdsEnabled: false, tcsEnabled: false, rcmEnabled: false
    });
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');
    const [activeAddressModal, setActiveAddressModal] = useState(null); // 'billing' or 'shipping' or null

    useEffect(() => {
        if (customer) setFormData({ ...formData, ...customer });
        else setFormData({
            name: '', companyName: '', gstin: '', email: '', phone: '', 
            billingAddress: '', shippingAddress: '',
            openingBalance: 0, balanceType: 'Debit',
            tdsEnabled: false, tcsEnabled: false, rcmEnabled: false
        });
        setError('');
    }, [customer, isOpen]);

    const handleGstFetch = async () => {
        if (!formData.gstin) { setError('Please enter a GSTIN first.'); return; }
        setVerifying(true);
        setError('');
        try {
            const response = await api.get(`/gst/verify/${formData.gstin.toUpperCase()}`);
            if (response.data && response.data.data) {
                const info = response.data.data;
                const addr = info.pradr?.addr || {};
                const fullAddress = `${addr.bno || ''} ${addr.bnm || ''} ${addr.st || ''} ${addr.loc || ''} ${addr.dst || ''} ${addr.stcd || ''} ${addr.pncd || ''}`.trim().replace(/\s+/g, ' ');
                
                setFormData(prev => ({
                    ...prev,
                    companyName: info.lgnm || info.tradeNam || '',
                    name: info.tradeNam || info.lgnm || '',
                    billingAddress: fullAddress,
                    shippingAddress: fullAddress
                }));
            } else {
                setError('No data found for this GSTIN.');
            }
        } catch (err) { 
            console.error(err);
            setError(err.response?.data?.message || 'Failed to verify GSTIN. Please check the number.'); 
        } finally { setVerifying(false); }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[210] flex flex-col font-poppins">
                        
                        {/* Header */}
                        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-all"><X size={20} className="text-slate-400" /></button>
                                <h2 className="text-base font-bold text-slate-900">Add Customer</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                                <button onClick={() => onSave(formData)} className="bg-primary-600 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary-700 shadow-lg shadow-primary-100">Save <ArrowRight size={14} /></button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar pb-24">
                            
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[10px] font-bold">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}

                            {/* Section: Basic Info */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between"><h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Basic Details</h3> <button className="text-[10px] font-bold text-primary-600 flex items-center gap-1"><Plus size={12} /> Add Custom fields</button></div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Name</label>
                                    <input className="premium-input" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Phone</label><input className="premium-input" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                                    <div className="space-y-1.5"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Email</label><input className="premium-input" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                                </div>
                            </div>

                            {/* Section: Company Info */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Company Details (Optional)</h3>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500">GSTIN</label>
                                    <div className="flex gap-2">
                                        <input className="premium-input flex-1 uppercase font-mono tracking-widest" placeholder="29AABCT..." value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value})} />
                                        <button onClick={handleGstFetch} disabled={verifying} className="px-5 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
                                            {verifying ? 'Verifying...' : 'Fetch Details'}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-500">Company Name</label>
                                    <input className="premium-input" placeholder="Business Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                                </div>
                            </div>

                            {/* Section: Addresses */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] font-bold text-slate-600">Billing Address</h3>
                                        <button onClick={() => setActiveAddressModal('billing')} className="text-[10px] font-bold text-primary-600 flex items-center gap-1 hover:underline">
                                            <MapPin size={12} /> Use Address Builder
                                        </button>
                                    </div>
                                    <textarea 
                                        className="premium-input min-h-[100px] py-3 resize-none leading-relaxed text-xs font-semibold" 
                                        placeholder="Enter complete billing address..."
                                        value={formData.billingAddress} 
                                        onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] font-bold text-slate-600">Shipping Address</h3>
                                        <button onClick={() => setActiveAddressModal('shipping')} className="text-[10px] font-bold text-primary-600 flex items-center gap-1 hover:underline">
                                            <MapPin size={12} /> Use Address Builder
                                        </button>
                                    </div>
                                    <textarea 
                                        className="premium-input min-h-[100px] py-3 resize-none leading-relaxed text-xs font-semibold" 
                                        placeholder="Enter complete shipping address..."
                                        value={formData.shippingAddress} 
                                        onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Section: Optional Details */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold text-slate-600">Optional Details</h3>
                                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold text-slate-500">Opening Balance</label>
                                        <div className="flex gap-6 items-center">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={formData.balanceType === 'Debit'} onChange={() => setFormData({...formData, balanceType: 'Debit'})} className="accent-primary-600" /> <span className="text-xs font-semibold text-slate-700">Debit</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={formData.balanceType === 'Credit'} onChange={() => setFormData({...formData, balanceType: 'Credit'})} className="accent-primary-600" /> <span className="text-xs font-semibold text-slate-700">Credit</span></label>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</div>
                                            <input className="premium-input pl-8" placeholder="0.00" type="number" value={formData.openingBalance} onChange={(e) => setFormData({...formData, openingBalance: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            <AddressModal 
                isOpen={activeAddressModal !== null} 
                onClose={() => setActiveAddressModal(null)} 
                title={`Add ${activeAddressModal === 'billing' ? 'Billing' : 'Shipping'} Address`}
                initialData={activeAddressModal === 'billing' ? formData.billingAddress : formData.shippingAddress}
                onSave={(addr) => {
                    setFormData({...formData, [activeAddressModal === 'billing' ? 'billingAddress' : 'shippingAddress']: addr});
                }}
            />
        </AnimatePresence>
    );
};

export default CustomerDrawer;
