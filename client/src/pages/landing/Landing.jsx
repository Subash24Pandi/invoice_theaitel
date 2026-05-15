import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
    CheckCircle2, Sparkles, Layout, ShieldCheck, 
    Zap, Globe, ArrowRight, Star, ChevronDown, 
    Smartphone, MessageSquare, Briefcase, Mail
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Product', path: '#' },
        { name: 'Features', path: '#' },
        { name: 'Pricing', path: '#' },
        { name: 'Download App', path: '#' },
        { name: 'Contact', path: '#' },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden font-family-poppins">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-md z-[1000] px-8 lg:px-20 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-12">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-100 overflow-hidden border border-slate-50">
                            <img src="/logo.png" alt="Vortex" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">Vortex</span>
                    </Link>
                    <nav className="hidden xl:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.path} className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-all flex items-center gap-1">
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-black text-slate-600 hover:text-slate-900 px-6 py-3 transition-all">Login</Link>
                    <Link to="/register" className="bg-primary-500 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-primary-600 shadow-xl shadow-primary-100 transition-all hover:scale-105 active:scale-95">
                        Sign up
                    </Link>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="pt-40 pb-20 px-8 lg:px-20 max-w-[1400px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-white">
                            <Sparkles size={14} className="text-primary-400" fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Future of Business Billing</span>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                            Elevate your <br />
                            <span className="text-primary-500">Business</span>
                        </h1>
                        
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                            Streamline your workflow with professional <span className="text-slate-900 font-bold underline decoration-primary-500/30">Tax Invoices</span>, Proformas, and Quotations. Send instantly via WhatsApp and scale your operations with ease.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <button 
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto bg-primary-500 text-white px-10 py-5 rounded-[1.5rem] text-lg font-black hover:bg-primary-600 shadow-2xl shadow-primary-100 transition-all hover:scale-105 active:scale-95"
                            >
                                Sign up for free
                            </button>
                        </div>

                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Floating elements to mimic the "Swipe" look */}
                        <div className="absolute top-0 right-0 w-full h-full bg-primary-50/50 rounded-full blur-[100px] -z-10" />
                        
                        <div className="relative z-10 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(41,171,135,0.2)] border border-slate-100 overflow-hidden group">
                            <img 
                                src="/hero.png" 
                                alt="BillFlow Hero" 
                                className="w-full h-auto group-hover:scale-105 transition-transform duration-[2s]"
                            />
                            

                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Payment</p>
                                    <p className="text-xs font-black text-slate-900">Received!</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Background Floating circles */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl" />
                        <div className="absolute -bottom-20 -right-10 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </main>


            {/* FOOTER SECTION */}
            <footer className="bg-slate-50 pt-24 pb-12 px-8 lg:px-20">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
                        {/* Contact info column */}
                        <div className="lg:col-span-5 space-y-10">
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Contact</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                                            <Mail size={20} />
                                        </div>
                                        <span className="text-base font-bold text-slate-600">hello@theaitel.com</span>
                                    </div>
                                    <div className="flex items-center gap-5 group">
                                        <div className="w-12 h-12 bg-sky-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-100 group-hover:scale-110 transition-transform">
                                            <Smartphone size={20} />
                                        </div>
                                        <span className="text-base font-bold text-slate-600">+91 6383653279</span>
                                    </div>
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0 group-hover:scale-110 transition-transform">
                                            <Globe size={20} />
                                        </div>
                                        <span className="text-base font-bold text-slate-600 leading-relaxed max-w-xs">
                                            The Aitel, 42, Thirugnana Sambandar St, JV Nagar, Madipakkam, Tamil Nadu 600091
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links columns */}
                        <div className="lg:col-span-7 grid sm:grid-cols-2 lg:grid-cols-1 gap-12 lg:gap-16">
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Invoicing Solutions</h4>
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    {['Tax Invoices', 'Proforma Invoices', 'Quotations', 'Delivery Challans', 'Credit Notes', 'Purchase Orders'].map(item => (
                                        <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors whitespace-nowrap">{item}</a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Business Tools</h4>
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    {['GST Calculator', 'HSN/SAC Finder', 'Number to Words', 'Invoice Generator', 'Business Profile', 'WhatsApp Sharing'].map(item => (
                                        <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors whitespace-nowrap">{item}</a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Resources</h4>
                                <div className="flex flex-wrap gap-x-8 gap-y-3">
                                    {['Documentation', 'Security', 'Privacy Policy', 'Terms of Service', 'Support Helpdesk', 'Contact Sales'].map(item => (
                                        <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors whitespace-nowrap">{item}</a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Strip */}
                    <div className="pt-12 border-t border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                            <p className="text-xs font-bold text-slate-400">© 2026 Vortex — Smart Invoicing. All rights reserved.</p>
                            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                <span>Fast</span> <Star size={10} fill="currentColor" /> <span>Secure</span> <Star size={10} fill="currentColor" /> <span>Compliant</span>
                            </div>
                        </div>
                        <div className="flex gap-8">
                            {['Data Protection', 'Service Status', 'Security', 'Sitemap'].map(item => (
                                <a key={item} href="#" className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors tracking-tight">{item}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
