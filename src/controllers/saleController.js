import * as saleService from '../services/saleService.js';

export const getMethods = async (req, res, next) => {
    try {
        const methods = await saleService.getPaymentMethods();
        res.json(methods);
    } catch (error) {
        next(error);
    }
};

export const createSale = async (req, res, next) => {
    try {
        // Obtenemos userId desde el token (inyectado por authMiddleware)
        const userId = req.user.id || req.user.id_user; 
        
        const result = await saleService.processSale(userId, req.body);
        res.status(201).json({ message: "Venta registrada con éxito", data: result });
    } catch (error) {
        next(error);
    }
};

export const getReports = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const result = await saleService.getReports(from, to);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getSaleDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const details = await saleService.getSaleDetail(id);
        res.json(details);
    } catch (error) {
        next(error);
    }
};