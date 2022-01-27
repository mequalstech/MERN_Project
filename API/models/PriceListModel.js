const mongoose = require('mongoose');

const PriceList = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    filename: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    createdby: {
        type: Object,
        required: false
    },
    updatedby: {
        type: Object,
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
    collection: 'ma_pricelist'
});

module.exports = mongoose.model('ma_pricelist', PriceList);