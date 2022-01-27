const mongoose = require('mongoose');

const Banner = new mongoose.Schema({
    partnerid: {
        type: Object,
        required: false
    },
    banner_location: {
        type: String,
        required: false
    },
    banner_sublocation: {
        type: String,
        required: false
    },
    mode: {
        type: Number,
    },
    category: {
        type: Object,
    },
    partner: {
        type: Object,
    },
    product: {
        type: Object,
    },
    sequence: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
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
    collection: 'ma_banner'
});

module.exports = mongoose.model('ma_banner', Banner);