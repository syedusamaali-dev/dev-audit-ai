const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const auditRoutes = require('./routes/auditRoutes');

const app = express();
app.use(express.json());

// API Routes
app.use('/api/audit', auditRoutes);

// Serve static frontend assets from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Fallback: Send index.html for any unhandled routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));