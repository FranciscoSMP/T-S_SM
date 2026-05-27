const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../keys');

module.exports = function(passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const [rows] = await poolPromise.execute(
                'SELECT * FROM Usuario WHERE Nombre_Usuario = ?', 
                [username]
            );
            
            const user = rows[0];
            if (!user) {
                return done(null, false, { message: 'Usuario o contraseña incorrecta' });
            }

            const isMatch = await bcrypt.compare(password, user.Contrasenia);
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
        done(null, user.Id_Usuario);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const [rows] = await poolPromise.execute(`
                SELECT u.*, r.Rol 
                FROM Usuario u
                INNER JOIN Rol r ON u.Id_Rol = r.Id_Rol
                WHERE u.Id_Usuario = ?
            `, [id]);
            const user = rows[0];
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};