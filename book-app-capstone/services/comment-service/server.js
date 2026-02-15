require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Comment = require('./models/Comment');
const verifyToken = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Comment Service DB Connected'))
  .catch(err => console.error('❌ DB Connection Error:', err));

// 2. Add a Comment (Protected)
app.post('/comments', verifyToken, async (req, res) => {
  try {
    const { bookId, comment, username } = req.body;

    if (!bookId || !comment) {
      return res.status(400).json({ message: 'Book ID and Comment are required' });
    }

    const newComment = new Comment({
      userId: req.userId,
      username: username || 'User',
      bookId,
      comment
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added', data: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Comments for a specific Book (Public)
app.get('/comments/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete a Comment (Protected - Owner only)
app.delete('/comments/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5004;
app.listen(PORT, () => console.log(`🚀 Comment Service running on port ${PORT}`));