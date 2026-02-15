require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recommendation = require('./models/Recommendation');
const verifyToken = require('./middleware/auth');
const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Recommendation Service DB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// 2. Add a Recommendation (Protected)
app.post('/recommendations', verifyToken, async (req, res) => {
  try {
    const { bookId, title, thumbnail, reason, username } = req.body;

    // Optional: Check if user already recommended this book to prevent duplicates
    const existing = await Recommendation.findOne({ userId: req.userId, bookId });
    if (existing) {
      return res.status(400).json({ message: 'You have already recommended this book.' });
    }

    const newRec = new Recommendation({
      userId: req.userId,
      username: username || 'Anonymous', // Username passed from frontend
      bookId,
      title,
      thumbnail,
      reason
    });

    await newRec.save();
    res.status(201).json({ message: 'Recommendation added!', data: newRec });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Global Recommendations (Public or Protected)
// The case study implies "Global", so we fetch all.
app.get('/recommendations', async (req, res) => {
  try {
    const recs = await Recommendation.find().sort({ createdAt: -1 }); // Newest first
    res.json(recs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete a Recommendation (Protected - User can only delete their own)
app.delete('/recommendations/:id', verifyToken, async (req, res) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });

    if (rec.userId !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own recommendations' });
    }

    await Recommendation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recommendation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5003;
app.listen(PORT, () => console.log(`🚀 Recommendation Service running on port ${PORT}`));