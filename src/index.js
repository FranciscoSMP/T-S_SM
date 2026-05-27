const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
require('./lib/passport')(passport);

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); 
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'), 
    extname: '.hbs',
    helpers: require('./lib/helpers')
}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'sqlnodesession',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user || null;
    next();
});

app.use(require('./routes/index'));
app.use('/usuario', require('./routes/usuario'));
app.use('/categoria', require('./routes/categoria'));
app.use('/proveedor', require('./routes/proveedor'));
app.use('/producto', require('./routes/producto'));
app.use('/transaccion', require('./routes/transaccion'));
app.use('/reporte', require('./routes/reporte'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});
