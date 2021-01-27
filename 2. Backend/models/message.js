const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    message: { type: String, minlength: 1, required: true },
    sent_date: { type: Date, required: true },
    sent_by: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    conversation_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Conversation' }
})

module.exports = mongoose.model('Message', message);