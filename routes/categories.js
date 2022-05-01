const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, updateCategory, getCategory, deleteCategory } = require('../controllers/categories');
const { validateJWT, validateUserItems, categoryExist, validateRoleAdmin } = require('../middlewares/validations');

const router = Router();

// Obtener Todas las categorias - Publico
router.get('/', getCategories);

// Obtener una categoria por id - Publico
router.get('/:id',[
    check('id').isMongoId().withMessage('id is not a valid id'),
    check('id').custom(categoryExist).withMessage('Category not found'),
    validateUserItems,
], getCategory);

// Crear una categoria - Privado - Cualquier Persona con un Token Valido
router.post('/', [
    validateJWT, 
    check('name', 'Name is required').not().isEmpty(),
    validateUserItems
], createCategory);

// Actualizar una categoria por id - Privado - Cualquier Persona con un Token Valido
router.put('/:id', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('id').custom(categoryExist).withMessage('Category not found'),
    validateUserItems
], updateCategory);

// Eliminar una categoria por id - Privado - Solo Administrador
router.delete('/:id', [
    validateJWT,
    validateRoleAdmin,
    check('id').isMongoId().withMessage('id is not a valid id'),
    check('id').custom(categoryExist).withMessage('Category not found'),
    validateUserItems
],deleteCategory);

module.exports = router;