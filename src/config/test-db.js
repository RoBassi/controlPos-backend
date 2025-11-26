// test-db.js
import { pool } from './db.js'; // Importamos tu conexión existente

const verificarDB = async () => {
  try {
    console.log("🔌 Intentando conectar...");
    
    // 1. Verificar conexión básica
    const res = await pool.query('SELECT NOW()');
    console.log("✅ Conexión exitosa! Hora del servidor DB:", res.rows[0].now);

    // 2. Preguntar qué tablas existen
    const tablas = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    if (tablas.rows.length > 0) {
      console.log("\n📋 Tablas encontradas en tu base de datos:");
      console.table(tablas.rows); // Muestra una tablita linda en consola
    } else {
      console.log("\n⚠️ La base de datos existe, pero NO tiene tablas creadas.");
    }

  } catch (err) {
    console.error("❌ Error de conexión:", err.message);
    console.log("Revisa que tu archivo .env tenga los datos correctos.");
  } finally {
    pool.end(); // Cerramos la conexión
  }
};

verificarDB();