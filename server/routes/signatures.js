const express = require('express');
const router = express.Router();
const Signature = require('../models/Signature');

// Get all signatures
router.get('/', async (req, res) => {
    try {
        const signatures = await Signature.findAll();
        res.json(signatures);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add a new signature
router.post('/', async (req, res) => {
    try {
        const signature = await Signature.create(req.body);
        res.status(201).json(signature);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update a signature
router.put('/:id', async (req, res) => {
    try {
        const signature = await Signature.findByPk(req.params.id);
        if (signature) {
            await signature.update(req.body);
            res.json(signature);
        } else res.status(404).json({ message: 'Signature not found' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete a signature
router.delete('/:id', async (req, res) => {
    try {
        const signature = await Signature.findByPk(req.params.id);
        if (signature) {
            await signature.destroy();
            res.json({ message: 'Signature deleted' });
        } else res.status(404).json({ message: 'Signature not found' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
