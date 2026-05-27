const bcrypt = require('bcryptjs');
const { poolPromise } = require('../keys');

const guardarEnBaseDatos = async (queryMySQL) => {
    return ejecutarMySQL(queryMySQL);
};

const ejecutarMySQL = async (query) => {
    const [rows] = await poolPromise.query(query);
    return rows;
};

exports.addUsuario = async ({ nombre_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, contrasenia, confirmar_contrasenia, id_rol }) => {
    try {
        if (contrasenia !== confirmar_contrasenia) {
            throw new Error('Las contraseñas no coinciden');
        }

        const hash = await bcrypt.hash(contrasenia, 10);

        const query = `
            INSERT INTO usuario (nombre_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, contrasenia, id_rol)
            VALUES ('${nombre_usuario}', '${primer_nombre}', '${segundo_nombre}', '${primer_apellido}', '${segundo_apellido}', '${correo_electronico}', '${hash}', ${id_rol})
        `;

        await guardarEnBaseDatos(query);

        return { message: 'Usuario creado correctamente' };

    } catch (err) {
        console.error(err);
        throw new Error('Error al crear el usuario: ' + err.message);
    }
};

exports.obtenerRoles = async () => {
    try {
        const query = 'SELECT * FROM rol';
        const resultado = await ejecutarMySQL(query);
        return resultado;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw new Error('Error al obtener los roles desde la base de datos');
    }
};

exports.getUsuario = async () => {
    const [rows] = await poolPromise.query(`
            SELECT 
                u.id_usuario,
                u.nombre_usuario,
                u.primer_nombre,
                u.segundo_nombre,
                u.primer_apellido,
                u.segundo_apellido,
                u.correo_electronico,
                r.rol AS nombre_rol
            FROM usuario u
            INNER JOIN rol r ON u.id_rol = r.id_rol
            ORDER BY u.id_usuario ASC
    `);
    return rows;
};

exports.getUsuarioById = async (id) => {
    const query = `
        SELECT 
            id_usuario, nombre_usuario, primer_nombre, segundo_nombre, 
            primer_apellido, segundo_apellido, correo_electronico, id_rol
        FROM usuario
        WHERE id_usuario = ${id}
    `;
    const result = await ejecutarMySQL(query);
    return result[0];
};

exports.updateUsuario = async ({ id_usuario, nombre_usuario, correo_electronico, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, contrasenia, id_rol }) => {
    let query = `
        UPDATE usuario
        SET
            nombre_usuario = '${nombre_usuario}',
            correo_electronico = '${correo_electronico}',
            primer_nombre = '${primer_nombre}',
            segundo_nombre = '${segundo_nombre}',
            primer_apellido = '${primer_apellido}',
            segundo_apellido = '${segundo_apellido}',
            id_rol = ${id_rol}
    `;

    if (contrasenia && contrasenia.trim() !== '') {
        const hash = await bcrypt.hash(contrasenia, 10);
        query += `, contrasenia = '${hash}'`;
    }

    query += ` WHERE id_usuario = ${id_usuario}`;

    try {
        await ejecutarMySQL(query);
        return { message: 'Usuario actualizado correctamente' };
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw new Error('Error al actualizar el usuario');
    }
};

exports.deleteUsuario = async (id_usuario) => {
    try {
        const query = `DELETE FROM usuario WHERE id_usuario = ${id_usuario}`;
        await guardarEnBaseDatos(query);
        return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw new Error('Error al eliminar el usuario');
    }
};