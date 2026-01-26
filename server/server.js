const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const auditRoutes = require('./routes/auditRoutes');

const app = express();
app.use(express.json());

// API Routes
app.use('/api/audit', auditRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB Atlas
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
}

// Only listen on port during local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel Serverless Function engine
module.exports = app;