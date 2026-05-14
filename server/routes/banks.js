const express = require('express');
const router = express.Router();
const Bank = require('../models/Bank');

// Get all banks
router.get('/', async (req, res) => {
    try {
        const banks = await Bank.findAll();
        res.json(banks);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add a new bank
router.post('/', async (req, res) => {
    try {
        const bank = await Bank.create(req.body);
        res.status(201).json(bank);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update a bank
router.put('/:id', async (req, res) => {
    try {
        const bank = await Bank.findByPk(req.params.id);
        if (bank) {
            await bank.update(req.body);
            res.json(bank);
        } else res.status(404).json({ message: 'Bank not found' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete a bank
router.delete('/:id', async (req, res) => {
    try {
        const bank = await Bank.findByPk(req.params.id);
        if (bank) {
            await bank.destroy();
            res.json({ message: 'Bank deleted' });
        } else res.status(404).json({ message: 'Bank not found' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
