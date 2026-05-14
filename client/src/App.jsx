import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Customers from './pages/customers/Customers';
import Products from './pages/products/Products';
import CreateInvoice from './pages/invoices/CreateInvoice';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceView from './pages/invoices/InvoiceView';
import Payments from './pages/payments/Payments';
import Settings from './pages/settings/Settings';
import Accounts from './pages/accounts/Accounts';

import Landing from './pages/landing/Landing';

// Removed ProtectedRoute for automatic access
const ProtectedRoute = ({ children }) => {
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private Routes */}
                    <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="products" element={<Products />} />
                        <Route path="quotations" element={<InvoiceList type="Quotation" />} />
                        <Route path="proformas" element={<InvoiceList type="Proforma" />} />
                        <Route path="invoices" element={<InvoiceList type="Invoice" />} />
                        <Route path="accounts" element={<Accounts />} />
                        <Route path="payments" element={<Payments />} />
                        <Route path="settings" element={<Settings />} />

                        {/* Fullscreen routes nested inside Layout but using absolute-like paths or just subpaths */}
                        <Route path="quotations/create" element={<CreateInvoice />} />
                        <Route path="invoices/create" element={<CreateInvoice />} />
                        <Route path="proformas/create" element={<CreateInvoice />} />
                        
                        <Route path="invoices/view/:id" element={<InvoiceView />} />
                        <Route path="quotations/view/:id" element={<InvoiceView />} />
                        <Route path="proformas/view/:id" element={<InvoiceView />} />
                        
                        <Route path="invoices/edit/:id" element={<CreateInvoice />} />
                        <Route path="quotations/edit/:id" element={<CreateInvoice />} />
                        <Route path="proformas/edit/:id" element={<CreateInvoice />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
