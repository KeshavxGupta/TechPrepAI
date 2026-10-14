const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true, lowercase: true, index: true },
  quizId: { type: String, required: true },
  eventType: { type: String, required: true },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
