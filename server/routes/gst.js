const express = require('express');
const router = express.Router();
const axios = require('axios');

const getAccessToken = async () => {
    try {
        console.log('Authenticating with Sandbox...');
        const res = await axios.post('https://api.sandbox.co.in/authenticate', {}, {
            headers: {
                'x-api-key': process.env.GST_API_KEY,
                'x-api-secret': process.env.GST_API_SECRET,
                'x-api-version': process.env.GST_API_VERSION
            }
        });
        console.log('Auth Success! Token obtained.');
        return res.data.access_token;
    } catch (err) {
        console.error('Sandbox Auth Error:', err.response?.data || err.message);
        throw new Error('Failed to authenticate with GST service');
    }
};

router.get('/verify/:gstin', async (req, res) => {
    const { gstin } = req.params;
    console.log(`Verifying GSTIN (POST): ${gstin}`);
    try {
        const token = await getAccessToken();
        console.log('Fetching GST Details (POST)...');
        const response = await axios.post(`https://api.sandbox.co.in/gst/compliance/public/gstin/search`, 
        { gstin: gstin.toUpperCase() },
        {
            headers: {
                'x-api-key': process.env.GST_API_KEY,
                'authorization': token,
                'x-api-version': '1.0',
                'Content-Type': 'application/json'
            }
        });
        console.log('GST Details Fetched Successfully!', JSON.stringify(response.data));
        // Return the nested data property directly to simplify frontend logic
        res.json(response.data.data || response.data);
    } catch (err) {
        console.error('GST Verification Error:', err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            message: 'Failed to verify GSTIN',
            error: err.response?.data || err.message
        });
    }
});

module.exports = router;
