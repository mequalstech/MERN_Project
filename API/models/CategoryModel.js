const mongoose = require('mongoose');

const Category = new mongoose.Schema({
    category: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    sequence: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: false
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
    collection: 'ma_category'
});

module.exports = mongoose.model('ma_category', Category);