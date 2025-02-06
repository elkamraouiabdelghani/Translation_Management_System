/* eslint-disable no-undef */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'product owner', 'developer'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    secretkey: {
        type: String,
        required: () => {
            return this.role === 'admin' || this.role === 'product owner';
        }
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;