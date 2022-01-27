const mongoose = require('mongoose');

const Order = new mongoose.Schema({
    code: {
        type: String
    },
    partner_id: {
        type: Object
    },
    member_id: {
        type: Object
    },
    comments: {
        type: String
    },
    payment_type: {
        type: String
    },
    payment_status: {
        type: String
    },
    price: {
        type: String
    },
    is_offer_applied: {
        type: String
    },
    offer_id: {
        type: Object
    },
    offer_amount: {
        type: Number
    },
    discount_amount: {
        type: Number
    },
    final_price: {
        type: Number
    },
    order_details: {
        type: Array
    },
    order_history: {
        type: Array
    },
    order_status: {
        type: String
    },
    delivery_executive: {
        type: String
    },
    delivery_executive_id: {
        type: Object
    },
    order_address: {
        type: Object
    },
    address_id: {
        type: Object
    },
    address_name: {
        type: String
    },
    contact_no: {
        type: String
    },
    delivery_type: {
        type: Number
    },
    delivery_charge: {
        type: String
    },
    packing_charge: {
        type: String
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
    },
}, {
    collection: 'ma_order'
});

module.exports = mongoose.model('ma_order', Order);