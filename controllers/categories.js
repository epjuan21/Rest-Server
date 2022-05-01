const { Category } = require('../models');

// Obtener todas las categorias - Paginado
const getCategories = async(req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const query = { status: true}
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query, {name: 1, user: 1})
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .exec()
    ])

    res.status(200).json({
        total,
        categories
    });
}

// Obtener Una Categoria por Id
const getCategory = async(req, res) => {

    const { id } = req.params;
    const category = await Category.findById(id)
        .populate('user', 'name email')
        .exec();
    res.status(200).json(category);
}

// Crear una categoria
const createCategory = async(req, res) => {
    const name = req.body.name.toUpperCase();
    // Verificar si existe una categoria con el mismo nombre
    const categoryDB = await Category.findOne({ name });
    if (categoryDB) {
        return res.status(400).json({
            ok: false,
            msg: 'Category already exists'
        });
    }
    
    // Crear la categoria
    const data = {
        name,
        user: req.user._id
    }
    
    const category = new Category(data);
    await category.save();

    res.status(201).json({
        ok: true,
        category
    })
}

// Actualizar Categoria
const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;
    
    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json({
        category
    })
}

// Eliminar Categoria
const deleteCategory = async(req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(201).json({
        category
    })

}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}