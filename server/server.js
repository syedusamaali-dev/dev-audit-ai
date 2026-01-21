const dotenv = require('dotenv');
dotenv.config(); // Must be called before importing routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/audit', auditRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});