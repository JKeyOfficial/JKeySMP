import mysql from 'mysql2/promise';

// Create a connection pool to avoid opening a new connection for every request
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'minecraft',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
