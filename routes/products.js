const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { validateUserItems, validateJWT, validateRoleAdmin, categoryExist, productExist } = require('../middlewares/validations');

const router = Router();

// Obtener todo los productos - Publico
router.get('/', getProducts);

// Obtener un producto por id - Publico
router.get('/:id',[
    check('id').isMongoId().withMessage('id is not a valid id'),
    check('id').custom(productExist).withMessage('Product not found'),
    validateUserItems,
], getProduct);

// Crear un Producto - Privado - Cualquier Persona con un Token Valido
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category','id is not a valid id').isMongoId(),
    check('category').custom(categoryExist),
    validateUserItems,
], createProduct);

// Actualizar un Producto por id - Privado - Cualquier Persona con un Token Valido
router.put('/:id', [
    validateJWT,
    check('id').custom(productExist).withMessage('Product not found'),
    validateUserItems
], updateProduct);

// Eliminar un Producto por id - Privado - Solo Administrador
router.delete('/:id', [
    validateJWT,
    validateRoleAdmin,
    check('id').isMongoId().withMessage('id is not a valid id'),
    check('id').custom(productExist).withMessage('Product not found'),
    validateUserItems
], deleteProduct);

module.exports = router;