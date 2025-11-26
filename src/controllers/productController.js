import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.message.startsWith('PRICE_ERROR')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getLowStock = async (req, res) => {
    try {
        const products = await productService.getLowStockProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};