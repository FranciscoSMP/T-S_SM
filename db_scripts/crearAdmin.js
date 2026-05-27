require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../src/keys');

async function crearUsuarioAdministrador() {
    try {
        if (!poolPromise) throw new Error('No se pudo establecer conexión con la base de datos.');

        const nombreUsuario = 'admin';
        const primerNombre = 'Administrador';
        const primerApellido = 'Principal';
        const correo = 'admin@sm.com';
        const contrasenaPlano = 'admin123';
        const hashContrasena = await bcrypt.hash(contrasenaPlano, 10);

        console.log(`Contraseña cifrada para '${nombreUsuario}': ${hashContrasena}`);

        const [usuarioExistente] = await poolPromise.execute(
            'SELECT * FROM usuario WHERE nombre_usuario = ?',
            [nombreUsuario]
        );

        if (usuarioExistente.length > 0) {
            console.log('ℹ El usuario administrador ya existe. No se creará uno nuevo.');
            return;
        }

        const [rolAdmin] = await poolPromise.execute(
            'SELECT id_rol FROM rol WHERE rol = ?',
            ['Administrador']
        );

        if (rolAdmin.length === 0) {
            throw new Error('No se encontró el rol "Administrador". Verifique la tabla rol.');
        }

        const idRol = rolAdmin[0].id_rol;

        await poolPromise.execute(`
            INSERT INTO usuario
                (nombre_usuario, primer_nombre, primer_apellido, correo_electronico, contrasenia, id_rol)
            VALUES
                (?, ?, ?, ?, ?, ?)
        `, [nombreUsuario, primerNombre, primerApellido, correo, hashContrasena, idRol]);

        console.log('Usuario administrador creado correctamente.');
        console.log(`Usuario: ${nombreUsuario} | Correo: ${correo}`);

    } catch (err) {
        console.error('Error al crear el usuario administrador:', err);
    } finally {
        console.log('Script finalizado.');
        process.exit();
    }
}

crearUsuarioAdministrador();