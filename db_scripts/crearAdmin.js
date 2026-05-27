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
            'SELECT * FROM Usuario WHERE Nombre_Usuario = ?',
            [nombreUsuario]
        );

        if (usuarioExistente.length > 0) {
            console.log('ℹ El usuario administrador ya existe. No se creará uno nuevo.');
            return;
        }

        const [rolAdmin] = await poolPromise.execute(
            'SELECT Id_Rol FROM Rol WHERE Rol = ?',
            ['Administrador']
        );

        if (rolAdmin.length === 0) {
            throw new Error('No se encontró el rol "Administrador". Verifique la tabla Rol.');
        }

        const idRol = rolAdmin[0].Id_Rol;

        await poolPromise.execute(`
            INSERT INTO Usuario
                (Nombre_Usuario, Primer_Nombre, Primer_Apellido, Correo_Electronico, Contrasenia, Id_Rol)
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