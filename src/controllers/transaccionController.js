const transaccionModel = require('../models/transaccionModel');
const usuarioModel = require('../models/usuarioModel');
const productoModel = require('../models/productoModel');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const { enviarAlertaStock } = require('../lib/mailer'); 

const guardarDatos = (model, redirect) => async (req, res) => {
    try {
        if (req.user && req.user.Id_Rol === 2) {
            req.body.Id_Usuario = req.user.Id_Usuario;
        }

        await model(req.body);

        if (req.body.tipo_transaccion === 'Salida') {
            const productoActualizado = await productoModel.getProductoById(req.body.id_producto);
            
            if (productoActualizado && productoActualizado.stock_actual <= productoActualizado.umbral_minimo) {
                const adminCorreo = process.env.ADMIN_EMAIL || 'admin@sm.com';
                enviarAlertaStock(productoActualizado, adminCorreo);
            }
        }

        req.flash('success_msg', 'Transacción registrada correctamente');
        res.redirect(redirect);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message || 'Error al guardar la transacción');
        res.status(500).send('Error al guardar transacción');
    }
};

exports.transaccion = async (req, res) => {
    try {
        const productos = await productoModel.getProducto();
        let usuarios = [];

        if (req.user.Id_Rol === 1) {
            usuarios = await usuarioModel.getUsuario();
        }

        res.render('add/transaccion', {
            title: 'Registrar Transacción',
            productos,
            usuarios,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos para registrar la transacción');
    }
};

exports.addTransaccion = guardarDatos(transaccionModel.addTransaccion, '/transaccion/table');

exports.tableTransaccion = async (req, res) => {
    try {
        const rol = req.user.Id_Rol;
        const idUsuario = req.user.Id_Usuario;

        const transacciones = await transaccionModel.getTransacciones(rol, idUsuario);

        res.render('tables/transaccion', {
            title: 'Listado de Transacciones',
            transacciones,
            user: req.user,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al listar transacciones');
        res.redirect('/dashboard');
    }
};

exports.verTransaccion = async (req, res) => {
    try {
        const id = req.params.id;
        const rol = req.user.Id_Rol;
        const idUsuario = req.user.Id_Usuario;

        const transaccion = await transaccionModel.getTransaccionById(id, rol, idUsuario);

        res.render('tables/transaccionDetalle', {
            title: 'Detalle de Transacción',
            transaccion,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message || 'Error al consultar la transacción');
        res.redirect('/transaccion/table');
    }
};

exports.guardarMultiples = async (req, res) => {
    try {
        const transacciones = JSON.parse(req.body.transacciones);
        if (!transacciones || !transacciones.length) {
            req.flash('error_msg', 'No se recibieron transacciones.');
            return res.redirect('/transaccion');
        }

        for (const t of transacciones) {
            await transaccionModel.addTransaccion({
                tipo_transaccion: t.tipo,
                motivo: t.motivo,
                cantidad: t.cantidad,
                id_producto: t.id_producto,
                Id_Usuario: t.Id_Usuario
            });

            if (t.tipo === 'Salida') {
                const productoActualizado = await productoModel.getProductoById(t.id_producto);
                if (productoActualizado && productoActualizado.stock_actual <= productoActualizado.umbral_minimo) {
                    const adminCorreo = process.env.ADMIN_EMAIL || 'admin@sm.com';
                    enviarAlertaStock(productoActualizado, adminCorreo);
                }
            }
        }

        req.flash('success_msg', `Se registraron ${transacciones.length} transacciones correctamente.`);
        res.redirect('/transaccion/table');
    } catch (error) {
        console.error('Error al registrar múltiples transacciones:', error);
        req.flash('error_msg', 'Ocurrió un error al registrar las transacciones.');
        res.redirect('/transaccion');
    }
};

exports.generarPDF = async (req, res) => {
    try {
        const id = req.params.id;
        const rol = req.user.Id_Rol;
        const idUsuario = req.user.Id_Usuario;

        const transaccion = await transaccionModel.getTransaccionById(id, rol, idUsuario);
        if (!transaccion) {
            req.flash('error_msg', 'Transacción no encontrada.');
            return res.redirect('/transaccion/table');
        }

        const fechaGeneracion = new Date();
        const nombreArchivo = `Reporte_Transaccion_${format(fechaGeneracion, "yyyyMMdd_HHmmss")}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);

        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);

        doc.info.Title = 'Reporte de Transacción';
        doc.info.Author = 'Sistema de Gestión de Inventario';

        doc
            .rect(0, 0, doc.page.width, 70)
            .fill('#2E86C1');

        doc
            .fillColor('white')
            .fontSize(20)
            .text('Detalle de Transacción', 0, 25, { align: 'center' });

        doc.moveDown(3);

        const startY = 120;
        const cardWidth = doc.page.width - 100;
        const cardX = 50;
        const cardHeight = 270;

        doc.save()
            .fillColor('#EAECEE')
            .rect(cardX + 3, startY + 3, cardWidth, cardHeight)
            .fill();

        doc.fillColor('white')
            .rect(cardX, startY, cardWidth, cardHeight)
            .fill();

        doc.strokeColor('#D6DBDF').lineWidth(1)
            .rect(cardX, startY, cardWidth, cardHeight)
            .stroke();

        doc.fillColor('#2C3E50').fontSize(12);

        const lineHeight = 25;
        let y = startY + 30;

        const addField = (label, value) => {
            doc.font('Helvetica-Bold').text(`${label}:`, cardX + 30, y, { continued: true });
            doc.font('Helvetica').text(` ${value || 'N/A'}`);
            y += lineHeight;
        };

        addField('Tipo', transaccion.tipo_transaccion);
        addField('Producto', `${transaccion.nombre} (SKU: ${transaccion.sku})`);
        addField('Cantidad', transaccion.cantidad);
        addField('Usuario', transaccion.nombre_usuario);
        addField('Fecha', transaccion.fecha);
        addField('Motivo', transaccion.motivo);

        doc.moveDown(8);
        doc.fontSize(10).fillColor('gray');
        doc.text(
            `Reporte generado el ${format(fechaGeneracion, "dd 'de' MMMM 'de' yyyy, HH:mm:ss", { locale: es })}`,
            { align: 'center' }
        );
        doc.text('Sistema de Gestión de Inventario', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error('Error al generar el PDF:', error);
        req.flash('error_msg', 'Error al generar el reporte PDF.');
        res.redirect('/transaccion/table');
    }
};