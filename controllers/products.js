const { Product } = require('../models');

// Obtener todos los productos - Paginado
const getProducts = async(req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const query = { status: true}
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query, {name: 1, user: 1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec()
    ])
    res.status(200).json({
        total,
        products
    });
}

// Obtener Un Producto por Id
const getProduct = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec();
    res.status(200).json(product);
}

// Crear un producto
const createProduct = async(req, res) => {
    const { status, user, ...body } = req.body;
    // Verificar si existe un producto con el mismo nombre
    const name = req.body.name.toUpperCase();
    const productDB = await Product.findOne({ name });
    if (productDB) {
        return res.status(400).json({
            ok: false,
            msg: 'Product already exists'
        });
    }

    // Crear el producto
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json({
        ok: true,
        product
    })
}

// Actualizar un producto
const updateProduct = async(req, res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;
    if(!data.name) {
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(product);
}

// Eliminar un producto
const deleteProduct = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
    res.status(200).json(product);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}