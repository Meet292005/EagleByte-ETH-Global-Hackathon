const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const { authenticateToken } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Helper to log to file
const logError = (error, context = '') => {
  const logMessage = `[${new Date().toISOString()}] ${context} - ${error.message}\n${error.stack}\n\n`;
  fs.appendFileSync(path.join(__dirname, '../server_error.log'), logMessage);
};

const logInfo = (info) => {
  const logMessage = `[${new Date().toISOString()}] INFO: ${JSON.stringify(info)}\n`;
  fs.appendFileSync(path.join(__dirname, '../server_info.log'), logMessage);
};

// Post a new contact message
router.post('/', async (req, res) => {
  try {
    logInfo({ action: 'POST /contact', body: req.body });
    
    // Validate required fields manually to give better error messages
    const { fullName, email, mobile, projectTitle, description } = req.body;
    
    if (!projectTitle) {
      logError(new Error('Missing projectTitle'), 'Validation');
      return res.status(400).json({ message: "Validation Failed", error: "Project Title is required" });
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error(`Database not connected. State: ${mongoose.connection.readyState}`);
    }

    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    
    // Emit socket event for real-time update
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newContact', savedContact);
    }

    logInfo({ action: 'Contact Saved', id: savedContact._id });
    res.status(201).json(savedContact);
  } catch (err) {
    logError(err, 'Contact POST Handler');
    console.error('Contact POST Error:', err);
    res.status(500).json({ message: "Failed to save contact", error: err.message });
  }
});

// Get all messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    logError(err, 'GET /contact');
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a message (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({ message: 'Message not found' });
    }

    logInfo({ action: 'DELETE /contact', id: req.params.id });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    logError(err, 'DELETE /contact');
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

module.exports = router;
