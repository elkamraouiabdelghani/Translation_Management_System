/* eslint-disable no-undef */
const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    po_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

const DeveloperModel = mongoose.model('developers', DeveloperSchema);
module.exports = DeveloperModel;