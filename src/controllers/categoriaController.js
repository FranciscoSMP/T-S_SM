const categoriaModel = require('../models/categoriaModel');

const renderView = (view) => (req, res) => {
    res.render(view, {
        title: 'Añadir Categoria'
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

exports.categoria = renderView('add/categoria');

exports.addCategoria = guardarDatos(categoriaModel.addCategoria, '/categoria/table');

exports.getCategoria = async (req, res) => {
    try {
        const categoria = await categoriaModel.getCategoria();
        res.render('tables/categoria', { 
            title: 'Categorias',
            categoria 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener categorias');
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        await categoriaModel.updateCategoria(req.body);
        req.flash('success_msg', 'Datos Actualizados Correctamente');
        res.redirect('/categoria/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la categoria');
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const categoria = await categoriaModel.getCategoriaById(req.params.id);
        res.render('update/categoria', { 
            title: 'Actualizar Categoria',
            categoria 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la categoria');
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        await categoriaModel.deleteCategoria(req.params.id);
        req.flash('success_msg', 'Datos Eliminados Correctamente');
        res.redirect('/categoria/table');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la categoria');
    }
};