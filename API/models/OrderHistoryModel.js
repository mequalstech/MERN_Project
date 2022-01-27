const mongoose = require('mongoose');

const OrderHistory = new mongoose.Schema({
    order_id: {
        type: Object
    },
    order_status: {
        type: String
    },
    description: {
        type: String
    },
    order_date: {
        type: Date
    },
    mode: {
        type: Number
    },
    createdon: {
        type: Date
    },
    createdby: {
        type: Object
    },
    status: {
        type: Number
    },
}, {
    collection: 'ma_order_history'
});

module.exports = mongoose.model('ma_order_history', OrderHistory);