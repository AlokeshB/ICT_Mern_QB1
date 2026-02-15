require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Favorite = require('./models/Favorite');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Fav Service DB Connected'));

// Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send("Token required");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Invalid Token");
        req.userId = decoded.id;
        next();
    });
};


app.post('/favorites', verifyToken, async (req, res) => {
    try {
        const newFav = new Favorite({ ...req.body, userId: req.userId });
        await newFav.save();
        res.status(201).json(newFav);
    } catch (err) { res.status(500).json(err); }
});

// Get Favorites [cite: 65]
app.get('/favorites', verifyToken, async (req, res) => {
    try {
        const favs = await Favorite.find({ userId: req.userId });
        res.json(favs);
    } catch (err) { res.status(500).json(err); }
});

app.listen(5002, () => console.log('Favorite Service running on port 5002'));