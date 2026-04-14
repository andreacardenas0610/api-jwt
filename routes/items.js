const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Asegúrate de que esta clave sea la misma en .env y aquí
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_123';

// ==========================================
// MIDDLEWARE: VERIFICACIÓN DEL TOKEN
// ==========================================
const verificarToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ mensaje: 'No hay token, permiso denegado' });

    try {
        const cifrado = jwt.verify(token, JWT_SECRET);
        // IMPORTANTE: Si en el login usaste { user }, aquí extraes cifrado.user
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
    // Definimos el usuario claramente
    const payload = { 
        user: { id: 10, nombre: "Andrea Admin", rol: "SuperUsuario" } 
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// ==========================================
// CRUD DE PRODUCTOS (Corrigiendo posibles fallos)
// ==========================================

// 1. LISTAR TODOS
router.get('/', async (req, res) => {
    try {
        // En algunas versiones de mysql2/promise, se usa query
        const [results] = await db.query('SELECT * FROM productos');
        res.json(results);
    } catch (err) {
        console.error("Error en GET /:", err);
        res.status(500).json({ error: "Error al obtener productos", detalle: err.message });
    }
});

// 3. AGREGAR PRODUCTO (Protegido)
router.post('/', verificarToken, async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        
        // Validación básica para evitar errores de DB
        if (!nombre || !precio) {
            return res.status(400).json({ mensaje: "Faltan datos (nombre o precio)" });
        }

        const [result] = await db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        
        res.status(201).json({ 
            mensaje: 'Producto guardado exitosamente',
            autorizado_por: req.usuario ? req.usuario.nombre : 'Usuario Desconocido',
            id_en_db: result.insertId
        });
    } catch (err) {
        console.error("Error en POST /:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;