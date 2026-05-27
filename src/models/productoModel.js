const { poolPromise } = require('../keys');

const guardarEnBaseDatos = async (queryMySQL) => {
    return ejecutarMySQL(queryMySQL);
};

const ejecutarMySQL = async (query) => {
    const [rows] = await poolPromise.query(query);
    return rows;
};

exports.addProducto = async ({ nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor }) => {
    const query = `INSERT INTO producto (nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor) VALUES (
                    '${nombre}', 
                    '${descripcion}', 
                    '${precio_unitario}', 
                    '${umbral_minimo}',
                    '${id_categoria}',
                    '${id_proveedor}'
    )`;
    await guardarEnBaseDatos(query);
};

exports.getProducto = async () => {
    const [rows] = await poolPromise.query(`
        SELECT 
        producto.id_producto,
        producto.sku, 
        producto.nombre,
        producto.descripcion,
        producto.precio_unitario,
        producto.stock_actual,
        producto.umbral_minimo,
        categoria.nombre_categoria,
        proveedor.nombre_comercial
        FROM 
            producto
        JOIN 
            categoria ON producto.id_categoria = categoria.id_categoria
        JOIN 
            proveedor ON producto.id_proveedor = proveedor.id_proveedor
        `);
    
    const productosConEstado = rows.map(p => {
        let estado_inventario = 'normal';

        if (p.stock_actual <= p.umbral_minimo) {
            estado_inventario = 'critico';
        } else if (p.stock_actual <= p.umbral_minimo + 5) {
            estado_inventario = 'bajo';
        }

        return { ...p, estado_inventario };
    });

    return productosConEstado;
};

exports.getProductoById = async (id) => {
    const [rows] = await poolPromise.query(`SELECT * FROM producto WHERE id_producto = ${id}`);
    return rows[0];
};

exports.updateProducto = async ({ id_producto, nombre, descripcion, precio_unitario, umbral_minimo, id_categoria, id_proveedor }) => {
    const query = `
        UPDATE producto SET 
        nombre = '${nombre}', 
        descripcion = '${descripcion}',
        precio_unitario = '${precio_unitario}',
        umbral_minimo = '${umbral_minimo}',
        id_categoria = '${id_categoria}',
        id_proveedor = '${id_proveedor}'
        WHERE id_producto = ${id_producto}`;
    await guardarEnBaseDatos(query);
};  

exports.deleteProducto = async (id) => {
    const query = `DELETE FROM producto WHERE id_producto = ${id}`;
    await guardarEnBaseDatos(query);
};