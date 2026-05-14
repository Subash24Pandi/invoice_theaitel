import React, { useState, useEffect } from 'react';
import { 
    Plus, Search, Edit2, Trash2, Package, 
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Box, Filter, Download
} from 'lucide-react';
import api from '../../utils/api';
import ProductDrawer from '../../components/ProductDrawer';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (formData) => {
        try {
            if (selectedProduct) await api.put(`/products/${selectedProduct.id}`, formData);
            else await api.post('/products', formData);
            fetchProducts();
            setIsDrawerOpen(false);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) { console.error(err); }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.hsn?.includes(searchTerm)
    );

    return (
        <div className="space-y-8 font-poppins">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary-600 font-bold mb-2">
                        <Box size={16} fill="currentColor" />
                        <span className="uppercase tracking-[0.2em] text-[10px]">Inventory</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Products & Services</h1>
                </div>
                
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Download size={14} /> Bulk Import
                    </button>
                    <button 
                        onClick={() => { setSelectedProduct(null); setIsDrawerOpen(true); }}
                        className="premium-button shadow-lg shadow-primary-100"
                    >
                        <Plus size={18} /> Add New Item
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Items', value: products.length, icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Low Stock', value: '0', icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Top Seller', value: products[0]?.name || '—', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Categories', value: '1', icon: Filter, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md p-5 rounded-[1.5rem] border border-white shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-lg font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products by name or HSN..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border-none rounded-xl outline-none focus:bg-white transition-all text-xs font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <Filter size={14} /> Filters
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] border border-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">HSN/SAC</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax</th>
                            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-primary-50/30 transition-all duration-300 group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm leading-none mb-1">{p.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{p.type} • {p.unit}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold font-mono tracking-wider">
                                        {p.hsn || 'NONE'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-bold text-slate-900 text-sm">
                                    ₹{p.sellingPrice?.toLocaleString() || '0'}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">
                                        {p.taxRate}% GST
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button 
                                            onClick={() => { setSelectedProduct(p); setIsDrawerOpen(true); }}
                                            className="p-2 text-slate-300 hover:text-primary-600 transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} product={selectedProduct} onSave={handleSave} />
        </div>
    );
};

export default Products;
