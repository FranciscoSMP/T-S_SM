const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../keys');

module.exports = function(passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const [rows] = await poolPromise.execute(
                'SELECT * FROM usuario WHERE nombre_usuario = ?', 
                [username]
            );
            
            const user = rows[0];
            if (!user) {
                return done(null, false, { message: 'Usuario o contraseña incorrecta' });
            }

            const isMatch = await bcrypt.compare(password, user.contrasenia);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Usuario o contraseña incorrecta' });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id_usuario);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await poolPromise.execute(`
                SELECT u.*, r.rol 
                FROM usuario u
                INNER JOIN rol r ON u.id_rol = r.id_rol
                WHERE u.id_usuario = ?
            `, [id]);
            const user = rows[0];
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};