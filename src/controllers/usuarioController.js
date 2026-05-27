const usuarioModel = require('../models/usuarioModel');

const guardarDatos = (model, redirect) => async (req, res) => {
    try {
        await model(req.body);
        req.flash('success_msg', 'Datos Guardados Correctamente');
        res.redirect(redirect);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al guardar ${redirect.slice(7)}`);
    }
};

exports.Usuario = async (req, res) => {
    try {
        const roles = await usuarioModel.obtenerRoles();
        res.render('add/usuario', { 
            title: 'Añadir Usuario',
            roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos');
    }
};

exports.addUsuario = guardarDatos(usuarioModel.addUsuario, '/usuario/table');

exports.getUsuario = async (req, res) => {
    const result = await usuarioModel.getUsuario();
    res.render('tables/usuario', {
        title: 'Usuarios',
        usuarios: result
    });
}

exports.getUsuarioById = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await usuarioModel.getUsuarioById(id);
        const roles = await usuarioModel.obtenerRoles();

        if (!usuario) {
            req.flash('error_msg', 'El usuario no existe');
            return res.redirect('/usuario/table');
        }

        res.render('update/usuario', { 
            title: 'Editar Usuario', 
            usuario, 
            roles 
        });

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Hubo un error al cargar los datos del usuario');
        res.redirect('/usuario/table');
    }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const {
        nombre_usuario,
        correo_electronico,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        contrasenia,
        confirmar_contrasenia,
        id_rol
    } = req.body;

    try {
        if (contrasenia && contrasenia !== confirmar_contrasenia) {
            req.flash('error_msg', 'Las contraseñas no coinciden.');
            return res.redirect(`/usuario/editar/${id}`);
        }

        const updatedUser = {
            id_usuario: id,
            nombre_usuario,
            correo_electronico,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            contrasenia,
            id_rol
        };

        const result = await usuarioModel.updateUsuario(updatedUser);

        req.flash('success_msg', 'Usuario actualizado correctamente');
        res.redirect('/usuario/table');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Ocurrió un error al actualizar el usuario');
        res.redirect(`/usuario/editar/${id}`);
    }
};

exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await usuarioModel.deleteUsuario(id);
        req.flash('success_msg', 'Usuario eliminado correctamente');
        res.redirect('/usuario/table');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Ocurrió un error al eliminar el usuario');
        res.redirect('/usuario/table');
    }
};