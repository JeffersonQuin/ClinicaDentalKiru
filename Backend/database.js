// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'Kiru_DB',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || undefined,
  max: Number(process.env.PG_MAX) || 20,
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT) || 2000,
});

// eventos del pool
pool.on('connect', () => {
  console.log('✓ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  // no hacemos process.exit en producción; mejor reconexión o alarma
});

// prueba de conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now');
    console.log('✓ Conexión verificada:', res.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('✗ Error al conectar con PostgreSQL:', err.message);
    return false;
  }
};

// helper query
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query ejecutada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error en query:', error.message);
    throw error;
  }
};

// transacción
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, query, transaction, testConnection };
