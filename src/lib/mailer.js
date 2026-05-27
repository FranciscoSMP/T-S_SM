const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarAlertaStock = async (producto, adminEmail) => {
    const mailOptions = {
        from: `"Gestión de Inventario T&S SM" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `⚠️ Alerta Crítica: Reabastecimiento requerido - ${producto.nombre}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center;">
                    <h2 style="margin: 0;">Alerta de Stock Crítico</h2>
                </div>
                <div style="padding: 20px;">
                    <p>El sistema ha detectado que un artículo ha alcanzado niveles críticos tras la última transacción.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>SKU:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${producto.sku}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Producto:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${producto.nombre}</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd; color: #e74c3c;"><strong>Stock Actual:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #e74c3c;"><strong>${producto.stock_actual} unidades</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Umbral Mínimo:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${producto.umbral_minimo} unidades</td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px;">Se recomienda gestionar el reabastecimiento con el proveedor a la brevedad posible para evitar interrupciones en las operaciones.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[INFO] Alerta de stock enviada exitosamente para: ${producto.nombre}`);
    } catch (error) {
        console.error('[ERROR] Fallo al intentar enviar el correo de alerta:', error);
    }
};

module.exports = { enviarAlertaStock };