const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    // Usamos los nombres exactos que tienes en tu captura de Railway
    host: process.env.DB_HOST || '127.0.0.1', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'api_jwt_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
    } else {
        console.log('✅ Conexión exitosa a la base de datos');
        connection.release();
    }
});

module.exports = pool.promise();