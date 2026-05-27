const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const transaccionController = require('../controllers/transaccionController');

router.get('/add', ensureAuthenticated, transaccionController.transaccion);

router.post('/guardar', ensureAuthenticated, transaccionController.addTransaccion);

router.get('/table', ensureAuthenticated, transaccionController.tableTransaccion);

router.get('/ver/:id', ensureAuthenticated, transaccionController.verTransaccion);

router.post('/guardar-multiples', transaccionController.guardarMultiples);

router.get('/pdf/:id', transaccionController.generarPDF);

module.exports = router;
