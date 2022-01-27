const mongoose = require('mongoose');

const Gst = new mongoose.Schema({
    gstname: {
        type: String,
        required: false
    },
    cgst: {
        type: String,
        required: false
    },
    sgst: {
        type: String,
        required: false
    },
    igst: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    createdon: {
        type: Date,
    },
    updatedon: {
        type: Date,
    }
}, {
    collection: 'ma_gst'
});

module.exports = mongoose.model('ma_gst', Gst);