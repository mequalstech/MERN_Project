const mongoose = require('mongoose');

const Otp = new mongoose.Schema({
    mobile: {
        type: Number,
        required: false
    },
    otp: {
        type: Number,
        required: false
    },
    otpstatus: {
        type: String,
        required: false
    },
    devicetype: {
        type: String,
        required: false
    },
    createdon: {
        type: Date,
    },
    updatedon: {
        type: Date,
    }
}, {
    collection: 'ma_otp'
});

module.exports = mongoose.model('ma_otp', Otp);