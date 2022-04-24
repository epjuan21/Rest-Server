const { Router } = require('express');
const { check } = require('express-validator');
const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');
const { validateUserItems, roleValidator, emailExist, userExist, validateJWT, validateRoleAdmin, hasRole } = require('../middlewares/validations');

const router = Router();

router.get('/', userGet);
router.post('/', [
    check('name', 'Invalid Name').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('email').custom(emailExist),
    check('password', 'Invalid Password').isLength({ min: 6 }),
    check('role').custom(roleValidator),
    validateUserItems
], userPost);
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userExist),
    check('role').custom(roleValidator),
    validateUserItems
], userPut);
router.patch('/:id', userPatch);
router.delete('/:id', [
    validateJWT,
    // validateRoleAdmin,
    hasRole('ADMIN','USER'),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userExist),
    validateUserItems
], userDelete);

module.exports = router;