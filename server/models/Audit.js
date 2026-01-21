const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  originalCode: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  vulnerabilities: [{ type: String }],
  performanceFixes: [{ type: String }],
  refactoredCode: { type: String },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// MUST export module.exports = mongoose.model(...) directly
module.exports = mongoose.model('Audit', auditSchema);