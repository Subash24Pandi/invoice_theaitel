const express = require('express');
const router = express.Router();
const { Invoice, Customer } = require('../models');
const auth = require('../middleware/auth');
const axios = require('axios');

// Get all invoices (Global)
router.get('/', auth, async (req, res) => {
    try {
        const { type } = req.query;
        const where = {};
        if (type) where.type = type;
        
        const invoices = await Invoice.findAll({
            where,
            include: [{ model: Customer }],
            order: [['createdAt', 'DESC']]
        });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get next invoice number (Global sequence)
router.get('/next-number', auth, async (req, res) => {
    try {
        const lastInvoice = await Invoice.findOne({
            where: { type: req.query.type || 'Invoice' },
            order: [['createdAt', 'DESC']]
        });
        const nextNum = lastInvoice ? parseInt(lastInvoice.invoiceNumber) + 1 : 1;
        res.json({ nextNumber: nextNum.toString().padStart(3, '0') });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create invoice
router.post('/', auth, async (req, res) => {
    try {
        const invoice = await Invoice.create(req.body);
        
        // Background Webhook to Lead Dashboard
        try {
            const customer = await Customer.findByPk(invoice.customerId);
            if (customer) {
                const webhookUrl = 'https://aitel-bde-backend.onrender.com/api/webhooks/portal';
                const payload = {
                    customerName: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    status: invoice.type === 'Quotation' ? 'Quotation Raised' : 'Invoice Raised',
                    companyName: customer.companyName || 'N/A'
                };
                
                // Fire and forget (don't await so the UI stays fast)
                axios.post(webhookUrl, payload).catch(err => console.error('Webhook Error:', err.message));
            }
        } catch (webhookErr) {
            console.error('Failed to prepare webhook:', webhookErr.message);
        }

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single invoice
router.get('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [{ model: Customer }]
        });
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update invoice
router.put('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        await invoice.update(req.body);
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete invoice
router.delete('/:id', auth, async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        await invoice.destroy();
        res.json({ message: 'Invoice deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
