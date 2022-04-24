const { Schema, model } = require('mongoose');

const RoleSchemma = new Schema({
    role: {
        type: String,
        required: [true, 'Role is required']
    }
});

module.exports = model('Role', RoleSchemma);
