const express = require('express');
const app = express();
const port = 8095; // Your updated port

// --- NEW: Add a root route so you don't get a 404 on the home page ---
app.get('/', (req, res) => {
    res.send('<h1>Server is Running!</h1><p>Try visiting <a href="/users/123">/users/123</a></p>');
});

// Route with URL parameters
app.get('/users/:userId', (req, res) => {
    res.send(`User profile for ID: ${req.params.userId}`);
});

app.get('/users/:userId/posts/:postId', (req, res) => {
    res.send(`<h2>User ID: ${req.params.userId}</h2><p>Post ID: ${req.params.postId}</p>`);
});

// Corrected Optional Parameters for Express 5
app.get('/products/:category', (req, res) => {
    res.send(`Viewing all products in category ${req.params.category}`);
});

app.get('/products/:category/:product', (req, res) => {
    res.send(`Viewing product ${req.params.product} in category ${req.params.category}`);
});

// Fixed Regex for Express 5
app.get('/items/:itemId', (req, res) => {
    if (!/^\d+$/.test(req.params.itemId)) {
        res.send(`Invalid Item ID ${req.params.itemId}`);
    }
    else
        res.send(`Item ID: ${req.params.itemId}`);
});

// --- NEW: Catch-all 404 Handler (MUST be the last route) ---
app.use((req, res) => {
    res.status(404).send('<h2>404: Oops! This page does not exist.</h2>');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});