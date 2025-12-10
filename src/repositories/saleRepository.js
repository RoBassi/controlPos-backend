import { pool } from '../config/db.js';

// Buscar métodos de pago activos
export const getPaymentMethods = async () => {
    const res = await pool.query('SELECT * FROM metodo_pago WHERE activo = true ORDER BY id_metodo');
    return res.rows;
};

// Crear Venta (Transacción Completa)
export const createSaleTransaction = async (userId, total, metodoPagoId, items) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // CAMBIO AQUÍ: Insertamos user_id en lugar de sesion_id
        const ventaRes = await client.query(
            `INSERT INTO venta (user_id, total, metodo_pago_id) VALUES ($1, $2, $3) RETURNING id_venta`,
            [userId, total, metodoPagoId]
        );
        const ventaId = ventaRes.rows[0].id_venta;

        // ... El resto del código (bucle for de items) queda IGUAL ...
        for (const item of items) {
            // ... insert detalle y update stock ...
            await client.query(
                `INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [ventaId, item.id_product, item.cantidad, item.precio_venta, item.subtotal]
            );

            await client.query(
                `UPDATE producto SET stock = stock - $1 WHERE id_product = $2`,
                [item.cantidad, item.id_product]
            );
        }

        await client.query('COMMIT');
        return { id_venta: ventaId, total, items_count: items.length };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getSalesByDateRange = async (startDate, endDate) => {
    // Ajustamos endDate para que tome hasta el último milisegundo del día
    const query = `
        SELECT v.id_venta, v.total, v.fecha, u.username as vendedor, m.nombre as metodo_pago
        FROM venta v
        JOIN usuario u ON v.user_id = u.id_user
        JOIN metodo_pago m ON v.metodo_pago_id = m.id_metodo
        WHERE v.fecha >= $1 AND v.fecha <= $2
        ORDER BY v.fecha DESC
    `;
    const res = await pool.query(query, [startDate, endDate]);
    return res.rows;
};

// 2. Obtener estadísticas (Total Ventas, Total Ganancia, Por Categoría)
export const getSalesStats = async (startDate, endDate) => {
    // A. Total Facturado y Ganancia Estimada
    // (Precio Venta Real - Costo Actual) * Cantidad
    const queryGlobal = `
        SELECT 
            COALESCE(SUM(d.subtotal), 0) as total_facturado,
            COALESCE(SUM((d.precio_unitario - p.precio_costo) * d.cantidad), 0) as ganancia_estimada,
            COUNT(DISTINCT v.id_venta) as cantidad_ventas
        FROM venta v
        JOIN detalle_venta d ON v.id_venta = d.venta_id
        JOIN producto p ON d.producto_id = p.id_product
        WHERE v.fecha >= $1 AND v.fecha <= $2
    `;
    const globalRes = await pool.query(queryGlobal, [startDate, endDate]);

    // B. Ventas por Categoría (Rubro)
    const queryCats = `
        SELECT c.nombre as categoria, SUM(d.subtotal) as total
        FROM venta v
        JOIN detalle_venta d ON v.id_venta = d.venta_id
        JOIN producto p ON d.producto_id = p.id_product
        JOIN categoria c ON p.categoria_id = c.id_categoria
        WHERE v.fecha >= $1 AND v.fecha <= $2
        GROUP BY c.nombre
        ORDER BY total DESC
    `;
    const catsRes = await pool.query(queryCats, [startDate, endDate]);

    return {
        global: globalRes.rows[0],
        byCategory: catsRes.rows
    };
};

// 3. Obtener detalle de una venta específica (para el modal)
export const getSaleDetail = async (idVenta) => {
    const query = `
        SELECT d.*, p.nombre as producto, p.codigo_barras
        FROM detalle_venta d
        JOIN producto p ON d.producto_id = p.id_product
        WHERE d.venta_id = $1
    `;
    const res = await pool.query(query, [idVenta]);
    return res.rows;
};