
const express = require('express');
const cors = require('cors');
const os = require('os');
const app = express();
const PORT = 4000;
let products = [
    { id: 1, name: "Razor Mouse", price: 2200, category: "Electronic" },
    { id: 2, name: "Laptop", price: 110000, category: "Electronic" },
    { id: 3, name: "Laptop Bag", price: 1500, category: "Accesories" }
];
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
    next(); 
});
const productsRouter = express.Router();
productsRouter.get('/', (req, res) => {
    console.log('Responding with all products.');
    res.status(200).json(products);
});
productsRouter.post('/', (req, res) => {
    const newProduct = req.body;

    if (!newProduct || typeof newProduct.name !== 'string' || typeof newProduct.price !== 'number' || newProduct.price <= 0) {
        console.error('Invalid product data:', newProduct);
        return res.status(400).json({ message: 'Invalid product data.' });
    }
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToAdd = {
        id: newId,
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category || 'Uncategorized'
    };
    products.push(productToAdd);
    console.log(`Successfully added product: ${productToAdd.name} (ID: ${productToAdd.id})`);
    res.status(201).json(productToAdd);
});
app.use('/products', productsRouter);
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
    console.log(`[OS Info] Architecture: ${os.arch()}`);
    console.log(`[OS Info] Platform: ${os.platform()}`);
    console.log(`[OS Info] CPU Cores: ${os.cpus().length}`);
    console.log(`[OS Info] System Uptime: ${Math.round(os.uptime() / 3600)} hours`);
    console.log(`\nAvailable Endpoints:`);
    console.log(`  GET  http://localhost:${PORT}/products`);
    console.log(`  POST http://localhost:${PORT}/products`);
    console.log(`    (Example JSON Body: {"name": "DESK-SETUP", "price": 100k, "category": "Electronics"})`);
});
