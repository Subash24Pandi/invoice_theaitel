import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Plus, ArrowRight, ChevronDown, HelpCircle, 
    Zap, Sparkles, Upload, Wand2, Box, Layers, List, Check, Search, Lock
} from 'lucide-react';

const CustomTaxDropdown = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-32 shrink-0" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full bg-white border border-l-0 border-slate-200 rounded-r-xl px-4 flex items-center justify-between text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
                {value}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[250] overflow-hidden"
                    >
                        {['with Tax', 'without Tax'].map((option) => (
                            <button 
                                key={option}
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className={`w-full px-4 py-3 text-left text-[11px] font-bold flex items-center justify-between transition-all ${value === option ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {option}
                                {value === option && <Check size={12} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UnitSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const units = [
        { code: 'OTH', name: 'OTHERS' }, { code: 'PCS', name: 'PIECES' },
        { code: 'NOS', name: 'NUMBERS' }, { code: 'KGS', name: 'KILOGRAMS' },
        { code: 'UNT', name: 'UNITS' }, { code: 'BOX', name: 'BOX' },
        { code: 'PAC', name: 'PACKS' }, { code: 'EACH', name: 'EACH' }
    ];

    const filteredUnits = units.filter(u => 
        u.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedUnit = units.find(u => u.code === value) || units[1];

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="premium-input flex items-center justify-between group">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{selectedUnit.code}</span>
                    <span className="text-slate-400 font-bold">—</span>
                    <span className="text-slate-500 font-bold">{selectedUnit.name}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl z-[250] overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-slate-50">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none" placeholder="Search unit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoFocus />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredUnits.map((u) => (
                                <button key={u.code} onClick={() => { onChange(u.code); setIsOpen(false); }} className={`w-full px-5 py-3 text-left flex items-center gap-4 transition-all ${value === u.code ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                                    <span className="font-mono font-bold text-xs w-10 text-slate-900">{u.code}</span>
                                    <span className="text-[11px] font-bold text-slate-500">{u.name}</span>
                                    {value === u.code && <Check size={14} className="ml-auto text-primary-600" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProductDrawer = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'Product', sellingPrice: 0, taxRate: 18, 
        taxType: 'with Tax', unit: 'PCS', hsn: '', purchasePrice: 0,
        barcode: '2273546838467', category: '', description: '',
        openingQty: 0, openingPrice: 0, stockValue: 0
    });

    useEffect(() => {
        if (product) setFormData({ ...formData, ...product });
        else setFormData({
            name: '', type: 'Product', sellingPrice: 0, taxRate: 18, 
            taxType: 'with Tax', unit: 'PCS', hsn: '', purchasePrice: 0,
            barcode: '2273546838467', category: '', description: '',
            openingQty: 0, openingPrice: 0, stockValue: 0
        });
    }, [product, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[210] flex flex-col font-poppins">
                        
                        {/* Header */}
                        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg transition-all"><X size={20} className="text-slate-400" /></button>
                                <h2 className="text-base font-bold text-slate-900">Add Item</h2>
                            </div>
                            <button onClick={() => onSave(formData)} className="bg-primary-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-primary-700 shadow-lg shadow-primary-100">Add Item</button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar pb-32">
                            
                            {/* Section: Basic Details */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4"><h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Basic Details</h3> <button className="text-[10px] font-bold text-primary-600 flex items-center gap-1"><Plus size={12} /> Add Custom Fields</button></div>
                                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                    <button onClick={() => setFormData({...formData, type: 'Product'})} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'Product' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500'}`}>Product</button>
                                    <button onClick={() => setFormData({...formData, type: 'Service'})} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'Service' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500'}`}>Service</button>
                                </div>
                                <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Product Name</label><input className="premium-input" placeholder="Enter Item Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Selling Price</label><div className="flex h-12"><div className="relative flex-1"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</div><input className="premium-input h-full pl-8 border-r-0 rounded-r-none" placeholder="Enter Selling Price" type="number" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} /></div><CustomTaxDropdown value={formData.taxType} onChange={(val) => setFormData({...formData, taxType: val})} /></div><p className="text-[10px] text-slate-500 font-bold mt-1">{formData.taxType === 'with Tax' ? 'Inclusive of Taxes' : 'Exclusive of Taxes'}</p></div>
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Tax %</label><div className="relative"><select className="premium-input appearance-none pr-10" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: e.target.value})}><option value="18">18% (9% CGST & 9% SGST)</option><option value="12">12% (6% CGST & 6% SGST)</option><option value="5">5% (2.5% CGST & 2.5% SGST)</option><option value="0">0% (Zero Rated)</option></select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} /></div><button className="text-[9px] text-primary-600 font-bold hover:underline">Zero Rated (Default)</button></div>
                                </div>
                                <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500"><span className="text-red-500">*</span>Primary Unit</label><UnitSelector value={formData.unit} onChange={(val) => setFormData({...formData, unit: val})} /></div>
                            </div>

                            {/* Section: Additional Info */}
                            <div className="space-y-6 pt-10 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Additional Information <span className="text-[9px] text-slate-300 ml-2">OPTIONAL</span></h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500">HSN/SAC</label><input className="premium-input" placeholder="HSN/SAC Code" value={formData.hsn} onChange={(e) => setFormData({...formData, hsn: e.target.value})} /><p className="text-[9px] text-primary-600 font-bold cursor-pointer hover:underline">Click here to check GST approved HSN/SAC codes.</p></div>
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500">Purchase Price</label><div className="flex h-12"><input className="premium-input flex-1 h-full border-r-0 rounded-r-none" placeholder="0.00" type="number" /><select className="bg-slate-50 border border-slate-200 border-l-0 rounded-r-xl px-4 text-xs font-bold outline-none"><option>with Tax</option></select></div></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500">Barcode</label><div className="flex gap-2"><input className="premium-input flex-1" value={formData.barcode} readOnly /><button className="px-5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center gap-2 hover:bg-slate-100 transition-all"><Wand2 size={12} /> Auto Generate</button></div></div>
                                    <div className="space-y-2"><label className="text-[11px] font-bold text-slate-500">Category</label><div className="relative"><select className="premium-input appearance-none pr-10"><option>Select Category</option></select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} /></div></div>
                                </div>
                                <div className="space-y-4 pt-4"><label className="text-[11px] font-bold text-slate-500">Product Images & Videos</label><div className="flex gap-4 items-end"><div className="w-28 h-28 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary-300 hover:bg-primary-50/20 hover:text-primary-600 cursor-pointer transition-all"><Upload size={24} /><span className="text-[10px] font-bold uppercase tracking-widest">Upload</span></div><div className="flex-1 pb-2"><p className="text-[9px] text-slate-400 font-medium leading-relaxed">Upload up to 10 files (3MB per image, 50MB per video).<br/>Images: 1024x1024 recommended. Videos: 9:16 or 1:1.</p></div></div></div>
                                <div className="space-y-4 pt-4">
                                    <label className="text-[11px] font-bold text-slate-500">Description</label>
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-2 flex items-center gap-4 text-slate-400 border-b border-slate-100 text-[10px] font-bold"><span>Bold</span> <span>Italic</span> <span>Underline</span> <span>UL</span> <span>OL</span></div>
                                        <textarea className="w-full p-4 text-xs outline-none h-24 placeholder:text-slate-300" placeholder="Add product description here..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                        <div className="px-4 py-2 bg-slate-50 flex items-center">
                                            <button className="bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-primary-100 hover:bg-primary-100 transition-all"><Sparkles size={12} fill="currentColor" /> AI</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Opening Stock */}
                            <div className="space-y-6 pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between"><h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Opening Stock <span className="text-[9px] text-slate-300 ml-2">OPTIONAL</span></h3> <button className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 hover:text-primary-600 transition-all"><Lock size={12} /> Add batches</button></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500">Opening Quantity</label>
                                        <input className="premium-input" placeholder="0" type="number" value={formData.openingQty} onChange={(e) => setFormData({...formData, openingQty: e.target.value})} />
                                        <p className="text-[9px] text-slate-400 font-medium italic">*Quantity of the product available in your existing inventory</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500">Opening Purchase Price (with tax)</label>
                                        <input className="premium-input" placeholder="0" type="number" value={formData.openingPrice} onChange={(e) => setFormData({...formData, openingPrice: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500">Opening Stock Value (with tax)</label>
                                    <input className="premium-input bg-slate-50/50" placeholder="0" value={formData.openingQty * formData.openingPrice} readOnly />
                                </div>
                                
                                <div className="p-5 bg-orange-50 border border-orange-100 rounded-[2rem] flex items-center justify-between group cursor-pointer transition-all hover:bg-orange-100/50">
                                    <div className="flex items-center gap-4">
                                        <ChevronDown size={18} className="text-orange-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                        <div>
                                            <p className="text-xs font-bold text-orange-900 leading-none mb-1.5">More Details?</p>
                                            <p className="text-[10px] text-orange-800/60 font-medium italic">Cess, Show OnlineDiscount, Inventory tracking, Low stock alerts etc..</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
                            <button onClick={() => onSave(formData)} className="w-full bg-primary-600 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all">Add Item</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductDrawer;
