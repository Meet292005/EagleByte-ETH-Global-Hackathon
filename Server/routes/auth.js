const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check against Environment Variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";

    // Debug log to ensure env is loaded (will show in server terminal)
    console.log('Login attempt:', email);
    if (!adminEmail || !adminPassword) {
        console.error('ERROR: Admin credentials not set in .env file!');
        return res.status(500).json({ message: "Server configuration error" });
    }

    // Clean inputs and env vars to remove accidental whitespace
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanAdminEmail = adminEmail.trim();
    const cleanAdminPassword = adminPassword ? adminPassword.trim() : ""; // handle potential undefined

    if (cleanEmail === cleanAdminEmail && cleanPassword === cleanAdminPassword) {
        // Successful Login
        const token = jwt.sign({ email: cleanAdminEmail, isAdmin: true }, jwtSecret, { expiresIn: "1d" });
        return res.status(200).json({ 
            email: cleanAdminEmail, 
            isAdmin: true, 
            token 
        });
    } else {
        console.log('Login Failed. Input:', cleanEmail, 'Expected:', cleanAdminEmail);
        console.log('Password Match:', cleanPassword === cleanAdminPassword);
        return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
