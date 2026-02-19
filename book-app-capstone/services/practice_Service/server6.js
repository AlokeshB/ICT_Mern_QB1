const express = require('express');
const app = express();

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send('Authentication required');
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verify the token (simplified)
  if (token === 'secret-token') {
    // Authentication successful
    req.user = { id: 123, username: 'john' };
    next();
  } else {
    res.status(403).send('Invalid token');
  }
}

// Public route - no authentication needed
app.get('/', (req, res) => {
  res.send('Welcome to the API - public area');
});

// Protected route - authentication required
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ 
    message: 'Protected data', 
    user: req.user 
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log('Try the following requests:');
  console.log('1. GET / - Public route');
  console.log('2. GET /api/protected - Without token (will fail)');
  console.log('3. GET /api/protected - With Authorization: Bearer secret-token header (will succeed)');
});

// For demonstration purposes, simulate API calls
setTimeout(() => {
  console.log('\n--- Making requests ---');
  
  // Simulate public route request
  console.log('\nRequest to public route:');
  console.log('GET /');
  console.log('Response: Welcome to the API - public area');
  
  // Simulate unauthenticated request
  console.log('\nRequest to protected route without token:');
  console.log('GET /api/protected');
  console.log('Response: Authentication required (401)');
  
  // Simulate authenticated request
  console.log('\nRequest to protected route with valid token:');
  console.log('GET /api/protected');
  console.log('Headers: Authorization: Bearer secret-token');
  console.log('Response: { "message": "Protected data", "user": { "id": 123, "username": "john" } }');
}, 1000);
