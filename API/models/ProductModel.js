const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    name: {
        type: String,
    },
    category: {
        type: Array,
    },
    subcategory: {
        type: Array,
    },
    images: {
        type: Array,
    },
    description: {
        type: String,
    },
    type: {
        type: Number,
    },
    price: {
        type: String,
    },
    packing_cost: {
        type: String,
    },
    tax: {
        type: String,
    },
    taxvalue: {
        type: String,
    },
    totalprice: {
        type: String,
    },
    min_qty: {
        type: Number,
    },
    unit: {
        type: String,
    },
    is_inventory: {
        type: Number,
    },
    tracking: {
        type: Boolean,
    },
    minstock: {
        type: String,
    },
    variant: {
        type: Array,
    },
    createdon: {
        type: Date
    },
    createdby: {
        type: Object
    },
    updatedon: {
        type: Date
    },
    updatedby: {
        type: Object
    },
    status: {
        type: Number
    }
}, {
    collection: 'ma_product'
});

module.exports = mongoose.model('ma_product', Product);