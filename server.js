const express = require('express')
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

// POST /product - Add product
app.post('/product', (req, res) => {
    const product = req.body;

    // Output the product to the console for debugging
    console.log('Adding new product:', product);

    products.push(product);

    res.send('Product is added to the database');
});

// GET /product - Get all products
app.get('/product', (req, res) => {
    res.json(products);
});

// GET /product/:id - Get product by ID
app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    // Searching for the product by ID
    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    res.status(404).send('Product not found');
});

// DELETE /product/:id - Delete product by ID
app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    console.log(`Attempting to delete product with ID: ${id}`);
    console.log("Current products:", products);

    // Find the product by ID
    const productIndex = products.findIndex(i => i.id === id);

    if (productIndex !== -1) {
        // If the product is found, remove it from the array
        products.splice(productIndex, 1);
        console.log(`Product with ID: ${id} has been deleted.`);
        res.status(200).send('Product is deleted');
    } else {
        // If the product is not found, send a 404 response
        console.log(`Product with ID: ${id} not found.`);
        res.status(404).send('Product not found');
    }
});

// POST /checkout - Create a new order
app.post('/checkout', (req, res) => {
    const order = req.body;

    // Output the order to the console for debugging
    console.log('New order:', order);

    orders.push(order);

    res.redirect(302, 'https://assettracker.cf');
});

// GET /checkout - Get all orders
app.get('/checkout', (req, res) => {
    res.json(orders);
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}!`));

deleteproducts();
