const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: false }, // Relaxed for debugging
  email: { type: String, required: false },
  mobile: { type: String, required: false },
  projectTitle: { type: String, required: false }, 
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // Allow other fields

module.exports = mongoose.model('Contact', contactSchema);
