// ---- ALMACENA LAS RUTAS PRINCIPALES ----
const { Router } = require('express');
const express = require('express');
const router = express.Router(); // ---- DEFINIMOS LAS RUTAS DE NUESTRO SERVIDOR ----
const Collection = require('mongodb/lib/collection');
const { applyRetryableWrites } = require('mongodb/lib/utils');
const client = require('../database')();// ---- TRAEMOS LA FUNCIÓN QUE HEMOS EXPORTADO, EL QUE LLAME A CONNECT OBTENDRÁ ESA FUNCIÓN ----
// const bodyParser = require("body-parser");

// const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const passport = require('passport');

router.get('/', (req, res, next) => { // ----- RUTA INICIAL //MANEJADOR DE PETICIONES ---- 
    res.render('index');
});


router.get('/signup', (req, res, next) => { // ---- CON EL ROUTER.GET LE ENVIAMOS UNA VENTANA DONDE EL USUARIO VA A INSERTAR SUS DATOS ----
    res.render('signup');
});
// --------------------this



router.get('/ofertas', (req, res, next) => {
    res.render('ofertas');
});


router.post('/signup', passport.authenticate('local-signup', { // ---- ESCUCHA LOS DATOS QUE ENVIA EL USUARIO A TRAVES DEL MÉTODO POST ----
    successRedirect: '/index',
    failureRedirect: '/signup',
    passReqToCallback: true
}));


router.get('/signin', (req, res, next) => { // ---- CON EL ROUTER.GET LE ENVIAMOS UNA VENTANA DONDE EL USUARIO SE VA A LOGUEAR ----
    res.render('signin');
});


router.post('/signin', passport.authenticate('local-signin', { // ---- ESCUCHA LOS DATOS QUE ENVIA EL USUARIO A TRAVES DEL MÉTODO POST Y VALIDAMOS ----
    successRedirect: '/productos',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});


//ESTO TAMBIÉN SIRVE: IRIA ANTES DE Las PÁG QUE QUIERO PROTEGER (xq estoy usando el método use, y eso siempre se ejecuta antes de pasar a otras rutas)
// router.use((req, res, next) => {
//      isAuthenticated(req, res, next);
//      next();
//});


router.post('/ofertas', (req, res) => {  // ---- Trae la info desde el mongodb hasta nuestro controlador ----
    client.connect(async (err) => {  // ---- Conexión a la base de datos ---- 
        if (!err) {  // ---- Preguntamos si existe un error en la conexión ---- 
            const collection = client.db("test").collection("caracteristicas")
            collection.find().toArray((err, result) => {  // ---- Trae los datos con find y lo transforma a un array ----
                if (!err) {  // ---- Preguntamos si existe un error en la transformación ----
                    res.render('ofertas', { datos: result })  // ---- Le anexo datos al render a la pag listar alumnos ----
                } else {
                    res.send("'resultado':[{'respuesta':'Error al traer la data'},{'mensaje':" + err + "}]")
                }
            })
        } else {
            res.send("resultado:[{'respuesta':'Error al cargar'},{'mensaje':" + err + "}]")
        }
    })
})



router.post('/caracteristicas', (req, res) => {  // ---- Trae la info desde el mongodb hasta nuestro controlador ----
    var nombreLocal = req.body.marca;
    client.connect(async (err) => {  // ---- Conexión a la base de datos ----
        if (!err) {  // ---- Preguntamos si existe un error en la conexión ----
            const collection = client.db("test").collection("caracteristicas")
            collection.find({ marca: { $eq: nombreLocal } }).toArray((err, result) => { //trae los datos con find y lo transforma a un array ----
                if (!err) {  // ---- Preguntamos si existe un error en la transformación ----
                    res.render('ofertas', { datos: result }) // ---- Le anexo datos al render a la pag ofertas ----
                } else {
                    res.send("'resultado':[{'respuesta':'Error al traer la data'},{'mensaje':" + err + "}]")
                }
            })

        } else {
            res.send("resultado:[{'respuesta':'Error al cargar'},{'mensaje':" + err + "}]")
        }
    })
})


router.get('/compra', isAuthenticated, (req, res, next) => {  // ---- IS AUTHENTICATED ES PARA VER SI CUANDO EL USUARIO ENTRA A PROFILE, SE VA EJECUTAR LA FUNCION IS AUTHENTICATED PARA VER SI ESTÁ AUTENTICADO O NOP ----
    res.render('compra');
});



// ---- MÉTODO QUE NOS PERMITE AUTENTICARNOS ----
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {  // ---- SI EL USUARIO ESTÁ AUTENTICADO, ENTONCES ES TRUE Y PUEDO IR A LA RUTA QUE VOY A ELEGIR ---- 
        return next();
    }
    res.redirect('/signin');  // ----CASO CONTRARIO QUE ME REDIRECCIONE A LA PG. PRINCIPAL ----
};



module.exports = router;