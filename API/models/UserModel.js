const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    usertypeid: {
        type: Object
    },
    code: {
        type: String
    },
    mobile: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address1: {
        type: String,
        required: false
    },
    address2: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    og_password: {
        type: String,
        required: false
    },
    deviceid: {
        type: String
    },
    devicetype: {
        type: String
    },
    accesstoken: {
        type: String
    },
    devicetoken: {
        type: String
    },
    is_online: {
        type: Number
    },
    createdon: {
        type: Date,
        required: false
    },
    updatedon: {
        type: Date,
        required: false
    },
    status: {
        type: Number,
        required: false
    }
}, {
    collection: 'ma_user'
});

module.exports = mongoose.model('ma_user', User);