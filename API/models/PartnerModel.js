const mongoose = require('mongoose');

const Partner = new mongoose.Schema({
    user_id: {
        type: Object
    },
    code: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    mobile: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    gsttype: {
        type: Number,
        required: false
    },
    gstno: {
        type: String,
        required: false
    },
    category: {
        type: Array
    },
    address1: {
        type: String,
        required: false
    },
    address2: {
        type: String,
        required: false
    },
    pincode: {
        type: Number,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    ava_prep_time: {
        type: Number,
        required: false
    },
    lunch_prep_time: {
        type: Number,
        required: false
    },
    dinner_prep_time: {
        type: Number,
        required: false
    },
    lunch_days: {
        type: Array,
        required: false
    },
    dinner_days: {
        type: Array,
        required: false
    },
    lunch_ftime: {
        type: String,
        required: false
    },
    dinner_ftime: {
        type: String,
        required: false
    },
    lunch_ttime: {
        type: String,
        required: false
    },
    dinner_ttime: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false
    },
    createdby: {
        type: Object,
        required: false
    },
    createdon: {
        type: Date,
        required: false
    },
    updatedby: {
        type: Object,
        required: false
    },
    updatedon: {
        type: Date,
        required: false
    },
}, {
    collection: 'ma_partner'
});

module.exports = mongoose.model('ma_partner', Partner);