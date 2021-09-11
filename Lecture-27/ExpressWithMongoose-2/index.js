const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/product');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/shop-app')
    .then(() => console.log('DB Connected'))
    .catch((err) => {
        console.log("Connection Failed");
        console.log(err);
    });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.send("CONNECTED");
})


// Get all the products
app.get('/products', async (req, res) => {
    
    const products = await Product.find({});

    // console.log(products);

    res.render('index', { products });
});


// New Product

app.get('/product/new', (req, res) => {
    res.render('new');
});


// Creating a new Product
app.post('/products', async (req, res) => {
    
    const product = req.body;

    await Product.create(product);

    res.redirect('/products');
});


// Show a particular product

app.get('/products/:id', async (req, res) => {
    
    const { id } = req.params;

    const product=await Product.findById(id);

    res.render('show', { product });
})


// Getting the product into a form to edit
app.get('/products/:id/edit', async (req, res) => {
    
    const { id } = req.params;

    const product = await Product.findById(id);

    res.render('edit', { product });
});


// Updating the products with the given id
app.patch('/products/:id', async (req, res) => {
    
    const { id } = req.params;

    await Product.findByIdAndUpdate(id, req.body);

    res.redirect(`/products/${id}`);
});

//Delete product

app.delete('/products/:id', async (req, res) => {
    
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.redirect('/products');
})


app.listen(3000, () => {
    console.log('server running at port 3000');
})