import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Signature as SigIcon, User, Upload, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const [signatures, setSignatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newSig, setNewSig] = useState({ name: '', image: '', invert: false });

    useEffect(() => {
        fetchSignatures();
    }, []);

    const fetchSignatures = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/signatures');
            setSignatures(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewSig({ ...newSig, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!newSig.name || !newSig.image) return alert('Please provide both name and signature image');
        try {
            await axios.post('http://localhost:5000/api/signatures', newSig);
            setNewSig({ name: '', image: '', invert: false });
            setIsAdding(false);
            fetchSignaturesCorrect();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this signature?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/signatures/${id}`);
            fetchSignaturesCorrect();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your authorized signatures for documents.</p>
                </div>
            </div>

            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Manage Signatures</h2>
                    {!isAdding && (
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all"
                        >
                            <Plus size={18} /> Add New Signature
                        </button>
                    )}
                </div>

                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="premium-card p-8 shadow-2xl relative z-10"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                                    <SigIcon size={20} />
                                </div>
                                New Authorized Signature
                            </h2>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signatory Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. N. Gopi"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 outline-none focus:border-primary-400 transition-all"
                                            value={newSig.name}
                                            onChange={(e) => setNewSig({...newSig, name: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Signature Image</label>
                                    <label className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-primary-50 hover:border-primary-200 transition-all group">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-10 h-10 mb-3 text-slate-300 group-hover:text-primary-500 transition-colors" />
                                            <p className="text-xs font-black text-slate-500 group-hover:text-primary-600">Click to upload signature</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">PNG or JPEG (Photos from mobile work great!)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">Invert Colors</p>
                                        <p className="text-[10px] font-medium text-slate-500 uppercase">Use for white ink on dark background</p>
                                    </div>
                                    <button 
                                        onClick={() => setNewSig({...newSig, invert: !newSig.invert})}
                                        className={`w-12 h-6 rounded-full transition-all relative ${newSig.invert ? 'bg-primary-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newSig.invert ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Preview</label>
                                <div className="flex-1 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                                    {newSig.image ? (
                                        <div className="space-y-6 w-full px-8">
                                            <div className="relative group bg-white p-6 rounded-2xl border border-slate-100 shadow-inner overflow-hidden">
                                                <img 
                                                    src={newSig.image} 
                                                    alt="Preview" 
                                                    className="max-h-40 w-full object-contain mx-auto transition-all mix-multiply" 
                                                    style={{ 
                                                        filter: `
                                                            ${newSig.invert ? 'invert(1)' : ''} 
                                                            contrast(200%) 
                                                            brightness(110%) 
                                                            saturate(0) 
                                                            blur(0.2px) 
                                                            contrast(150%)
                                                        `.replace(/\n/g, ''),
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => setNewSig({...newSig, image: ''})}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md text-slate-400 rounded-full flex items-center justify-center shadow-lg hover:text-red-500 transition-all border border-slate-100"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-sm font-black text-slate-900">{newSig.name || 'Signatory Name'}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signatory</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-300 flex flex-col items-center gap-2">
                                            <SigIcon size={48} />
                                            <span className="text-xs font-bold">Preview will appear here</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <button 
                                        onClick={handleSave}
                                        className="w-full premium-button py-4"
                                    >
                                        Save Signature
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {signatures.map((sig) => (
                        <div key={sig.id} className="premium-card p-6 flex items-center justify-between group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-primary-50 transition-colors duration-500" />
                            
                            <div className="relative flex items-center gap-8">
                                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-primary-600 transition-all duration-500">
                                    <SigIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{sig.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized Signatory</p>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-6">
                                <div className="h-16 w-32 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden group-hover:bg-white transition-all">
                                    <img 
                                        src={sig.image} 
                                        alt={sig.name} 
                                        className="max-h-full object-contain mix-multiply" 
                                        style={{ 
                                            filter: `
                                                ${sig.invert ? 'invert(1)' : ''} 
                                                contrast(200%) 
                                                brightness(110%) 
                                                saturate(0) 
                                                blur(0.2px) 
                                                contrast(150%)
                                            `.replace(/\n/g, ''),
                                        }}
                                    />
                                </div>
                                <button 
                                    onClick={() => handleDelete(sig.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
