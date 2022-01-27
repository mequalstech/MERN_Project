const mongoose = require('mongoose');

const SubCategory = new mongoose.Schema({
    subcategory: {
        type: String,
        required: false
    },
    category_id: {
        type: Object,
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
    description: {
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
    collection: 'ma_subcategory'
});

module.exports = mongoose.model('ma_subcategory', SubCategory);