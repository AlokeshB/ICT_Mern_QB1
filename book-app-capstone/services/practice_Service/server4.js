const express = require('express');
const app = express();
const port = 8105;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 1. ADD THIS: Root GET route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Your existing POST route
app.post('/api/users', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'User created', user: req.body });
});

// This will handle 404s for any route that doesn't exist
app.use((req, res) => {
    res.status(404).send('<h2>404: Oops! This page does not exist.</h2>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});