const express = require('express');
const app = express();

// Middleware para entender JSON
app.use(express.json());

// Cargar rutas
app.use('/api/items', require('./routes/items'));

const PORT = 4001; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});