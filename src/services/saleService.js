import * as saleRepo from '../repositories/saleRepository.js';

export const getPaymentMethods = async () => {
    return await saleRepo.getPaymentMethods();
};

export const processSale = async (userId, saleData) => {
    const { total, metodo_pago_id, items } = saleData;

    if (!items || items.length === 0) {
        throw { status: 400, message: "El carrito está vacío" };
    }

    // Llamamos a la transaccion del repositorio
    return await saleRepo.createSaleTransaction(
        userId,
        total,
        metodo_pago_id,
        items
    );
};

export const getReports = async (from, to) => {
    // Logica de fechas
    const startDate = from ? new Date(from + 'T00:00:00') : new Date();
    const endDate = to ? new Date(to + 'T23:59:59.999') : new Date();

    if (!from) startDate.setHours(0,0,0,0);
    if (!to) endDate.setHours(23,59,59,999);

    const [sales, stats] = await Promise.all([
        saleRepo.getSalesByDateRange(startDate, endDate),
        saleRepo.getSalesStats(startDate, endDate)
    ]);

    return { sales, stats };
};

export const getSaleDetail = async (id) => {
    const details = await saleRepo.getSaleDetail(id);
    if (!details || details.length === 0) throw { status: 404, message: "Venta no encontrada" };
    return details;
};