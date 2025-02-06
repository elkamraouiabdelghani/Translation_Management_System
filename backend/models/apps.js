/* eslint-disable no-undef */
const mongoose = require('mongoose');

const AppsSchema = new mongoose.Schema({
    appname: String,
    po_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users'
    }
}, {
    timestamps: true
});

const AppModel = mongoose.model('apps', AppsSchema);
module.exports = AppModel;