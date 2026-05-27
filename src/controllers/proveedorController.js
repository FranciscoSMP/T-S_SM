const proveedorModel = require('../models/proveedorModel');

const renderView = (view) => (req, res) => {
    res.render(view, {
        title: 'Añadir Proveedor'
    });
};

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

exports.proveedor = renderView('add/proveedor');

exports.addProveedor = guardarDatos(proveedorModel.addProveedor, '/proveedor/table');

exports.getProveedor = async (req, res) => {
    try {
        const proveedor = await proveedorModel.getProveedor();
        res.render('tables/proveedor', { 
            title: 'Proveedores',
            proveedor 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener proveedores');
    }
};

exports.updateProveedor = async (req, res) => {
    try {
        await proveedorModel.updateProveedor(req.body);
        req.flash('success_msg', 'Datos Actualizados Correctamente');
        res.redirect('/proveedor/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar proveedor');
    }
};

exports.getProveedorById = async (req, res) => {
    try {
        const proveedor = await proveedorModel.getProveedorById(req.params.id);
        res.render('update/proveedor', { 
            title: 'Actualizar Proveedor',
            proveedor 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener proveedor');
    }
};

exports.deleteProveedor = async (req, res) => {
    try {
        await proveedorModel.deleteProveedor(req.params.id);
        req.flash('success_msg', 'Datos Eliminados Correctamente');
        res.redirect('/proveedor/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar proveedor');
    }
};