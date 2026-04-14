const mysql = require('mysql2');

// Forzamos los datos de tu PC directamente para probar
const connection = mysql.createConnection({
    host: '127.0.0.1', 
    user: 'root',
    password: '',
    database: 'api_jwt_db',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error real:', err.message);
        return;
    }
    console.log('✅ ¡POR FIN! Conectado localmente');
});

module.exports = connection;