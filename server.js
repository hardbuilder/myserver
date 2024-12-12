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
// Example for Express.js server
app.delete('/delete-all-products', (req, res) => {
    // Assuming you are using a database like MongoDB or SQL
    Product.deleteMany({}, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error deleting products' });
        } else {
            res.status(200).json({ success: true, message: 'All products deleted successfully' });
        }
    });
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
