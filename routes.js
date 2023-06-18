const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'prasad@92',
  database: 'ecommerce',
});

// Create a product
router.post('/products', (req, res) => {
  // Extract the product details from the request body
  const { name, description, price, variants } = req.body;
   console.log(req.body)
  // Insert the product into the database
  const productQuery = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';
  connection.query(productQuery, [name, description, price], (err, result) => {
    if (err) {
      console.error('Error creating product: ' + err.stack);
      res.status(500).json({ error: 'Failed to create product' });
      return;
    }

    const productId = result.insertId;
    //var variantsData = Object.entries(variants);
    console.log(variants)
    // Insert the variants into the database
    if (variants && variants.length > 0) {
      const variantQuery =
        'INSERT INTO variants (product_id, name, sku, additional_cost, stock_count) VALUES (?, ?, ?, ?, ?)';
       
        const variantValues = [variants].map((variant) => [
        productId,
        variant.name,
        variant.sku,
        variant.additional_cost,
        variant.stock_count,
      ]);

      connection.query(variantQuery, [variantValues], (err) => {
        if (err) {
          console.error('Error creating variants: ' + err.stack);
          res.status(500).json({ error: 'Failed to create variants' });
          return;
        }

        res.status(201).json({ message: 'Product created successfully' });
      });
    } else {
      res.status(201).json({ message: 'Product created successfully' });
    }
  });
});

// Get all products
router.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error retrieving products: ' + err.stack);
      res.status(500).json({ error: 'Failed to retrieve products' });
      return;
    }

    res.status(200).json(rows);
  });
});

// Search products by name, description, or variant name
router.get('/products/search', (req, res) => {
  const searchTerm = req.query.term;
  const query =
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR id IN (SELECT product_id FROM variants WHERE name LIKE ?)';
  const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

  connection.query(query, values, (err, rows) => {
    if (err) {
      console.error('Error searching products: ' + err.stack);
      res.status(500).json({ error: 'Failed to search products' });
      return;
    }

    res.status(200).json(rows);
  });
});

module.exports = router;
