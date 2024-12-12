const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
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

    // output the product to the console for debugging
    console.log(product);
    products.push(product);

    res.send('Product is added to the database');
});

app.get('/product', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    res.status(404).send('Product not found');
});

// DELETE route for deleting a product by ID
app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    // Remove the product from the array
    products = products.filter(i => i.id !== id);

    res.send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;

    // Edit product by matching id
    for (let i = 0; i < products.length; i++) {
        let product = products[i]

        if (product.id === id) {
            products[i] = newProduct;
        }
    }

    res.send('Product is edited');
});

app.post('/checkout', (req, res) => {
    const order = req.body;

    orders.push(order);

    res.redirect(302, 'https://assettracker.cf');
});

app.get('/checkout', (req, res) => {
    res.json(orders);
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
