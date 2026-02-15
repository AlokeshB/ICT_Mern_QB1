const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true }, // Store username to display who recommended it
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: String,
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);