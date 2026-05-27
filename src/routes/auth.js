const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isNotLoggedIn } = require('../lib/auth');

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login', { title: 'Iniciar Sesión' });
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Sesión cerrada correctamente.');
        res.redirect('/login');
    });
});

module.exports = router;
