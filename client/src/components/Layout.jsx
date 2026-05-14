import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Box, Quote, FileText, 
    BarChart2, CreditCard, Settings, LogOut, Search,
    Bell, ChevronLeft, Menu, X, User, ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link to={path}>
        <motion.div 
            whileHover={{ x: 4 }}
            className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
        >
            <div className={`shrink-0 ${active ? 'text-white' : 'group-hover:text-primary-600 transition-colors'}`}>
                <Icon size={20} />
            </div>
            {!collapsed && (
                <span className={`text-sm ${active ? 'font-semibold text-white' : 'font-medium text-slate-600'}`}>
                    {label}
                </span>
            )}
        </motion.div>
    </Link>
);

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
        { icon: Users, label: 'Customers', path: '/app/customers' },
        { icon: Box, label: 'Products', path: '/app/products' },
        { icon: Quote, label: 'Quotations', path: '/app/quotations' },
        { icon: FileText, label: 'Proforma Invoices', path: '/app/proformas' },
        { icon: FileText, label: 'Invoices', path: '/app/invoices' },
        { icon: CreditCard, label: 'Accounts', path: '/app/accounts' },
        { icon: CreditCard, label: 'Payments', path: '/app/payments' },
        { icon: Settings, label: 'Settings', path: '/app/settings' },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] mesh-gradient overflow-hidden font-poppins">
            {/* Sidebar Desktop */}
            <motion.aside 
                animate={{ width: collapsed ? 80 : 280 }}
                className="hidden lg:flex flex-col bg-white border-r border-slate-100 h-full p-6 transition-all duration-500 relative z-30"
            >
                <div className="flex items-center gap-4 px-2 mb-10 overflow-hidden">
                    <div className="min-w-[56px] h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-1">
                        <img src="/logo.png" alt="Vortex" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    {!collapsed && (
                        <motion.span 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xl font-black text-slate-900 tracking-tight"
                        >
                            Vortex
                        </motion.span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <SidebarItem 
                            key={item.path} 
                            {...item} 
                            active={location.pathname === item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <button 
                        onClick={() => { logout(); navigate('/login'); }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 bg-white/60 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            className="lg:hidden text-slate-600 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 hover:text-primary-600 transition-all p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 shadow-sm group">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">{user?.ownerName}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user?.companyName}</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-100 cursor-pointer hover:scale-105 transition-transform">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
