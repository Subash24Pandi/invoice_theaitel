import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Save, Check } from 'lucide-react';

const SignatureDrawer = ({ isOpen, onClose, onSave }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#0f172a'; // Slate-900
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [isOpen]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setIsEmpty(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const handleSave = () => {
        if (isEmpty) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        onSave(dataUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg">
                            <X size={20} className="text-slate-400" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800">Digital Signature</h2>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={isEmpty}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            isEmpty ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-100'
                        }`}
                    >
                        Save Signature
                    </button>
                </div>

                {/* Pad Content */}
                <div className="flex-1 p-8 space-y-8 bg-slate-50/30">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-800">Draw your signature</p>
                                <p className="text-xs text-slate-400">Use your mouse or touch screen to sign below</p>
                            </div>
                            <button onClick={clear} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-all">
                                <RotateCcw size={14} /> Clear Pad
                            </button>
                        </div>

                        <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-inner overflow-hidden cursor-crosshair">
                            <canvas 
                                ref={canvasRef}
                                width={500}
                                height={300}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="w-full h-[300px]"
                            />
                            {isEmpty && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                    <Signature size={64} className="text-slate-300" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <Check size={20} className="text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Secure Authorization</p>
                            <p className="text-[11px] text-blue-700 leading-relaxed">By registering this signature, you authorize its use as a digital seal on all invoices generated by this account.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignatureDrawer;
