const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const categoriaController = require('../controllers/categoriaController');

router.get('/add', ensureAuthenticated, categoriaController.categoria);

router.post('/guardar', ensureAuthenticated, categoriaController.addCategoria);

router.get('/table', ensureAuthenticated, categoriaController.getCategoria);

router.post('/actualizar', ensureAuthenticated, categoriaController.updateCategoria);

router.get('/editar/:id', ensureAuthenticated, categoriaController.getCategoriaById);

router.post('/eliminar/:id', ensureAuthenticated, categoriaController.deleteCategoria);

module.exports = router;