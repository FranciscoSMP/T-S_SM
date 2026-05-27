const { poolPromise } = require('../keys');

const guardarEnBaseDatos = async (queryMySQL) => {
    return ejecutarMySQL(queryMySQL);
};

const ejecutarMySQL = async (query) => {
    const [rows] = await poolPromise.query(query);
    return rows;
};

exports.addProveedor = async ({ nit, nombre_comercial, direccion, telefono, correo_electronico }) => {
    const query = `INSERT INTO proveedor (nit, nombre_comercial, direccion, telefono, correo_electronico) VALUES 
                    ('${nit}', '${nombre_comercial}', '${direccion}', '${telefono}', '${correo_electronico}')`;
    await guardarEnBaseDatos(query);
};

exports.getProveedor = async () => {
    const [rows] = await poolPromise.query('SELECT * FROM proveedor');
    return rows;
};

exports.getProveedorById = async (id) => {
    const [rows] = await poolPromise.query(`SELECT * FROM proveedor WHERE id_proveedor = ${id}`);
    return rows[0];
};

exports.updateProveedor = async ({ id_proveedor, nit, nombre_comercial, direccion, telefono, correo_electronico }) => {
    const query = `
        UPDATE proveedor SET 
        nit = '${nit}', 
        nombre_comercial = '${nombre_comercial}',
        direccion = '${direccion}',
        telefono = '${telefono}',
        correo_electronico = '${correo_electronico}'
        WHERE id_proveedor = ${id_proveedor}`;
    await guardarEnBaseDatos(query);
};  

exports.deleteProveedor = async (id) => {
    const query = `DELETE FROM proveedor WHERE id_proveedor = ${id}`;
    await guardarEnBaseDatos(query);
};