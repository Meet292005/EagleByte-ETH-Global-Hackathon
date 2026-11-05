const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const dns = require('dns');

// Fix for some Windows/Network environments failing SRV lookups
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log("Could not set custom DNS servers");
}

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: true, // Allow all origins reflectively for now to rule out CORS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB using environment variable only
const dbUrl = process.env.DB_URL;

// Only connect if we aren't already connected/connecting
if (dbUrl && mongoose.connection.readyState === 0) {
    mongoose.connect(dbUrl, {
      family: 4 // Force IPv4 to fix common Node DNS issues
    })
      .then(() => console.log('MongoDB connected'))
      .catch(err => {
          console.error('MongoDB connection error details:', err.code, err.syscall, err.hostname);
          // Don't crash immediately, let routes handle 503
      });
} else if (!dbUrl) {
    console.error('WARNING: DB_URL is not set in environment variables (.env)');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      dbState: mongoose.connection.readyState 
  });
});

// Routes
app.use('/api/portal', authRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: corsOptions // reusing the cors options defined above
});

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

// Make io accessible to our router
app.set('socketio', io);
