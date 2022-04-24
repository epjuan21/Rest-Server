const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require("../models/user");

const validateUserItems = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
}

// Verificar que el Rol Exista en la Base de Datos
const roleValidator = async (role = '') => {
    const roleExist = await Role.findOne({ role });
    if (!roleExist) {
        throw new Error('Role does not exist');
    }
}

// Verificar si el email existe
const emailExist = async (email = '') => {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error('Email already exist');
    }
}

// Verificar si el Usuario Existe por ID
const userExist = async (id = '') => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error('User does not exist');
    }
}

// Validar JWT
const validateJWT = async(req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            msg: 'No token provided'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        
        // Obtener Usuario Autenticado
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                msg: 'User does not exist'
            });
        }
        // Verificar si el usuario esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'User is not active'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: 'Invalid token'
        });
    }
}

// Validar Rol Administrador
const validateRoleAdmin = async(req, res, next) => {
    if(!req.user){
        return res.status(401).json({
            msg: 'User does not exist'
        });
    }
    const { role } = req.user;
    if (role !== 'ADMIN') {
        return res.status(401).json({
            msg: 'You are not authorized to perform this action'
        });
    }
    next();
}

// Validar si tiene Rol
const hasRole = ( ...roles ) => {
    return (req, res, next) => {
        
        if(!req.user){
            return res.status(401).json({
                msg: 'User does not exist'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: 'You are not authorized to perform this action'
            });
        }

        next();
    }
}

module.exports = {
    validateUserItems,
    roleValidator,
    emailExist,
    userExist,
    validateJWT,
    validateRoleAdmin,
    hasRole
}
