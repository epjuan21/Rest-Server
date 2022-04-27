const { json } = require("express/lib/response");
const { generateToken } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/googleVerify");
const User = require("../models/user");

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Email or password incorrect'
            });
        }

        // Validar si el usuario esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'User is not active'
            });
        }

        // Verificar si el password es correcto
        const validPassword = await User.comparePassword(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Email or password incorrect'
            });
        }

        // Generar el JWT
        const token = await generateToken(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Invalid request'
        });
    }
}

const googleSignIn = async (req, res) => {
    
    const { id_token } = req.body;

    try {

        const { name, avatar, email } = await googleVerify(id_token);
        
        let usuario = await User.findOne({ email });

        if (!usuario) {
            const data = {
                name,
                email,
                avatar,
                password: ':)',
                google: true,
            }

            usuario = new User(data);
            await usuario.save();
        }

        // Si el usuario esta inactivo
        if (!usuario.status) {
            return res.status(400).json({
                msg: 'User is not active'
            });
        }

        // Generar el JWT
        const token = await generateToken(usuario.id);

        res.json({
            msg: 'Sign in successfully',
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            error: 'Invalid token'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}