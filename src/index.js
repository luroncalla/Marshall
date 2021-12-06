// ---- CÓDIGO DEL SERVIDOR ----
const express = require('express');
const engine = require('ejs-mate');
const path = require('path'); // ----MÓDULO PARA COLOCAR O UNIR DIRECTORIOS ----
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const { applyRetryableWrites } = require('mongodb/lib/utils');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ---- INICIALIZACIONES ----

require('./database');
require('./passport/local-auth');

// ---- CONFIGURACIÓN ----
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine); // ---- PARA PODER UTILIZAR EL MOTOR DE PLANTILLAS EJS ----
app.set('view engine', 'ejs'); // ---- ESTABLECER EL MOTOR DE PLANTILLAS ----
app.set('port', process.env.PORT || 3000); // ----LE DECIMOS QUE UTILICE EL PUERTO DEL SISTEMA OPERATIVO Y SI NO EXISTE, QUE UTILICE EL PUERTO 3000 ----


// ---- MIDDLEWARES  ---- // ---- Funciones que se ejcutan antes que se pasen a las rutas
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
});

// ---- ROUTES ----
app.use('/', require('./routes/index')); // ---- LE DECIMOS A EXPRESS QUE UTILICE ESTAS RUTAS QUE ESTOY REQUIRIENDO CADA VEZ QUE EL USUARIO INGRESE A LA RUTA PRINCIPAL DE MI APLICACIÓN


// ---- INICIANDO EL SERVIDOR ----
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});

// ---- CAPTURAR ARCHIVOS EXTERNOS ----
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// ---- PRODUCTOS -----

let products = [

    {
        id: 1,
        name: "Gafas Ray-Ban",
        price: 150,
        image: "/img/lentes.jpg",
        stock: 50
    },
    {
        id: 2,
        name: "Blusa Channel",
        price: 210,
        image: "/img/blusa.jpg",
        stock: 50
    },
    {
        id: 3,
        name: "Conjunto Oversize Widarly",
        price: 276,
        image: "/img/oversize.jpg",
        stock: 50
    },
    {
        id: 4,
        name: "Converse White Adidas",
        price: 300,
        image: "/img/converse.jpg",
        stock: 50
    },
    {
        id: 5,
        name: "Pantalon a cuadros Gucci",
        price: 255,
        image: "/img/pantalon.jpg",
        stock: 50
    },
    {
        id: 6,
        name: "Sombreo Negro Gucci",
        price: 120,
        image: "/img/sombrero.jpg",
        stock: 50
    },

];

app.get('/productos', (req, res, next) => {
    res.render('productos');
});


app.get('/api/productos', (req, res, next) => {
    res.send(products);
});

app.post('/api/pay', (req, res) => {
    const ids = req.body;
    const procutsCopy = products.map((p) => ({ ...p }));
    ids.forEach((id) => {
        const product = procutsCopy.find((p) => p.id === id);
        if (product.stock > 0) {
            product.stock--;
        } else {
            throw "Sin stock";
        }

    });
    products = procutsCopy;
    res.send(products);
});


