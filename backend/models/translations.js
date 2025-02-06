/* eslint-disable no-undef */
const mongoose = require('mongoose');

const TransSchema = new mongoose.Schema({
    tags: [String],
    key: String,
    vfr: String,
    ven: String,
    var: String,
    status: {
        type: String,
        enum: ['new', 'valid', 'invalid'],
        default: 'new'
    },
    publish: {
        type: String,
        enum: ['published', 'not published'],
        default: 'not published'
    },
    app_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apps'
    }
}, {
    timestamps: true
});

const TransModel = mongoose.model('translations', TransSchema);
module.exports = TransModel;