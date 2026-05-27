const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const { poolPromise } = require('../keys');

const guardarEnBaseDatos = async (queryMySQL) => {
    return ejecutarMySQL(queryMySQL);
};

const ejecutarMySQL = async (query) => {
    const [rows] = await poolPromise.query(query);
    return rows;
};

exports.addTransaccion = async ({ tipo_transaccion, motivo, cantidad, Id_Usuario, id_producto }) => {
    const tiposValidos = ['Entrada', 'Salida', 'Devolucion', 'Ajuste'];
    if (!tiposValidos.includes(tipo_transaccion)) {
        throw new Error('Tipo de transacción inválido.');
    }

    const cantidadNum = parseInt(cantidad, 10);
    if (Number.isNaN(cantidadNum)) {
        throw new Error('Cantidad inválida.');
    }

    const usuarioId = parseInt(Id_Usuario, 10);
    const productoId = parseInt(id_producto, 10);
    if (Number.isNaN(usuarioId) || Number.isNaN(productoId)) {
        throw new Error('Usuario o producto inválido.');
    }

    const motivoSafe = motivo ? motivo.replace(/'/g, "''") : null;
    const motivoValue = motivoSafe ? `'${motivoSafe}'` : 'NULL';

    const query = `
        INSERT INTO Transaccion (tipo_transaccion, motivo, cantidad, Id_Usuario, id_producto)
        VALUES ('${tipo_transaccion}', ${motivoValue}, ${cantidadNum}, ${usuarioId}, ${productoId})
    `;
    await guardarEnBaseDatos(query);
};

exports.getTransacciones = async (rol, idUsuario) => {
    let query = `
        SELECT 
        transaccion.id_transaccion,
        transaccion.tipo_transaccion,
        transaccion.motivo,
        transaccion.fecha,
        transaccion.cantidad,
        usuario.nombre_usuario,
        producto.nombre
        FROM transaccion
        JOIN usuario ON transaccion.id_usuario = usuario.id_usuario
        JOIN producto ON transaccion.id_producto = producto.id_producto
    `;

    if (rol === 2) {
        query += ` WHERE transaccion.id_usuario = ${idUsuario}`;
    }

    query += ` ORDER BY transaccion.fecha DESC`;

    const transacciones = await ejecutarMySQL(query);

    const transaccionesFormateadas = transacciones.map(t => ({
        ...t,
        fecha: t.fecha
            ? format(new Date(t.fecha), "dd/MM/yyyy HH:mm", { locale: es })
            : 'Sin fecha'
    }));

    return transaccionesFormateadas;
};

exports.getTransaccionById = async (id) => {
    const query = `
        SELECT 
        transaccion.id_transaccion,
        transaccion.tipo_transaccion,
        transaccion.motivo,
        transaccion.fecha,
        transaccion.cantidad,
        usuario.nombre_usuario,
        producto.nombre,
        producto.sku
        FROM transaccion
        JOIN usuario ON transaccion.id_usuario = usuario.id_usuario
        JOIN producto ON transaccion.id_producto = producto.id_producto
        WHERE transaccion.id_transaccion = ${id}
    `;

    const result = await ejecutarMySQL(query);
    const transaccion = result[0];

    if (!transaccion) {
        throw new Error('Transacción no encontrada.');
    }

    const fechaFormateada = transaccion.fecha
        ? format(new Date(transaccion.fecha), "EEEE d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
        : 'Sin fecha';

    return { ...transaccion, fecha: fechaFormateada };
};

exports.getProductosMasVendidos = async () => {
    const [rows] = await poolPromise.query(`
        SELECT 
            producto.nombre,
            SUM(transaccion.cantidad) AS total_vendida
        FROM transaccion
        JOIN producto ON transaccion.id_producto = producto.id_producto
        WHERE transaccion.tipo_transaccion = 'Salida'
        GROUP BY producto.nombre
        ORDER BY total_vendida DESC
        LIMIT 5
    `);
    return rows;
};