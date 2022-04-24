const { generateToken } = require("../helpers/generateJWT");
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

module.exports = {
    login
}