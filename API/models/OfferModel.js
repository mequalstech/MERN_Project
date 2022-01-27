const mongoose = require('mongoose');

const Offer = new mongoose.Schema({
    offercode: {
        type: String,
    },
    offertitle: {
        type: String,
    },
    description: {
        type: String,
    },
    offerdaysetting: {
        type: Array
    },
    offerapplysetting: {
        type: String
    },
    minordervalue: {
        type: Number,
    },
    maximumdiscount: {
        type: Number,
    },
    offertype: {
        type: Number,
    },
    offervalue: {
        type: String,
    },
    validitytype: {
        type: Number,
    },
    validitydate: {
        type: Date,
    },
    image: {
        type: String
    },
    offermode: {
        type: Number
    },
    partner: {
        type: Array
    },
    category: {
        type: Array
    },
    product: {
        type: Array
    },
    status: {
        type: Number,
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
    }
}, {
    collection: 'ma_offer'
});

module.exports = mongoose.model('ma_offer', Offer);