const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    // Railway rellena estas variables automáticamente si las configuras
    host: process.env.MYSQLHOST || '127.0.0.1', 
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'api_jwt_db',
    port: process.env.MYSQLPORT || 3306
});

// Verificación para la consola
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
    } else {
        console.log('✅ Conexión exitosa a la base de datos');
        connection.release();
    }
});

module.exports = pool.promise();