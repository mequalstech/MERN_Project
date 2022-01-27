const mongoose = require('mongoose');

const Member = new mongoose.Schema({
    user_id: {
        type: Object,
    },
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    shopname: {
        type: String,
    },
    attachments: {
        type: Array
    },
    address: {
        type: Array
    },
    createdby: {
        type: Object,
    },
    createdon: {
        type: Date,
    },
    updatedby: {
        type: Object,
    },
    updatedon: {
        type: Date,
    },
    status: {
        type: Number
    }
}, {
    collection: 'ma_member'
});

module.exports = mongoose.model('ma_member', Member);