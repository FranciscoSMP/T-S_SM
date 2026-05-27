const { poolPromise } = require('../keys');

const guardarEnBaseDatos = async (queryMySQL) => {
    return ejecutarMySQL(queryMySQL);
};

const ejecutarMySQL = async (query) => {
    const [rows] = await poolPromise.query(query);
    return rows;
};

exports.addCategoria = async ({ nombre_categoria, descripcion }) => {
    const query = `INSERT INTO categoria (nombre_categoria, descripcion) VALUES ('${nombre_categoria}', '${descripcion}')`;
    await guardarEnBaseDatos(query);
};

exports.getCategoria = async () => {
    const [rows] = await poolPromise.query('SELECT * FROM categoria');
    return rows;
};

exports.getCategoriaById = async (id) => {
    const [rows] = await poolPromise.query(`SELECT * FROM categoria WHERE id_categoria = ${id}`);
    return rows[0];
};

exports.updateCategoria = async ({ id_categoria, nombre_categoria, descripcion }) => {
    const query = `
        UPDATE categoria SET 
        nombre_categoria = '${nombre_categoria}', 
        descripcion = '${descripcion}'
        WHERE id_categoria = ${id_categoria}`;
    await guardarEnBaseDatos(query);
};  

exports.deleteCategoria = async (id) => {
    const query = `DELETE FROM categoria WHERE id_categoria = ${id}`;
    await guardarEnBaseDatos(query);
};