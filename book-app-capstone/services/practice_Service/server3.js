const express = require('express');
const app = express();
const port = 8100;

// Basic route with query parameters
app.get('/search', (req, res) => {
  const { q, category, limit } = req.query;
  
  res.send(`
    <h2>Search Results</h2>
    <p>Query: ${q || 'Not specified'}</p>
    <p>Category: ${category || 'All categories'}</p>
    <p>Limit: ${limit || 'Default'}</p>
  `);
});

// Using query parameters for pagination
app.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  
  // Mock product data
  const products = [];
  for (let i = 1; i <= pageSize; i++) {
    const productId = (page - 1) * pageSize + i;
    products.push(`Product ${productId}`);
  }
  
  res.send(`
    <h2>Product Listing</h2>
    <p>Page: ${page}</p>
    <p>Page Size: ${pageSize}</p>
    <ul>
      ${products.map(product => `<li>${product}</li>`).join('')}
    </ul>
    <p>
      <a href="/products?page=${page > 1 ? page - 1 : 1}&pageSize=${pageSize}">Previous
      |
      <a href="/products?page=${page + 1}&pageSize=${pageSize}">Next
    </p>
  `);
});

// Optional filtering using query parameters
app.get('/filter', (req, res) => {
  // Convert query parameters to an array of key-value pairs
  const filters = Object.entries(req.query).map(([key, value]) => {
    return `${key}: ${value}`;
  });
  
  if (filters.length === 0) {
    res.send('No filters applied. Try adding query parameters like ?color=red&size=large');
  } else {
    res.send(`
      <h2>Applied Filters</h2>
      <ul>
        ${filters.map(filter => `<li>${filter}</li>`).join('')}
      </ul>
    `);
  }
});
app.use((req, res) => {
    res.status(404).send('<h2>404: Oops! This page does not exist.</h2>');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
