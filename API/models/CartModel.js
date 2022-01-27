const mongoose = require('mongoose');

const Cart = new mongoose.Schema({
    member_id: {
        type: Object
    },
    partner_id: {
        type: Object
    },
    product_details: {
        type: Array
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
    collection: 'ma_cart'
})

module.exports = mongoose.model('ma_cart', Cart)