// ---- AQUÍ DEFINIMOS EL ESQUEMA ----
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String
});


// ---- ENCRIPTA LA CONTRASEÑA ----
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// ---- CONTRASEÑA PARA COMPARAR, VEMOS SI LO ENCUENTRA EN LA B.D ----
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);