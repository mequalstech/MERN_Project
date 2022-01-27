const mongoose = require('mongoose');

const UserType = new mongoose.Schema({
    type: {
        type: String,
    },
    companyid: {
        type: String,
    },
    status: {
        type: String,
    },
    createdby: {
        type: String
    },
    createdon: {
        type: Date,
    },
    updatedby: {
        type: String
    },
    updatedon: {
        type: Date
    },
}, {
    collection: 'ma_user_type'
});

module.exports = mongoose.model('ma_user_type', UserType);