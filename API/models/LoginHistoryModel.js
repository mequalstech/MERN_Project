const mongoose = require('mongoose');

const LoginHistory = new mongoose.Schema({
    user_id: {
        type: String,
        required: false
    },
    user_type: {
        type: String,
        required: false
    },
    employee_id: {
        type: String,
        required: false
    },
    employee_type: {
        type: String,
        required: false
    },
    log_type: {
        type: String,
        required: false
    },
    log_date: {
        type: String,
        required: false
    },
    devicetype: {
        type: String,
        required: false
    },
    browser: {
        type: String,
        required: false
    },
    ip: {
        type: String,
    },
    createdon: {
        type: String,
    }
}, {
    collection: 'ma_login_history'
});

module.exports = mongoose.model('ma_login_history', LoginHistory);