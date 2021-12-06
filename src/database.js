const mongoose = require('mongoose');
const { mongodb } = require('./keys');

mongoose.connect(mongodb.URI, { useNewUrlParser: true })
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.error(err));





//PRUEBA DE BASE DE DATOS PARA CARACTERÍSTICAS

const MongoClient = require('mongodb').MongoClient //TRAEMOS LIBRERIA PARA CONEXION
const uri = "mongodb+srv://Lucero:pulseraco2@clustercertus.rnzgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

let client //CREAMOS la VAriable llamada client



module.exports = function () { //EXPORTANDO UNA FUNCION

    if (!client) { //VERIFICAMOS QUE LA VARIABLE CLIENT EXISTE O NO
        try {
            client = new MongoClient(uri, { userNewUrlParser: true, useUnifiedTopology: true });
        } catch (e) { //CAPTURA EL ERROR EN CASO DE EXISTIR
            console.log("Error al contactar a la BD", e) //SI HAY ERROR LO IMPRIME
        }
    }
    return client
}
