const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   POST /api/items (Crear)
router.post('/', auth, (req, res) => {
    res.send('Item creado');
});

// @route   GET /api/items (Leer)
router.get('/', auth, (req, res) => {
    res.send('Lista de items');
});

// @route   PUT /api/items/:id (Actualizar)
router.put('/:id', auth, (req, res) => {
    res.send('Item actualizado');
});

// @route   DELETE /api/items/:id (Eliminar)
router.delete('/:id', auth, (req, res) => {
    res.send('Item eliminado');
});

module.exports = router;