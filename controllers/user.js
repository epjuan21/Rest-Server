const bcrypt = require('bcrypt');
const User = require('../models/user');

const userGet = async (req, res) => {

    const { limit = 10, skip = 0 } = req.query;

    const [total, users] = await Promise.all([
        User.countDocuments({ status: true }),
        User.find({ status: true })
            .skip(Number(skip))
            .limit(Number(limit))
    ])

    res.status(200).json({ total, users });
}

const userPost = async (req, res) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.status(201).json({
        body: user
    });
}

const userPut = async (req, res) => {

    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto, { new: true });

    res.status(400).json({
        body: user
    });
}

const userPatch = (req, res) => {
    res.status(400).json({
        message: 'PATCH API Controller'
    });
}

const userDelete = async (req, res) => {

    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(202).json({
        user
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}