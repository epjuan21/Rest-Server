const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'] 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['USER', 'ADMIN'],
    },
    status : {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Comparar Contraseñas
UserSchema.statics.comparePassword = async(password, recivedPassword) => {
    return await bcrypt.compareSync(password, recivedPassword);
}

UserSchema.methods.toJSON = function() {
    const { __v, _id, password, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);