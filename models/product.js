const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 0
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

module.exports = model('Product', ProductSchema);