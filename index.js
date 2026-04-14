const express = require('express');
const app = express();

// Middleware para entender JSON
app.use(express.json());

// Cargar rutas
app.use('/api/items', require('./routes/items'));

// --- EL CAMBIO IMPORTANTE AQUÍ ---
// process.env.PORT lee el puerto que le asigne Railway
// Si no existe (como en tu PC), usa el 4001 por defecto
const PORT = process.env.PORT || 4001; 

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en el puerto ${PORT}`);
});