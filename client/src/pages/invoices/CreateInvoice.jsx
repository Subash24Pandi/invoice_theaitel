import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
    ChevronDown, Plus, Search, HelpCircle, 
    Trash2, Settings, MessageSquare, ArrowRight,
    Signature as SigIcon, FileText, Banknote, X, Info
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import CustomerDrawer from '../../components/CustomerDrawer';
import ProductDrawer from '../../components/ProductDrawer';
import BankDrawer from '../../components/BankDrawer';
import { numberToWords } from '../../utils/numberToWords';

const CreateInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine initial type from URL
    const isQuotationPath = location.pathname.includes('/quotations');
    const isProformaPath = location.pathname.includes('/proformas');

    const [invoiceData, setInvoiceData] = useState({
        type: isQuotationPath ? 'Quotation' : isProformaPath ? 'Proforma' : 'Invoice',
        invoiceNumber: '1',
        prefix: isQuotationPath ? 'EST-' : isProformaPath ? 'PI-' : 'INV-',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        reference: '',
        placeOfSupply: '',
        customerId: '',
        items: [{
            name: 'AI_CALLING',
            price: 8.00,
            quantity: 1,
            gstRate: 18,
            unit: 'NOS',
            discount: 0,
            discountType: '%',
            total: 9.44
        }],
        subTotal: 0,
        taxAmount: 0,
        discount: 0,
        totalAmount: 0,
        notes: '',
        terms: '',
        paymentMode: 'Cash',
        amountPaid: 0,
        roundOff: true,
        globalDiscount: 0,
        bankDetails: null,
        signature: null,
        status: 'Unpaid'
    });

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [banks, setBanks] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const [isCustDrawerOpen, setIsCustDrawerOpen] = useState(false);
    const [isProdDrawerOpen, setIsProdDrawerOpen] = useState(false);
    const [isBankDrawerOpen, setIsBankDrawerOpen] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [quickQty, setQuickQty] = useState(1);
    const [selectedProd, setSelectedProd] = useState(null);

    useEffect(() => { 
        fetchInitialData(); 
        if (id) fetchExistingInvoice();
        else calculateTotals(invoiceData.items);
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const [custRes, prodRes, bankRes, sigRes, numRes] = await Promise.all([
                api.get('/customers'),
                api.get('/products'),
                api.get('/banks'),
                api.get('/signatures'),
                !id ? api.get(`/invoices/next-number?type=${invoiceData.type}`) : Promise.resolve({ data: null })
            ]);
            setCustomers(custRes.data);
            setProducts(prodRes.data);
            setBanks(bankRes.data);
            setSignatures(sigRes.data);
            if (numRes.data) {
                setInvoiceData(prev => ({ ...prev, invoiceNumber: numRes.data.nextNumber }));
            }
        } catch (err) { 
            console.error('Fetch Error:', err); 
            alert('CRITICAL: Failed to load data from ' + (import.meta.env.VITE_API_URL || 'localhost') + '. Error: ' + err.message);
        }
    };

    const fetchExistingInvoice = async () => {
        try {
            const res = await api.get(`/invoices/${id}`);
            const data = res.data;
            setInvoiceData({
                ...data,
                customerId: data.customerId?.id || data.customerId
            });
        } catch (err) { 
            console.error('Fetch Invoice Error:', err); 
            alert('Failed to fetch invoice: ' + err.message);
        }
    };

    const calculateTotals = (items, gDisc = invoiceData.globalDiscount, rOff = invoiceData.roundOff) => {
        let subTotal = 0;
        let taxAmount = 0;
        items.forEach(item => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const gst = parseFloat(item.gstRate) || 0;
            const disc = parseFloat(item.discount) || 0;
            const itemTotal = qty * price;
            const discountAmt = item.discountType === '%' ? (itemTotal * disc / 100) : disc;
            const netAmount = itemTotal - discountAmt;
            const itemTax = (netAmount * gst / 100);
            subTotal += netAmount;
            taxAmount += itemTax;
            item.total = netAmount + itemTax;
        });
        const total = subTotal + taxAmount - (parseFloat(gDisc) || 0);
        const finalTotal = rOff ? Math.round(total) : total;
        setInvoiceData(prev => ({
            ...prev,
            items,
            subTotal,
            taxAmount,
            totalAmount: finalTotal,
            totalAmountInWords: numberToWords(finalTotal)
        }));
    };

    const handleQuickAdd = () => {
        if (!selectedProd) return;
        const newItem = {
            productId: selectedProd.id,
            name: selectedProd.name,
            price: selectedProd.sellingPrice || 0,
            quantity: parseFloat(quickQty),
            gstRate: selectedProd.taxRate || 0,
            unit: selectedProd.unit || 'PCS',
            stock: selectedProd.openingQty || 0,
            discount: 0,
            discountType: '%'
        };
        calculateTotals([...invoiceData.items, newItem]);
        setSelectedProd(null);
        setQuickQty(1);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...invoiceData.items];
        newItems[index][field] = value;
        calculateTotals(newItems);
    };

    const handleSave = async (options = {}) => {
        if (!invoiceData.customerId) return alert('Please select a customer');
        if (invoiceData.items.length === 0) return alert('Please add at least one item');
        if (!invoiceData.bankDetails) return alert('Please add bank details (Mandatory)');
        if (!invoiceData.signature) return alert('Please add a signature (Mandatory)');

        const finalData = { 
            ...invoiceData, 
            status: options.status || invoiceData.status || 'Unpaid' 
        };

        try {
            let res;
            if (invoiceData.id) {
                res = await api.put(`/invoices/${invoiceData.id}`, finalData);
            } else {
                res = await api.post('/invoices', finalData);
            }
            
            const savedDoc = res.data;
            const newId = savedDoc.id || invoiceData.id;
            const target = invoiceData.type === 'Invoice' ? 'invoices' : invoiceData.type === 'Proforma' ? 'proformas' : 'quotations';
            
            if (options.print) {
                navigate(`/app/${target}/view/${newId}?print=true`);
            } else {
                navigate(`/app/${target}`);
            }
        } catch (err) { 
            console.error('Save error:', err);
            alert('Failed to save document: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#495057] font-sans pb-32">
            {/* TOP NAV */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">Document Type</span>
                        <div className="relative group">
                            <button 
                                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black text-slate-900 flex items-center gap-3 hover:border-blue-400 transition-all shadow-sm active:scale-95"
                            >
                                <div className={`w-2 h-2 rounded-full ${invoiceData.type === 'Invoice' ? 'bg-blue-500' : invoiceData.type === 'Proforma' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                                <span className="text-xs font-bold">
                                    {invoiceData.type === 'Invoice' ? 'Tax Invoice' : invoiceData.type === 'Proforma' ? 'Proforma Invoice' : 'Quotation'}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isTypeDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[998]" onClick={() => setIsTypeDropdownOpen(false)} />
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button 
                                            onClick={async () => {
                                                const newType = 'Invoice';
                                                try {
                                                    const res = await api.get(`/invoices/next-number?type=${newType}`);
                                                    setInvoiceData(prev => ({ 
                                                        ...prev, 
                                                        type: newType, 
                                                        prefix: 'INV-',
                                                        invoiceNumber: res.data.nextNumber,
                                                        id: prev.type !== newType ? undefined : prev.id 
                                                    }));
                                                } catch (err) { console.error(err); }
                                                setIsTypeDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-3 transition-colors ${invoiceData.type === 'Invoice' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Tax Invoice
                                        </button>
                                        <button 
                                            onClick={async () => {
                                                const newType = 'Proforma';
                                                try {
                                                    const res = await api.get(`/invoices/next-number?type=${newType}`);
                                                    setInvoiceData(prev => ({ 
                                                        ...prev, 
                                                        type: newType, 
                                                        prefix: 'PI-',
                                                        invoiceNumber: res.data.nextNumber,
                                                        id: prev.type !== newType ? undefined : prev.id 
                                                    }));
                                                } catch (err) { console.error(err); }
                                                setIsTypeDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-3 transition-colors ${invoiceData.type === 'Proforma' ? 'text-purple-600 bg-purple-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            Proforma Invoice
                                        </button>
                                        <button 
                                            onClick={async () => {
                                                const newType = 'Quotation';
                                                const res = await api.get(`/invoices/next-number?type=${newType}`);
                                                setInvoiceData(prev => ({ 
                                                    ...prev, 
                                                    type: newType, 
                                                    prefix: 'EST-',
                                                    invoiceNumber: res.data.nextNumber,
                                                    id: prev.type !== newType ? undefined : prev.id 
                                                }));
                                                setIsTypeDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-3 transition-colors ${invoiceData.type === 'Quotation' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            Quotation
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 text-gray-600 text-sm font-medium hover:text-gray-900">
                    <Settings size={16} /> Settings
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto p-6 space-y-6">
                
                {/* CUSTOMER & META ROW */}
                <div className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-4 bg-[#EBF5FF] border border-[#D1E9FF] rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-600">Select Customer <span className="text-red-500">*</span></label>
                            <button onClick={() => setIsCustDrawerOpen(true)} className="text-[11px] font-bold text-blue-600">+ Create Customer</button>
                        </div>
                        <div className="relative">
                            <select 
                                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400"
                                value={invoiceData.customerId}
                                onChange={(e) => setInvoiceData({...invoiceData, customerId: e.target.value})}
                            >
                                <option value="">Search customers by name, company, GSTIN...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="col-span-8 grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                                {invoiceData.type === 'Invoice' ? 'Invoice Number' : invoiceData.type === 'Proforma' ? 'Proforma Number' : 'Quotation Number'} <span className="text-red-500">*</span>
                            </label>
                            <div className="flex shadow-sm rounded-md overflow-hidden group">
                                <input 
                                    type="text" 
                                    className="w-16 bg-slate-50 border border-slate-200 border-r-0 px-3 py-2.5 text-xs font-black text-slate-400 outline-none focus:border-blue-400 transition-all uppercase" 
                                    value={invoiceData.prefix} 
                                    onChange={(e) => setInvoiceData({...invoiceData, prefix: e.target.value.toUpperCase()})}
                                />
                                <input 
                                    type="text" 
                                    className="flex-1 border border-slate-200 px-3 py-2.5 text-sm font-black text-slate-900 outline-none focus:border-blue-400 transition-all" 
                                    value={invoiceData.invoiceNumber} 
                                    onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">
                                {invoiceData.type === 'Invoice' ? 'Invoice Date' : 'Quotation Date'} <span className="text-red-500">*</span>
                            </label>
                            <input type="date" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={invoiceData.date} onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-xs font-bold text-gray-600">Due Date</label>
                                <HelpCircle size={14} className="text-gray-400" />
                            </div>
                            <input type="date" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm" value={invoiceData.dueDate} onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-xs font-bold text-gray-600">Reference</label>
                            </div>
                            <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm placeholder:text-gray-300" placeholder="PO Number..." value={invoiceData.reference} onChange={(e) => setInvoiceData({...invoiceData, reference: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">Place of Supply</label>
                            <input type="text" className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm placeholder:text-gray-300" placeholder="e.g. 33-TAMIL NADU" value={invoiceData.placeOfSupply} onChange={(e) => setInvoiceData({...invoiceData, placeOfSupply: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* PRODUCT SECTION */}
                <div className="bg-[#EDF5FF] rounded-lg border border-[#D1E9FF] overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                                Products & Services <HelpCircle size={14} className="text-gray-400" />
                            </div>
                            <button onClick={() => setIsProdDrawerOpen(true)} className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                <Plus size={14} /> Add new Product?
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-blue-600" defaultChecked /> Show description
                            </label>
                            <Settings size={14} />
                        </div>
                    </div>

                    <div className="px-4 pb-4 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select 
                                className="w-full bg-white border border-gray-200 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-blue-400"
                                value=""
                                onChange={(e) => {
                                    const prod = products.find(p => String(p.id) === String(e.target.value));
                                    if (prod) {
                                        const newItem = {
                                            productId: prod.id,
                                            name: prod.name,
                                            price: prod.sellingPrice || 0,
                                            quantity: 1,
                                            gstRate: prod.taxRate || 0,
                                            unit: prod.unit || 'PCS',
                                            stock: prod.openingQty || 0,
                                            discount: 0,
                                            discountType: '%'
                                        };
                                        calculateTotals([...invoiceData.items, newItem]);
                                    }
                                }}
                            >
                                <option value="">Search or scan barcode for existing products</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        </div>
                    </div>

                    {/* PRODUCT TABLE */}
                    <div className="bg-white mx-4 mb-4 rounded-md border border-gray-100 overflow-hidden min-h-[200px]">
                        {invoiceData.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 opacity-50">
                                <FileText size={48} className="text-gray-300 mb-4" />
                                <p className="text-sm font-medium mb-4">Search existing products to add to this list or add new product to get started! 🚀</p>
                                <button onClick={() => setIsProdDrawerOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-md text-xs font-bold">+ Add New Product</button>
                            </div>
                        ) : (
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product Name</th>
                                        <th className="px-4 py-3 text-center w-24">Quantity</th>
                                        <th className="px-4 py-3 text-center w-32">Unit Price</th>
                                        <th className="px-4 py-3 text-center w-32">Price with Tax</th>
                                        <th className="px-4 py-3 text-center w-40">Discount on Total Amount</th>
                                        <th className="px-4 py-3 text-right w-40">Total Net Amount + Tax</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoiceData.items.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                <div className="text-[10px] text-gray-400 mt-1">Stock: {item.stock} {item.unit}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <input className="w-16 border border-gray-200 rounded px-2 py-1 text-center" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} />
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <input className="w-24 border border-gray-200 rounded px-2 py-1 text-center" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} />
                                            </td>
                                            <td className="px-4 py-4 text-center text-gray-600">₹{(item.price * (1 + item.gstRate/100)).toFixed(2)}</td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <input className="w-12 border border-gray-200 rounded px-2 py-1 text-center" value={item.discount} onChange={(e) => updateItem(idx, 'discount', e.target.value)} />
                                                    <span className="text-gray-400 font-bold">%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold text-gray-900 flex items-center justify-end gap-2">
                                                ₹{(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                <button onClick={() => setInvoiceData({...invoiceData, items: invoiceData.items.filter((_, i) => i !== idx)})} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* LOWER SECTIONS */}
                <div className="grid grid-cols-2 gap-8">
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
                            <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-xs font-bold">
                                <ChevronDown size={14} /> Notes <HelpCircle size={14} className="text-gray-300" />
                            </div>
                            <textarea className="w-full p-4 text-xs outline-none h-24" placeholder="Enter your notes, say thanks, or anything else" value={invoiceData.notes} onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})} />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
                            <div 
                                className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                    <ChevronDown size={14} className={showTerms ? '' : '-rotate-90'} /> 
                                    Terms & Conditions 
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Use Default</span>
                                    <div 
                                        onClick={() => {
                                            const defaultTerms = "1. All payments should be made in favor of THE AITEL.\n2. Goods once sold will not be taken back or exchanged.\n3. Interest at 18% p.a. will be charged if not paid within due date.\n4. Disputes are subject to Coimbatore Jurisdiction.";
                                            if (!invoiceData.terms || invoiceData.terms === defaultTerms) {
                                                setInvoiceData({...invoiceData, terms: invoiceData.terms ? '' : defaultTerms});
                                            } else {
                                                if (window.confirm("Overwrite current terms with defaults?")) {
                                                    setInvoiceData({...invoiceData, terms: defaultTerms});
                                                }
                                            }
                                            setShowTerms(true);
                                        }}
                                        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer flex items-center transition-all ${invoiceData.terms?.includes("THE AITEL") ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                                    >
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                            <textarea 
                                className="w-full p-4 text-xs outline-none h-32 focus:bg-slate-50/30 transition-all font-medium leading-relaxed" 
                                placeholder="Enter your terms and conditions..." 
                                value={invoiceData.terms} 
                                onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})} 
                                onFocus={() => setShowTerms(true)}
                            />
                        </div>
                        <div className="space-y-3 pt-2">
                            {['Reverse Charge Mechanism applicable?', 'Create E-Waybill', 'Create E-Invoice'].map(t => (
                                <div key={t} className="flex items-center gap-3">
                                    <div className="w-8 h-4 bg-gray-200 rounded-full p-0.5"><div className="w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                    <span className="text-xs font-medium text-gray-600">{t}</span>
                                    <HelpCircle size={14} className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 space-y-4">
                             <div className="flex items-center gap-2 text-xs font-bold">Attach files <HelpCircle size={14} className="text-gray-300" /></div>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                                <Plus size={14} className="rotate-45" /> Attach Files (Max: 5)
                             </button>
                             <button className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                                <Settings size={14} /> Use Coupons <span className="text-[8px] bg-blue-100 text-blue-600 px-1 rounded ml-1">BETA</span>
                             </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE (SUMMARY) */}
                    <div className="space-y-6">
                        <div className="bg-[#F2F8F5] border border-[#E1EDE8] rounded-md p-6">
                            <div className="flex justify-end gap-2 mb-4 text-[10px] font-bold text-gray-400">
                                <span>Items: {invoiceData.items.length}, Qty: {invoiceData.items.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0).toFixed(3)}</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center font-medium">
                                    <span className="text-gray-500">Taxable Amount</span>
                                    <span>₹{invoiceData.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center font-medium">
                                    <span className="text-gray-500">Total Tax</span>
                                    <span>₹{invoiceData.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Round Off</span>
                                        <div 
                                            onClick={() => {
                                                const newRoff = !invoiceData.roundOff;
                                                setInvoiceData(prev => ({...prev, roundOff: newRoff}));
                                                calculateTotals(invoiceData.items, invoiceData.globalDiscount, newRoff);
                                            }} 
                                            className={`w-8 h-4 rounded-full p-0.5 cursor-pointer flex items-center transition-all ${invoiceData.roundOff ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                                        >
                                            <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                    <span className="text-gray-600">
                                        {invoiceData.roundOff 
                                            ? (invoiceData.totalAmount - (invoiceData.subTotal + invoiceData.taxAmount - invoiceData.globalDiscount)).toFixed(2)
                                            : '0.00'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-black text-gray-900 pt-2 border-t border-[#E1EDE8]">
                                    <span>Total Amount</span>
                                    <span>₹{invoiceData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-gray-500">
                                    <span className="text-xs">Total Discount</span>
                                    <span>₹0.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Select Bank <span className="text-red-500">*</span>
                                </div>
                                <button 
                                    onClick={() => navigate('/app/payments')}
                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    Manage Banks in Payments <ArrowRight size={10} />
                                </button>
                            </div>
                            
                            <div className="relative group">
                                <select 
                                    className={`w-full bg-white border ${!invoiceData.bankDetails ? 'border-red-200' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 appearance-none transition-all shadow-sm group-hover:border-slate-300`}
                                    value={invoiceData.bankDetails?.id || ''}
                                    onChange={(e) => {
                                        const selectedBank = banks.find(b => String(b.id) === String(e.target.value));
                                        setInvoiceData({...invoiceData, bankDetails: selectedBank});
                                    }}
                                >
                                    <option value="">{banks.length > 0 ? 'Select a saved bank account...' : 'No banks found. Add one in Payments section.'}</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.bankName} - {bank.accountNo} ({bank.accountHolder})
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <ChevronDown size={18} />
                                </div>
                            </div>

                            {!invoiceData.bankDetails && banks.length === 0 && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-[11px] text-red-600 font-bold flex items-center gap-2">
                                    <Info size={14} />
                                    <span>You need to add a bank account in the <span className="underline cursor-pointer" onClick={() => navigate('/app/payments')}>Payments</span> section before creating an invoice.</span>
                                </div>
                            )}

                            {invoiceData.bankDetails && (
                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Selected Bank Details</span>
                                        <button 
                                            onClick={() => setInvoiceData({...invoiceData, bankDetails: null})}
                                            className="text-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                                        <div className="text-slate-500 font-medium tracking-tight">Account Holder</div>
                                        <div className="text-slate-900 font-bold">{invoiceData.bankDetails.accountHolder}</div>
                                        <div className="text-slate-500 font-medium tracking-tight">Bank Name</div>
                                        <div className="text-slate-900 font-bold">{invoiceData.bankDetails.bankName}</div>
                                        <div className="text-slate-500 font-medium tracking-tight">Account No</div>
                                        <div className="text-slate-900 font-bold">{invoiceData.bankDetails.accountNo}</div>
                                        <div className="text-slate-500 font-medium tracking-tight">IFSC Code</div>
                                        <div className="text-slate-900 font-bold">{invoiceData.bankDetails.ifscCode}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Select Signature <span className="text-red-500">*</span>
                                </div>
                                <button 
                                    onClick={() => navigate('/app/settings')}
                                    className="text-[10px] font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                                >
                                    Manage Signatures <ArrowRight size={10} />
                                </button>
                            </div>

                            <div className="relative group">
                                <select 
                                    className={`w-full bg-white border ${!invoiceData.signature ? 'border-red-200' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-pink-400 appearance-none transition-all shadow-sm group-hover:border-slate-300`}
                                    value={signatures.find(s => s.image === invoiceData.signature)?.id || ''}
                                    onChange={(e) => {
                                        const selectedSig = signatures.find(s => String(s.id) === String(e.target.value));
                                        setInvoiceData({...invoiceData, signature: selectedSig?.image});
                                    }}
                                >
                                    <option value="">{signatures.length > 0 ? 'Select authorized signature...' : 'No signatures found. Add one in Settings.'}</option>
                                    {signatures.map(sig => (
                                        <option key={sig.id} value={sig.id}>{sig.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                                    <ChevronDown size={18} />
                                </div>
                            </div>

                            {!invoiceData.signature && signatures.length === 0 && (
                                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-[11px] text-pink-600 font-bold flex items-center gap-2">
                                    <Info size={14} />
                                    <span>Add an authorized signature in the <span className="underline cursor-pointer" onClick={() => navigate('/app/settings')}>Settings</span> section.</span>
                                </div>
                            )}

                            {invoiceData.signature && (
                                    <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 mt-2 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 relative group">
                                        <button 
                                            onClick={() => setInvoiceData({...invoiceData, signature: null})}
                                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner mt-2">
                                            <img 
                                                src={invoiceData.signature} 
                                                className="h-32 object-contain mix-multiply" 
                                                alt="Signature" 
                                                style={{ 
                                                    filter: `
                                                        ${signatures.find(s => s.image === invoiceData.signature)?.invert ? 'invert(1)' : ''} 
                                                        contrast(200%) 
                                                        brightness(110%) 
                                                        saturate(0) 
                                                        blur(0.2px) 
                                                        contrast(150%)
                                                    `.replace(/\n/g, ''),
                                                }}
                                            />
                                        </div>
                                        <div className="text-center border-t border-slate-100 pt-3 w-full">
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                                {signatures.find(s => s.image === invoiceData.signature)?.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Authorized Signatory</p>
                                        </div>
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-10 py-4 flex justify-end gap-3 z-[1000]">
                <button 
                    onClick={() => handleSave({ status: 'Draft' })}
                    className="bg-[#F1F3F5] text-gray-700 px-6 py-2.5 rounded-md text-xs font-bold hover:bg-gray-200 transition-all"
                >
                    Save as Draft
                </button>
                <button 
                    onClick={() => handleSave({ print: true })}
                    className="bg-[#F1F3F5] text-gray-700 px-6 py-2.5 rounded-md text-xs font-bold hover:bg-gray-200 transition-all"
                >
                    Save and Print
                </button>
                <button onClick={() => handleSave()} className="bg-blue-600 text-white px-8 py-2.5 rounded-md text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2">Save <ArrowRight size={16} /></button>
            </div>

            {/* THE AITEL FOOTER INFO */}
            <div className="fixed bottom-0 left-6 z-[1001] flex items-center h-14 pointer-events-none">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <img src="/aitel_logo.jpeg" alt="The Aitel" className="h-8 object-contain" />
                    </div>
                    <p className="text-[9px] text-gray-400">©2026 The Aitel Technologies Private Limited. All rights reserved. <span className="text-blue-500 ml-1">Data is secured via 'bank-grade' security</span></p>
                </div>
            </div>


            <CustomerDrawer isOpen={isCustDrawerOpen} onClose={() => setIsCustDrawerOpen(false)} onSave={async (formData) => {
                try { 
                    const res = await api.post('/customers', formData); 
                    setCustomers(prev => [...prev, res.data]); 
                    setInvoiceData(prev => ({...prev, customerId: res.data.id})); 
                    setIsCustDrawerOpen(false); 
                } catch (e) { 
                    console.error(e); 
                    alert('Failed to save customer: ' + (e.response?.data?.message || e.message));
                }
            }} />
            <ProductDrawer isOpen={isProdDrawerOpen} onClose={() => setIsProdDrawerOpen(false)} onSave={async (formData) => {
                try {
                    const res = await api.post('/products', formData);
                    const newProduct = res.data;
                    setProducts(prev => [...prev, newProduct]);
                    const newItem = { productId: newProduct.id, name: newProduct.name, price: parseFloat(newProduct.sellingPrice) || 0, quantity: 1, gstRate: parseFloat(newProduct.taxRate) || 0, unit: newProduct.unit || 'PCS', stock: parseFloat(newProduct.openingQty) || 0, discount: 0, discountType: '%' };
                    calculateTotals([...invoiceData.items, newItem]);
                    setIsProdDrawerOpen(false);
                } catch (e) { 
                    console.error(e); 
                    alert('Failed to save product: ' + (e.response?.data?.message || e.message));
                }
            }} />
            <BankDrawer isOpen={isBankDrawerOpen} onClose={() => setIsBankDrawerOpen(false)} onSave={async (bank) => {
                setInvoiceData(prev => ({...prev, bankDetails: bank}));
                try {
                    const res = await api.get('/banks');
                    setBanks(res.data);
                } catch (err) { console.error(err); }
            }} />
        </div>
    );
};

export default CreateInvoice;
