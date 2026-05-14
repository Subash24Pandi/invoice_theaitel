const express = require('express');
const router = express.Router();
const { Invoice, Customer } = require('../models');
const auth = require('../middleware/auth');

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
