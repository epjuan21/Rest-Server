const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const coleccionesPermitidas = ['users', 'products', 'categories'];

const searchUsers = async( term = '', res) => {

    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const user = await User.findById(term);
        if(user) {
            res.json({
                results: ( user ) ? [user] : [],
            });
        } else {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
    }
    const regex = new RegExp(term, 'i');
    const users = await User.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    })
    res.json({
        results: ( users ) ? users : [],
    });
}

const searchCategory = async( term = '', res) => {
    
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const category = await Category.findById(term);
        if(category) {
            res.json({
                results: ( category ) ? [category] : [],
            });
        } else {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la categoria'
            });
        }
    }
    const regex = new RegExp(term, 'i');
    const categories = await Category.find({ name: regex, status: true });
    res.json({
        results: ( categories ) ? categories : [],
    });
}

const searchProducts = async( term = '', res) => {

    const isMongoId = ObjectId.isValid(term);
    if(isMongoId) {
        const product = await Product.findById(term).populate('category','name');
        if(product) {
            res.json({
                results: ( product ) ? [product] : [],
            });
        } else {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto'
            });
        }
    }
    const regex = new RegExp(term, 'i');
    const products = await Product.find({ name: regex, status: true }).populate('category','name');
    res.json({
        results: ( products ) ? products : [],
    });
}

const search = (req, res) => {

    const { collection, term } = req.params;

    if (!coleccionesPermitidas.includes(collection)) {
        return res.status(400).json({
            ok: false,
            msg: 'Colección no permitida'
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'categories':
            searchCategory(term, res);
            break;
        default:
            res.status(500).json({
                ok: false,
                msg: 'Error al buscar'
            });
    }

}

module.exports = {
    search
}
