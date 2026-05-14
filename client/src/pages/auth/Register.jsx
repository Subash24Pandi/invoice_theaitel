import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Layout, User, Phone, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { getDailyQuote } from '../../utils/quotes';

const Register = () => {
    const [formData, setFormData] = useState({
        ownerName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
        try {
            await api.post('/auth/register', {
                ...formData
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const inputFields = [
        { name: 'ownerName', label: 'Name', icon: User, placeholder: 'John Doe' },
        { name: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91 9876543210' },
        { name: 'email', label: 'Email Address', icon: Mail, placeholder: 'john@example.com' },
        { name: 'password', label: 'Password', icon: Lock, placeholder: '••••••••', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', icon: Lock, placeholder: '••••••••', type: 'password' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 py-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
            >
                <div className="w-full md:w-2/5 bg-primary-600/80 backdrop-blur-xl p-12 text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="Vortex" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-bold">Vortex</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-6">Join thousands of businesses.</h2>
                        <ul className="space-y-4 text-white/90">
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white" /> Professional GST Invoices</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white" /> Quick GST Verification</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white" /> Real-time Analytics</li>
                            <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-white" /> WhatsApp Sharing</li>
                        </ul>
                    </div>
                    <div className="mt-12 p-6 glass-dark rounded-2xl">
                        <p className="text-sm italic text-blue-100">"{getDailyQuote().text}"</p>
                        <p className="mt-2 text-xs font-bold">— {getDailyQuote().author}</p>
                    </div>
                </div>

                <div className="w-full md:w-3/5 p-8 md:p-12">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-900">Create Account</h3>
                        <p className="text-slate-500">Enter your details to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inputFields.map((field) => (
                            <div key={field.name} className={(field.name === 'ownerName' || field.name === 'email') ? 'md:col-span-2' : ''}>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block ml-1">{field.label} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type={field.type || 'text'}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder={field.placeholder}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="md:col-span-2 mt-4">
                            <button 
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                Create My Account <ArrowRight size={20} />
                            </button>
                            <p className="mt-6 text-center text-slate-500 text-sm">
                                Already have an account? {' '}
                                <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
