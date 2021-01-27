const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversation = new Schema({
    conversation_name: { type: String, required: true },
    date_created: { type: Date, required: true },
    users: [],
    latest_message_date: { type: Date },
})

module.exports = mongoose.model('Conversation', conversation);