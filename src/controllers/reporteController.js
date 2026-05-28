const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const { jsPDF } = require('jspdf');
const productoModel = require('../models/productoModel');
const transaccionModel = require('../models/transaccionModel');
const autoTableModule = require('jspdf-autotable');
const autoTable = autoTableModule.default || autoTableModule;

exports.mostrarReportes = async (req, res) => {
    try {
        const rol = req.user.id_rol;

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
        const pageWidth = doc.internal.pageSize.width;

        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, pageWidth, 28, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Tecnología y Soluciones SM', 14, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Gestión de Inventario', pageWidth - 70, 18);

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Reporte Consolidado de Inventario', 14, 42);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha de emisión: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 49);

        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(220, 220, 220);
        doc.rect(14, 55, 85, 25, 'FD');
        doc.rect(105, 55, 85, 25, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.text('Valor Total del Inventario', 18, 63);
        doc.setFont('helvetica', 'normal');
        doc.text(`Q ${valorInventario.toFixed(2)}`, 18, 72);

        doc.setFont('helvetica', 'bold');
        doc.text('Resumen de Productos', 109, 63);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total: ${totalProductos} | Con Stock: ${productosConStock} | Críticos: ${bajoStock.length}`, 109, 72);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Top Productos Más Vendidos', 14, 95);

        const tablaVentasBody = masVendidos.slice(0, 10).map((p, i) => [i + 1, p.nombre, `${p.total_vendida} uds.`]);

        autoTable(doc, {
            startY: 100,
            head: [['#', 'Nombre del Producto', 'Cantidad Vendida']],
            body: tablaVentasBody.length ? tablaVentasBody : [['-', 'No hay registros de salidas', '-']],
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            styles: { font: 'helvetica', fontSize: 9 }
        });

        const finalY = doc.lastAutoTable.finalY || 100;
        doc.text('Productos con Nivel de Stock Crítico', 14, finalY + 15);

        const tablaStockBody = bajoStock.slice(0, 10).map((p, i) => [i + 1, p.nombre, `${p.stock_actual} uds.`]);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['#', 'Nombre del Producto', 'Existencia Actual']],
            body: tablaStockBody.length ? tablaStockBody : [['-', 'No hay productos en estado crítico', '-']],
            theme: 'grid',
            headStyles: { fillColor: [192, 57, 43], textColor: 255 },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            styles: { font: 'helvetica', fontSize: 9 }
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