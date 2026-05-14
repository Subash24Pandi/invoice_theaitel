import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { 
    Mail, Lock, ArrowRight, Layout, Sparkles, 
    ShieldCheck, Zap, Globe
} from 'lucide-react';
import { getDailyQuote } from '../../utils/quotes';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Animated Blobs */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[120px]"
            />
            <motion.div 
                animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], x: [0, -50, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[150px]"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/90 backdrop-blur-md rounded-[3rem] border border-white shadow-[0_20px_80px_-20px_rgba(41,171,135,0.2)] overflow-hidden relative z-10"
            >
                {/* Left Section: Visual Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-primary-600/80 backdrop-blur-xl relative overflow-hidden text-white">
                    {/* Abstract Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    </div>
                    
                    {/* Glassy Overlay for depth */}
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-4 mb-20"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                                <img src="/logo.png" alt="Vortex" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-3xl font-black tracking-tighter">Vortex</span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h2 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl font-black leading-[1] tracking-tight"
                            >
                                Elegant <br />
                                <span className="text-primary-100 opacity-90">Billing for</span> <br />
                                <span className="text-white">Professionals.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-primary-50/80 max-w-sm font-medium leading-relaxed"
                            >
                                Join the elite circle of businesses managing their finances with precision and style.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-12">
                            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all">
                                <ShieldCheck className="text-white mb-2" size={20} />
                                <h4 className="font-bold text-base mb-0.5">Secure</h4>
                                <p className="text-[10px] text-white/70 leading-tight">Banking-grade data protection.</p>
                            </div>
                            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all">
                                <Zap className="text-white mb-2" size={20} />
                                <h4 className="font-bold text-base mb-0.5">Instant</h4>
                                <p className="text-[10px] text-white/70 leading-tight">One-click invoice generation.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                        <p className="text-xl font-medium leading-relaxed italic text-white/90">
                            "{getDailyQuote().text}"
                        </p>
                        <p className="mt-4 text-sm font-bold text-primary-200 tracking-wide uppercase">— {getDailyQuote().author}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-12 border-t border-white/10 text-primary-100/60 text-sm">
                        <div className="flex gap-4">
                            <Globe size={18} />
                            <span>Available Globally</span>
                        </div>
                        <span>© 2026 Vortex Inc.</span>
                    </div>
                </div>

                {/* Right Section: Form */}
                <div className="p-8 md:p-20 flex flex-col justify-center">
                    <div className="max-w-[420px] mx-auto w-full">
                        <div className="mb-12">
                            <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h3>
                            <p className="text-slate-500 font-medium text-lg">Sign in to your dashboard to continue.</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-[1.5rem] text-sm font-medium flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        required
                                        className="premium-input pl-14"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <Link to="/forgot" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        required
                                        className="premium-input pl-14"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="premium-button w-full mt-4"
                            >
                                {isLoading ? (
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>Sign In <ArrowRight size={20} /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-12">
                            <div className="relative flex items-center gap-4 mb-10">
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm">
                                    <Globe size={20} /> Google
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm">
                                    <Sparkles size={20} /> Microsoft
                                </button>
                            </div>
                        </div>

                        <p className="mt-12 text-center text-slate-500 font-medium">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-primary-600 font-extrabold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
