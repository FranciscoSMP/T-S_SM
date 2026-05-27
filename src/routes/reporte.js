const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/pdf', reporteController.generarReportePDF);

module.exports = router;
