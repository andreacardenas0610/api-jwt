const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'clave_secreta_123';

// ==========================================
// MIDDLEWARE: VERIFICACIÓN DEL TOKEN
// ==========================================
const verificarToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, permiso denegado' });
    }

    try {
        const cifrado = jwt.verify(token, JWT_SECRET);
        // Guardamos los datos del usuario en el objeto 'req'
        req.usuario = cifrado.user; 
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no válido' });
    }
};

// ==========================================
// RUTA DE LOGIN: GENERA EL TOKEN
// ==========================================
router.post('/login', (req, res) => {
    // Datos simulados del administrador
    const user = { id: 10, nombre: "Andrea Admin", rol: "SuperUsuario" };
    const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// ==========================================
// CRUD DE PRODUCTOS
// ==========================================

// 1. LISTAR TODOS (Público)
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. BUSCAR POR ID ESPECÍFICO (Público)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM productos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        
        res.json(result[0]);
    });
});

// 3. AGREGAR PRODUCTO (Protegido)
router.post('/', verificarToken, (req, res) => {
    const { nombre, precio } = req.body;
    const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
    
    db.query(sql, [nombre, precio], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
            mensaje: 'Producto guardado exitosamente',
            producto_creado: nombre,
            autorizado_por: req.usuario.nombre,
            rol_detectado: req.usuario.rol,
            id_en_db: result.insertId
        });
    });
});

// 4. ACTUALIZAR PRODUCTO (Protegido)
router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';

    db.query(sql, [nombre, precio, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        
        res.json({ 
            mensaje: `Producto con ID ${id} actualizado correctamente`,
            actualizado_por: req.usuario.nombre,
            rol_detectado: req.usuario.rol
        });
    });
});

// 5. ELIMINAR PRODUCTO (Protegido)
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        
        res.json({ 
            mensaje: `Producto con ID ${id} eliminado`,
            eliminado_por: req.usuario.nombre,
            rol_detectado: req.usuario.rol
        });
    });
});

module.exports = router;