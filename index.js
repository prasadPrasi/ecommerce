const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');



// Create an Express app
const app = express();
const routes = require('./routes');

// app.use(bodyParser.json());
// // app.use(bodyParser.urlencoded({
// //     extended: true
// //   }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'prasad@92',
  database: 'ecommerce',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});