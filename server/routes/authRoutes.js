const express = require('express');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', (req, res) => {
    res.json({ message: 'Register route' });
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', (req, res) => {
    res.json({ message: 'Login route' });
});

module.exports = router;
