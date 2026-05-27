module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Por favor inicie sesión para acceder a esta página');
        res.redirect('/login');
    }
};
