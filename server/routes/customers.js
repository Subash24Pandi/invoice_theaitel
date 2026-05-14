const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const auth = require('../middleware/auth');

// Get all customers (Global)
router.get('/', auth, async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create customer
router.post('/', auth, async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        await customer.update(req.body);
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        await customer.destroy();
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
