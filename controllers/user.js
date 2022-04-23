const { response } = require('express');

const userGet = (req, res = response) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        message: 'Get API Controller',
        q, nombre, apikey
    });
}

const userPost = (req, res = response) => {
    res.status(201).json({
        message: 'POST API Controller',
        body: req.body
    });
}

const userPut = (req, res = response) => {

    const id = req.params.id;

    res.status(400).json({
        message: 'PUT API Controller',
        id
    });
}

const userPatch = (req, res = response) => {
    res.status(400).json({
        message: 'PATCH API Controller'
    });
}

const userDelete = (req, res = response) => {
    res.json({
        message: 'DELETE API Controller'
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}