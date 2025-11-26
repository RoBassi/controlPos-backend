import * as productRepository from '../repositories/productRepository.js';

export const getAllProducts = async (filters) => {
    return await productRepository.findAll(filters.search, filters.rubro);
};

export const getLowStockProducts = async () => {
    return await productRepository.findLowStock();
};

export const createProduct = async (productData) => {
    // Agregar lógica: "Si el precio venta < costo, lanzar error"
    if (productData.precio_venta < productData.precio_costo) {
        throw new Error('PRICE_ERROR: El precio de venta no puede ser menor al costo');
    }
    return await productRepository.create(productData);
};