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

app.post('/product', (req, res) => {
    const product = req.body;

    // Log the received product for debugging
    console.log('Received product:', product);
    
    // Add the product to the products array
    products.push(product);

    res.status(200).send('Product is added to the database');
});

app.get('/product', (req, res) => {
    // Return the products array in JSON format
    res.status(200).json(products);
});

app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    // Find the product by ID
    const product = products.find(p => p.id === id);
    
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    // Remove product from the products array
    products = products.filter(i => i.id !== id);

    res.status(200).send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;

    // Find and update the product
    let updated = false;
    products = products.map(product => {
        if (product.id === id) {
            updated = true;
            return updatedProduct;
        }
        return product;
    });

    if (updated) {
        res.status(200).send('Product is updated');
    } else {
        res.status(404).send('Product not found');
    }
});

app.post('/checkout', (req, res) => {
    const order = req.body;

    // Log the order for debugging
    console.log('Received order:', order);

    orders.push(order);

    // Redirecting after checkout
    res.redirect(302, 'https://assettracker.cf');
});

app.get('/checkout', (req, res) => {
    res.status(200).json(orders);
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
