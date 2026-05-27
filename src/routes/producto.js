const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const productoController = require('../controllers/productoController');

router.get('/add', ensureAuthenticated, productoController.producto);

router.post('/guardar', ensureAuthenticated, productoController.addProducto);

router.get('/table', ensureAuthenticated, productoController.getProducto);

router.post('/actualizar', ensureAuthenticated, productoController.updateProducto);

router.get('/editar/:id', ensureAuthenticated, productoController.getProductoById);

router.post('/eliminar/:id', ensureAuthenticated, productoController.deleteProducto);

module.exports = router;