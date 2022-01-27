const mongoose = require('mongoose');

const Feedback = new mongoose.Schema({
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    feedback: {
        type: String
    },
    status: {
        type: Number
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },
    createdon: {
        type: Date,
    }
}, {
    collection: 'ma_feedback'
});

module.exports = mongoose.model('ma_feedback', Feedback);