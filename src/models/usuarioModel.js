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
            INSERT INTO Usuario (Nombre_Usuario, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Correo_Electronico, Contrasenia, Id_Rol)
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
        const query = 'SELECT * FROM Rol';
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
                U.Id_Usuario,
                U.Nombre_Usuario,
                U.Primer_Nombre,
                U.Segundo_Nombre,
                U.Primer_Apellido,
                U.Segundo_Apellido,
                U.Correo_Electronico,
                R.Rol AS Nombre_Rol
            FROM Usuario U
            INNER JOIN Rol R ON U.Id_Rol = R.Id_Rol
            ORDER BY U.Id_Usuario ASC
    `);
    return rows;
};

exports.getUsuarioById = async (id) => {
    const query = `
        SELECT 
            Id_Usuario, Nombre_Usuario, Primer_Nombre, Segundo_Nombre, 
            Primer_Apellido, Segundo_Apellido, Correo_Electronico, Id_Rol
        FROM Usuario
        WHERE Id_Usuario = ${id}
    `;
    const result = await ejecutarMySQL(query);
    return result[0];
};

exports.updateUsuario = async ({ id_usuario, nombre_usuario, correo_electronico, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, contrasenia, id_rol }) => {
    let query = `
        UPDATE Usuario
        SET
            Nombre_Usuario = '${nombre_usuario}',
            Correo_Electronico = '${correo_electronico}',
            Primer_Nombre = '${primer_nombre}',
            Segundo_Nombre = '${segundo_nombre}',
            Primer_Apellido = '${primer_apellido}',
            Segundo_Apellido = '${segundo_apellido}',
            Id_Rol = ${id_rol}
    `;

    if (contrasenia && contrasenia.trim() !== '') {
        const hash = await bcrypt.hash(contrasenia, 10);
        query += `, Contrasenia = '${hash}'`;
    }

    query += ` WHERE Id_Usuario = ${id_usuario}`;

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
        const query = `DELETE FROM Usuario WHERE Id_Usuario = ${id_usuario}`;
        await guardarEnBaseDatos(query);
        return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw new Error('Error al eliminar el usuario');
    }
};