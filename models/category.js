const { Schema, model} = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'status is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'user is required']
    }
}, {
    timestamps: true
});

module.exports = model('Category', CategorySchema);