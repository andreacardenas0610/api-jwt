const mysql = require('mysql2');
require('dotenv').config();

// Usamos createPool que es más estable
const pool = mysql.createPool({
    host: '127.0.0.1', // <--- Ponlo así, entre comillas y sin process.env
    user: 'root',
    password: '',
    database: 'api_jwt_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificación rápida
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        // Si sale error aquí, es porque XAMPP está apagado o la DB no se llama api_jwt_db
    } else {
        console.log('✅ ¡CONECTADO EXITOSAMENTE!');
        connection.release();
    }
});

module.exports = pool;