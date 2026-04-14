const mysql = require('mysql2');

// Sin dotenv, sin variables de entorno, directo al grano
const pool = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root',
    password: '',
    database: 'api_jwt_db',
    port: 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error real:', err.message);
    } else {
        console.log('✅ ¡CONECTADO A XAMPP!');
        connection.release();
    }
});

module.exports = pool;