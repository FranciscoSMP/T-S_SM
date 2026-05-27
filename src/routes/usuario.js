const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { ensureAuthenticated } = require('../lib/auth');

router.get('/add', ensureAuthenticated, usuarioController.Usuario);

router.post('/guardar', ensureAuthenticated, usuarioController.addUsuario);

router.get('/table', ensureAuthenticated, usuarioController.getUsuario);

router.get('/editar/:id', ensureAuthenticated, usuarioController.getUsuarioById);

router.post('/actualizar/:id', ensureAuthenticated, usuarioController.updateUsuario);

router.post('/eliminar/:id', ensureAuthenticated, usuarioController.deleteUsuario);

module.exports = router;
