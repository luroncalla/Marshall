const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

//DECIMOS CÓMO VAMOS A UTILIZAR LOS DATOS QUE VENGAN DESDE EL CLIENTE
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, email, password, done) => {

    const user = await User.findOne({ email: email });//BUSCA SI COINCIDE UN CORREO CON EL DATO QUE ESTOY RECIBIENDO
    if (user) {
        return done(null, false, req.flash('signupMessage', 'El email ya existe'));
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save(); //LE DECIMOS QUE CUANDO TERMINE DE GUARDARLO CONTNUE CON LA SIGUIENTE LINEA
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    //EN CASO EL CORREO INGRESADO NO EXISTA
    const user = await User.findOne({email: email});
    if(!user) {
        return done (null, false, req.flash('signinMessage', 'Usuario no encontrado'));
    }
    if(!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
    }
    done(null, user);
}));