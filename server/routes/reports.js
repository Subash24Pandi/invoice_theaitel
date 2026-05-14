const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { Op, fn, col, literal } = require('sequelize');

router.get('/summary', async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        
        // Basic totals
        const totalSales = invoices.filter(inv => inv.type === 'Invoice').reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
        const totalTax = invoices.filter(inv => inv.type === 'Invoice').reduce((acc, inv) => acc + (inv.taxAmount || 0), 0);
        const totalPending = invoices.filter(inv => inv.type === 'Invoice').reduce((acc, inv) => acc + ((inv.totalAmount || 0) - (inv.amountPaid || 0)), 0);

        // Monthly Sales (last 6 months)
        const monthlySales = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const monthYear = date.getFullYear();
            
            const monthTotal = invoices
                .filter(inv => inv.type === 'Invoice' && new Date(inv.createdAt).getMonth() === date.getMonth() && new Date(inv.createdAt).getFullYear() === monthYear)
                .reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
                
            monthlySales.push({ month: monthName, total: monthTotal });
        }

        // Top Customers
        const customerMap = {};
        invoices.filter(inv => inv.type === 'Invoice').forEach(inv => {
            customerMap[inv.customerId] = (customerMap[inv.customerId] || 0) + (inv.totalAmount || 0);
        });
        
        const customers = await Customer.findAll();
        const topCustomers = Object.keys(customerMap)
            .map(id => ({
                name: customers.find(c => c.id === id)?.name || 'Unknown',
                total: customerMap[id]
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        // GST Breakdown
        const gstBreakdown = {
            taxable: invoices.filter(inv => inv.type === 'Invoice').reduce((acc, inv) => acc + (inv.subTotal || 0), 0),
            cgst: totalTax / 2, // Assuming 9% each for local
            sgst: totalTax / 2,
            igst: 0, // Placeholder for inter-state
            total: totalTax
        };

        res.json({
            totalSales,
            totalTax,
            totalPending,
            monthlySales,
            topCustomers,
            gstBreakdown
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
