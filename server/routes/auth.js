const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    try {
        const { ownerName, email, phone, password, companyName } = req.body;
        
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            ownerName, email, phone, companyName,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser.id }, 'billflow_secret', { expiresIn: '1d' });
        res.json({ 
            token, 
            user: { id: newUser.id, ownerName, email, companyName }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, 'billflow_secret', { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { id: user.id, ownerName: user.ownerName, email: user.email, companyName: user.companyName }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const userData = user.toJSON();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
