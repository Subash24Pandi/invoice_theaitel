import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Download, Printer, ArrowLeft, Mail, Share2, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../utils/api';

const InvoiceView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState('');
    const [logoBase64, setLogoBase64] = useState('');
    const invoiceRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invRes, sigRes] = await Promise.all([
                    api.get(`/invoices/${id}`),
                    api.get('/signatures')
                ]);
                setInvoice(invRes.data);
                setSignatures(sigRes.data);
                
                const response = await fetch('/aitel_logo.jpeg');
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => setLogoBase64(reader.result);
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const shouldPrint = queryParams.get('print') === 'true';

    useEffect(() => {
        if (invoice) {
            setDownloadFileName(`Invoice_${invoice.prefix}${invoice.invoiceNumber}`);
            if (shouldPrint) {
                // Short timeout to ensure styles are loaded
                setTimeout(() => {
                    window.print();
                }, 1000);
            }
        }
    }, [invoice, shouldPrint]);

    const handleDownload = async (format) => {
        const element = invoiceRef.current;
        if (format === 'PDF') {
            try {
                const canvas = await html2canvas(element, { 
                    scale: 3, 
                    useCORS: true, 
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    onclone: (clonedDoc) => {
                        // Force standard colors and strip oklch/modern colors that break html2canvas
                        const style = clonedDoc.createElement('style');
                        style.innerHTML = `
                            :root {
                                color-scheme: light !important;
                            }
                            * {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                                border-color: #e5e7eb !important; /* default border */
                            }
                            .invoice-page { 
                                color: #000000 !important;
                                background: #ffffff !important;
                                box-shadow: none !important;
                            }
                            .blue-text { color: #0066cc !important; }
                            .text-gray-500, .text-slate-500 { color: #6b7280 !important; }
                            .text-gray-600, .text-slate-600 { color: #4b5563 !important; }
                            .text-gray-800, .text-slate-800 { color: #1f2937 !important; }
                            .text-black, .text-slate-900 { color: #000000 !important; }
                            .border-gray-100, .border-slate-100 { border-color: #f3f4f6 !important; }
                            .divide-gray-100 > * + * { border-color: #f3f4f6 !important; }
                            .bg-slate-100 { background-color: #f3f4f6 !important; }
                            .bg-slate-50 { background-color: #f9fafb !important; }
                        `;
                        clonedDoc.head.appendChild(style);

                        // Proactive cleanup: traverse and check for oklch in computed styles
                        const allElements = clonedDoc.getElementsByTagName('*');
                        for (let i = 0; i < allElements.length; i++) {
                            const el = allElements[i];
                            const style = window.getComputedStyle(el);
                            if (style.color.includes('oklch')) el.style.color = '#000000';
                            if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'transparent';
                            if (style.borderColor.includes('oklch')) el.style.borderColor = '#e5e7eb';
                        }
                    }
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`${downloadFileName}.pdf`);
            } catch (err) { console.error('PDF Generation Error:', err); }
        } else if (format === 'DOCX') {
            const url = window.URL.createObjectURL(new Blob([element.innerText]));
            const fileLink = document.createElement('a');
            fileLink.href = url;
            fileLink.download = `${downloadFileName}.doc`;
            fileLink.click();
            URL.revokeObjectURL(url);
        }
        setIsDownloadModalOpen(false);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invoice ${invoice.prefix}${invoice.invoiceNumber}`,
                    text: `Please find attached the invoice for ${invoice.Customer?.name}`,
                    url: window.location.href
                });
            } catch (err) { console.log('Share failed:', err); }
        } else {
            alert('Sharing is not supported on this browser');
        }
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(`Invoice ${invoice.prefix}${invoice.invoiceNumber} from THE AITEL`);
        const body = encodeURIComponent(`Hello ${invoice.Customer?.name},\n\nPlease find your invoice details below:\nInvoice Number: ${invoice.prefix}${invoice.invoiceNumber}\nAmount: ₹${invoice.totalAmount}\n\nThank you for your business!`);
        window.location.href = `mailto:${invoice.Customer?.email}?subject=${subject}&body=${body}`;
    };

    if (!invoice) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-100 pb-20 font-sans">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white !important; }
                        .invoice-page { margin: 0 !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
                    }
                    .invoice-page {
                        width: 210mm;
                        min-height: 297mm;
                        background: white;
                        margin: 40px auto;
                        padding: 15mm;
                        box-shadow: 0 0 20px rgba(0,0,0,0.05);
                        border: 1px solid #e5e7eb;
                        color: #1a1a1a;
                        font-family: 'Poppins', sans-serif;
                    }
                    .blue-text { color: #0066cc; }
                    .border-blue-thin { border-top: 1px solid #0066cc; border-bottom: 1px solid #0066cc; }
                    .table-header th { border-top: 1px solid #0066cc; border-bottom: 1px solid #0066cc; color: #333; font-weight: bold; font-size: 11px; padding: 8px 4px; }
                    .table-row td { padding: 10px 4px; font-size: 11px; vertical-align: top; }
                `}
            </style>

            {/* TOP ACTIONS BAR */}
            <div className="bg-white border-b border-slate-200 px-10 py-4 flex justify-between items-center sticky top-0 z-[100] no-print">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-900 transition-all">
                    <ArrowLeft size={18} /> Back to List
                </button>
                <div className="flex items-center gap-4">
                    <button onClick={handleEmail} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                        <Mail size={16} /> Email
                    </button>
                    <button onClick={handleShare} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={() => setIsDownloadModalOpen(true)} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                        <Download size={16} /> Download
                    </button>
                </div>
            </div>

            {/* DOWNLOAD MODAL */}
            {isDownloadModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDownloadModalOpen(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
                        <h3 className="text-xl font-black text-slate-900 mb-6">Download Invoice</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">File Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 transition-all"
                                    value={downloadFileName}
                                    onChange={(e) => setDownloadFileName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 pt-4">
                                <button onClick={() => handleDownload('PDF')} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50 transition-all group">
                                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={28} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">PDF Document</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recommended Format</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setIsDownloadModalOpen(false)} className="w-full mt-8 py-4 text-xs font-black text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                    </div>
                </div>
            )}

            <div className="invoice-page relative overflow-hidden" ref={invoiceRef}>
                {/* WATERMARK */}
                <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.05]"
                    style={{ transform: 'rotate(-30deg)' }}
                >
                    <img src={logoBase64} alt="" className="w-[800px] h-[800px] object-contain grayscale" />
                </div>

                {/* HEADER */}
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-lg font-bold blue-text tracking-wider uppercase">
                        {invoice.type === 'Invoice' ? 'TAX INVOICE' : invoice.type || 'TAX INVOICE'}
                    </h1>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">ORIGINAL FOR RECIPIENT</p>
                </div>

                {/* COMPANY INFO */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">THE AITEL</h2>
                        <div className="text-[11px] font-bold text-gray-800 space-y-0.5">
                            <p>GSTIN <span className="font-bold">33HIJPK2417P1ZV</span></p>
                            <p>D/No.161, 161B, 2nd Floor, RS Puram</p>
                            <p>Ponnurangam East Road, Coimbatore</p>
                            <p>Coimbatore, TAMIL NADU, 641002</p>
                            <p>Mobile <span className="font-bold">+91 8904887300</span> Email <span className="font-bold">gopi.n@theaitel.com</span></p>
                        </div>
                    </div>
                    {logoBase64 && (
                        <div className="flex flex-col items-end">
                             <img src={logoBase64} alt="Logo" className="h-20 object-contain" />
                        </div>
                    )}
                </div>

                {/* META INFO */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-[11px] font-bold">
                    <div>
                        <p className="text-gray-600">Invoice #: <span className="text-[#1a1a1a] font-bold">{invoice.prefix}{invoice.invoiceNumber}</span></p>
                    </div>
                    <div>
                        <p className="text-gray-600">Invoice Date: <span className="text-[#1a1a1a] font-bold">{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                    </div>
                    <div>
                        <p className="text-gray-600">Due Date: <span className="text-[#1a1a1a] font-bold">{new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                    </div>
                </div>

                {/* CUSTOMER SECTION */}
                <div className="grid grid-cols-2 gap-8 mb-6 border-t border-gray-100 pt-4">
                    <div className="space-y-1 text-[11px]">
                        <p className="text-gray-500 font-bold text-[10px] mb-1 uppercase tracking-tight">Customer Details:</p>
                        <p className="font-bold text-[#1a1a1a] text-sm uppercase">{invoice.Customer?.ownerName || invoice.Customer?.name}</p>
                        <p className="font-bold text-[#1a1a1a] uppercase">{invoice.Customer?.companyName}</p>
                        <p className="text-[#1a1a1a] font-bold uppercase">GSTIN: {invoice.Customer?.gstin || 'N/A'}</p>
                        <p className="text-[#1a1a1a] font-bold">Ph: {invoice.Customer?.phone}</p>
                        <p className="text-[#1a1a1a] font-bold lowercase">{invoice.Customer?.email}</p>
                        <div className="mt-2">
                             <p className="text-gray-500 font-bold text-[10px] mb-1 uppercase tracking-tight">Place of Supply:</p>
                             <p className="font-bold text-[#1a1a1a] uppercase">{invoice.placeOfSupply || invoice.Customer?.placeOfSupply || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="space-y-1 text-[11px]">
                        <p className="text-gray-500 font-bold text-[10px] mb-1 uppercase tracking-tight">Billing Address:</p>
                        <p className="font-bold text-[#1a1a1a] uppercase leading-relaxed max-w-[300px]">
                            {invoice.Customer?.billingAddress}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mb-6">
                    <table className="w-full">
                        <thead className="table-header">
                            <tr>
                                <th className="text-left w-8">#</th>
                                <th className="text-left">Item</th>
                                <th className="text-right w-32">Rate / Item</th>
                                <th className="text-right w-24">Qty</th>
                                <th className="text-right w-32">Taxable Value</th>
                                <th className="text-right w-40">Tax Amount</th>
                                <th className="text-right w-32">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoice.items?.map((item, idx) => {
                                const price = Number(item.price || 0);
                                const quantity = Number(item.quantity || 0);
                                const gstRate = Number(item.gstRate || 0);
                                const taxableValue = price * quantity;
                                const taxAmount = taxableValue * (gstRate / 100);
                                const total = Number(item.total || 0);

                                return (
                                    <tr key={idx} className="table-row">
                                        <td className="text-left">{idx + 1}</td>
                                        <td className="text-left">
                                            <p className="font-bold uppercase text-[#1a1a1a]">{item.name}</p>
                                            {item.description && <p className="text-[9px] text-gray-500 mt-0.5 leading-tight italic">{item.description}</p>}
                                        </td>
                                        <td className="text-right font-bold">₹{price.toFixed(2)}</td>
                                        <td className="text-right font-bold uppercase">{quantity} {item.unit}</td>
                                        <td className="text-right font-bold">₹{taxableValue.toFixed(2)}</td>
                                        <td className="text-right font-bold">
                                            ₹{taxAmount.toFixed(2)} ({gstRate}%)
                                        </td>
                                        <td className="text-right font-bold">₹{total.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* TOTALS AREA */}
                {(() => {
                    const place = (invoice.placeOfSupply || invoice.Customer?.placeOfSupply || '').toUpperCase().replace(/\s/g, '');
                    const isTN = place.includes('TAMILNADU') || place.includes('33');
                    const totalTax = invoice.taxAmount || 0;
                    
                    return (
                        <div className="flex justify-end mb-4">
                            <div className="w-72 space-y-1 text-right text-[11px] font-bold">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxable Amount</span>
                                    <span className="text-[#1a1a1a] font-bold">₹{invoice.subTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                
                                {isTN ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">CGST 9.0%</span>
                                            <span className="text-[#1a1a1a] font-bold">₹{(totalTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">SGST 9.0%</span>
                                            <span className="text-[#1a1a1a] font-bold">₹{(totalTax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">IGST 18.0%</span>
                                        <span className="text-[#1a1a1a] font-bold">₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}

                                <div className="flex justify-end items-baseline pt-2">
                                    <span className="text-2xl font-bold text-[#1a1a1a] tracking-tight">₹{invoice.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* WORD AMOUNT AREA */}
                <div className="border-blue-thin py-2 mb-2">
                    <div className="flex justify-between items-center text-[10px]">
                        <p className="text-gray-500 font-bold">Total Items / Qty : <span className="text-[#1a1a1a]">{invoice.items?.length} / {invoice.items?.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0)}</span></p>
                        <p className="text-gray-600 font-bold italic">Total amount (in words): <span className="text-[#1a1a1a] not-italic font-bold">INR {invoice.totalAmountInWords} Only.</span></p>
                    </div>
                </div>
                <div className="text-right mb-8">
                     <p className="text-[11px] font-bold text-[#1a1a1a]">Amount Payable: <span className="text-sm font-bold ml-4">₹{invoice.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>
                </div>

                {/* FOOTER - UPI + BANK + SIG */}
                <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-3">
                        <p className="text-[10px] font-bold text-gray-800 mb-2">Pay using UPI:</p>
                        {invoice.bankDetails?.upiId && (
                            <div className="w-24 h-24 border border-gray-100 p-1">
                                <QRCodeSVG 
                                    value={`upi://pay?pa=${invoice.bankDetails.upiId}&pn=${invoice.bankDetails.accountHolder}&am=${invoice.totalAmount}&cu=INR`}
                                    size={100}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="col-span-5 text-[11px] font-bold">
                        <p className="text-[10px] font-bold text-gray-800 mb-2">Bank Details:</p>
                        <div className="space-y-1">
                            <p className="flex gap-4 text-gray-500">Bank: <span className="text-[#1a1a1a] font-bold uppercase">{invoice.bankDetails?.bankName}</span></p>
                            <p className="flex gap-4 text-gray-500">Account Holder: <span className="text-[#1a1a1a] font-bold uppercase">{invoice.bankDetails?.accountHolder}</span></p>
                            <p className="flex gap-4 text-gray-500">Account #: <span className="text-[#1a1a1a] font-bold">{invoice.bankDetails?.accountNo}</span></p>
                            <p className="flex gap-4 text-gray-500">IFSC Code: <span className="text-[#1a1a1a] font-bold uppercase">{invoice.bankDetails?.ifscCode}</span></p>
                            <p className="flex gap-4 text-gray-500">Branch: <span className="text-[#1a1a1a] font-bold uppercase">{invoice.bankDetails?.branchName}</span></p>
                        </div>
                    </div>
                    <div className="col-span-4 text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">For THE AITEL</p>
                        <div className="h-32 flex flex-col items-end justify-center">
                            {invoice.signature && (
                                <img 
                                    src={invoice.signature} 
                                    className="h-full w-auto object-contain" 
                                    alt="Signature" 
                                />
                            )}
                        </div>
                        <div className="h-px bg-slate-200 w-full mb-1"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Authorized Signatory</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceView;
