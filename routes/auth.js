const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateUserItems } = require('../middlewares/validations');

const router = Router();

router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateUserItems
], login);

router.post('/google', [
    check('id_token', 'Id_Token is required').not().isEmpty(),
    validateUserItems
], googleSignIn)

module.exports = router;