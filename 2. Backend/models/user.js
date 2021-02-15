const mongoose = require('mongoose');
const unique_validator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const user = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, minlength: 5 },
    friends: [{ type: String }],
    active: { type: Boolean, required: true }
})

user.plugin(unique_validator);

module.exports = mongoose.model('User', user);