const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const { jsPDF } = require('jspdf');
const productoModel = require('../models/productoModel');
const transaccionModel = require('../models/transaccionModel');

exports.mostrarReportes = async (req, res) => {
    try {
        const rol = req.user.Id_Rol;

        if (rol === 1) {
            const productos = await productoModel.getProducto();
            const valorInventario = productos.reduce((total, p) => total + (p.precio_unitario * p.stock_actual), 0);
            const masVendidos = await transaccionModel.getProductosMasVendidos();
            const bajoStock = productos.filter(p => p.stock_actual <= p.umbral_minimo);
            const totalProductos = productos.length;
            const productosConStock = productos.filter(p => p.stock_actual > 0).length;
            const porcentajeBajoStock = ((bajoStock.length / totalProductos) * 100).toFixed(2);

            res.render('dashboard', {
                title: 'Panel de Control',
                user: req.user,
                valorInventario: valorInventario.toFixed(2),
                masVendidos,
                bajoStock,
                totalProductos,
                productosConStock,
                porcentajeBajoStock,
                json: JSON.stringify
            });
        } else if (rol === 2) {
            res.render('dashboardEmpleado', {
                title: 'Panel de Control',
                user: req.user,
                mensaje: 'Bienvenido al panel del empleado'
            });
        }
    } catch (error) {
        console.error('Error generando reportes:', error);
        res.render('dashboard', { error: 'Error al generar los reportes.' });
    }
};

exports.generarReportePDF = async (req, res) => {
    try {
        const productos = await productoModel.getProducto();
        const masVendidos = await transaccionModel.getProductosMasVendidos();
        const bajoStock = productos.filter(p => p.stock_actual <= p.umbral_minimo);
        const totalProductos = productos.length;
        const productosConStock = productos.filter(p => p.stock_actual > 0).length;
        const valorInventario = productos.reduce((t, p) => t + (p.precio_unitario * p.stock_actual), 0);

        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte de Inventario', 70, 15);
        doc.setFontSize(11);
        doc.text(`Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 25);

        doc.setFont('helvetica', 'normal');
        doc.text(`Valor total inventario: Q${valorInventario.toFixed(2)}`, 14, 35);
        doc.text(`Productos totales: ${totalProductos}`, 14, 42);
        doc.text(`Productos con stock: ${productosConStock}`, 14, 49);
        doc.text(`Productos bajo stock: ${bajoStock.length}`, 14, 56);

        doc.setFont('helvetica', 'bold');
        doc.text('Productos con Bajo Stock:', 14, 70);
        doc.setFont('helvetica', 'normal');
        bajoStock.slice(0, 10).forEach((p, i) => {
            doc.text(`${i + 1}. ${p.nombre} - ${p.stock_actual} unidades`, 14, 80 + (i * 6));
        });

        doc.setFont('helvetica', 'bold');
        doc.text('Productos Más Vendidos:', 14, 150);
        doc.setFont('helvetica', 'normal');
        masVendidos.slice(0, 10).forEach((p, i) => {
            doc.text(`${i + 1}. ${p.nombre} - ${p.total_vendida} unidades`, 14, 160 + (i * 6));
        });

        const fileName = `Reporte_Inventario_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`;
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.contentType('application/pdf');
        res.send(Buffer.from(doc.output('arraybuffer')));
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).send('Error al generar el reporte PDF');
    }
};