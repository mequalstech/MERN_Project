const mongoose = require('mongoose');

const Address = new mongoose.Schema({
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    status: {
        type: String,
    },
    landmark: {
        type: String,
    },
    pincode: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    address_type: {
        type: String,
    },
    member_id: {
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
    collection: 'ma_address'
});

module.exports = mongoose.model('ma_address', Address);