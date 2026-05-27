const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const proveedorController = require('../controllers/proveedorController');

router.get('/add', ensureAuthenticated, proveedorController.proveedor);

router.post('/guardar', ensureAuthenticated, proveedorController.addProveedor);

router.get('/table', ensureAuthenticated, proveedorController.getProveedor);

router.post('/actualizar', ensureAuthenticated, proveedorController.updateProveedor);

router.get('/editar/:id', ensureAuthenticated, proveedorController.getProveedorById);

router.post('/eliminar/:id', ensureAuthenticated, proveedorController.deleteProveedor);

module.exports = router;