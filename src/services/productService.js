import * as productRepo from '../repositories/productRepository.js';

export const getAllProducts = async () => {
    return await productRepo.findAll();
};

export const getProductById = async (id) => {
    const product = await productRepo.findById(id);
    if (!product) throw { status: 404, message: 'Producto no encontrado' };
    return product;
};

export const createProduct = async (data) => {
    if (data.precio_venta < data.precio_costo) throw { status: 400, message: 'El precio de venta no puede ser menor al costo' };
    return await productRepo.create(data);
};

export const updateProduct = async (id, data) => {
    const existing = await productRepo.findById(id);
    if (!existing) throw { status: 404, message: 'Producto no encontrado' };
    return await productRepo.update(id, data);
};

export const deleteProduct = async (id) => {
    const deleted = await productRepo.remove(id);
    if (!deleted) throw { status: 404, message: 'Producto no encontrado' };
    return { message: 'Producto eliminado' };
};
