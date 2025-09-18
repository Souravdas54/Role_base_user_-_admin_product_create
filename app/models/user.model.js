const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        minlength: 5
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        maxlength: 15,
        minlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true,
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;