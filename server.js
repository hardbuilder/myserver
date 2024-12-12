const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
var port = process.env.PORT || 3000;

let products = [];
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("API deployment successful");
});

// Add new product
app.post('/product', (req, res) => {
    const product = req.body;

    // Output the product to the console for debugging
    console.log(product);

    // Add the new product to the products array
    products.push(product);

    res.send('Product is added to the database');
});

// Get all products
app.get('/product', (req, res) => {
    res.json(products);
});

// Get product by ID
app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    // Search for the product by ID
    const product = products.find(p => p.id === id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Delete product by ID
app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    // Remove product from the products array
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);

    if (products.length === initialLength) {
        res.status(404).send('Product not found');
    } else {
        res.send('Product is deleted');
    }
});

// Edit product by ID
app.post('/product/:id', (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;

    // Find the product and update it
    let productUpdated = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i] = newProduct;
            productUpdated = true;
            break;
        }
    }

    if (productUpdated) {
        res.send('Product is edited');
    } else {
        res.status(404).send('Product not found');
    }
});

// Checkout a product (save to orders)
app.post('/checkout', (req, res) => {
    const order = req.body;

    // Output the order to the console for debugging
    orders.push(order);

    // Redirect to another page after checkout
    res.redirect(302, 'https://assettracker.cf');
});

// Get all checkout orders
app.get('/checkout', (req, res) => {
    res.json(orders);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
