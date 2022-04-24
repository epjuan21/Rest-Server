const { validationResult } = require("express-validator");
const Role = require('../models/role');
const User = require("../models/user");

const validateUserItems = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
}

// Verificar que el Rol Exista en la Base de Datos
const roleValidator = async(role = '') => {
    const roleExist = await Role.findOne({ role });
    if(!roleExist) {
        throw new Error('Role does not exist');
    }
}

// Verificar si el email existe
const emailExist = async(email = '') => {
    const emailExists = await User.findOne({ email });
    if(emailExists) {
        throw new Error('Email already exist');
    }
}

// Verificar si el Usuario Existe por ID
const userExist = async(id = '') => {
    const userExists = await User.findById(id);
    if(!userExists) {
        throw new Error('User does not exist');
    }
}

module.exports = {
    validateUserItems,
    roleValidator,
    emailExist,
    userExist
}
