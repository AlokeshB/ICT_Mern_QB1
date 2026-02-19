const express = require('express');
const app = express();
const port = 8110;

// Route that may throw an error
app.get('/error', (req, res) => {
  // Simulating an error
  throw new Error('Something went wrong!');
});

// Route that uses next(error) for asynchronous code
app.get('/async-error', (req, res, next) => {
  // Simulating an asynchronous operation that fails
  setTimeout(() => {
    try {
      // Something that might fail
      const result = nonExistentFunction(); // This will throw an error
      res.send(result);
    } catch (error) {
      next(error); // Pass errors to Express
    }
  }, 100);
});

// Custom error handling middleware
// Must have four parameters to be recognized as an error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});