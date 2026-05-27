const productoModel = require('../models/productoModel');
const categoriaModel = require('../models/categoriaModel');
const proveedorModel = require('../models/proveedorModel');

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

exports.producto = async (req, res) => {
    try {
        const categoria = await categoriaModel.getCategoria();
        const proveedor = await proveedorModel.getProveedor();
        res.render('add/producto', { 
            title: 'Añadir Producto',
            categoria, proveedor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos');
    }
};

exports.getProducto = async (req, res) => {
    try {
        const producto = await productoModel.getProducto();
        res.render('tables/producto', { 
            title: 'Productos',
            producto 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
};

exports.addProducto = guardarDatos(productoModel.addProducto, '/producto/table');

exports.updateProducto = async (req, res) => {
    try {
        await productoModel.updateProducto(req.body);
        req.flash('success_msg', 'Datos Actualizados Correctamente');
        res.redirect('/producto/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar producto');
    }
};

exports.getProductoById = async (req, res) => {
    try {
        const producto = await productoModel.getProductoById(req.params.id);
        const categoria = await categoriaModel.getCategoria();
        const proveedor = await proveedorModel.getProveedor();
        res.render('update/producto', { 
            title: 'Actualizar Producto',
            producto, categoria, proveedor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener producto');
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        await productoModel.deleteProducto(req.params.id);
        req.flash('success_msg', 'Datos Eliminados Correctamente');
        res.redirect('/producto/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto');
    }
};