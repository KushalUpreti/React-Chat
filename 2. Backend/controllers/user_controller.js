const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cryptoEncrypt = require('../models/crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Messaage = require('../models/message');

dotenv.config();

// Signup function
async function signup(req, res, next) {
    if (!validationResult(req).isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const check = await User.findOne({ email: email });
    if (check) {
        return next(new HttpError("User already exists", 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        friends: []
    })

    try {
        await newUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }
    res.status(200).json({ message: "Signed in" });
}


// Login function
async function login(req, res, next) {
    if (!validationResult(req).isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const email = req.body.email;
    const password = req.body.password;
    try {
        userData = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userData) {
        const error = new HttpError(
            'Not an existing user. Please try again',
            403
        );
        return next(error);
    }

    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
        const error = new HttpError(
            'Password did not match. Please try again',
            403
        );
        return next(error);
    }

    const token = jwt.sign({ user_id: userData.id, username: userData.username }, process.env.JWT_SECRET_KEY, { expiresIn: "2 days" });
    res.status(200).json({ user_id: userData.id, username: userData.username, email: userData.email, token });

}


// Add or remove a friend from the friend list
async function addOrRemoveFriend(req, res, next) {
    const userId = req.body.id;
    const friendId = req.body.friendId;
    const actionType = req.body.action;
    let message;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new HttpError("Internal error while finding the user", 500));
    }
    if (!user) {
        return next(new HttpError("No user of that id found", 404));
    }

    let friend;
    try {
        friend = await User.findById(friendId);
        console.log(friend.username);
    } catch (error) {
        return next(new HttpError("Internal error while finding the friend", 500));
    }
    if (!friend) {
        return next(new HttpError("No user of that id found", 404));
    }

    try {

        if (actionType === true) {
            await user.friends.push(friendId);
            // await User.updateOne({ id: userId }, { $push: { friends: friendId } });
            message = "Friend added";
        } else {
            await user.friends.pull(friendId);
            // await User.updateOne({ id: userId }, { $pull: { friends: friendId } });
            message = "Friend deleted";
        }

    } catch (error) {
        return next(new HttpError("Error while adding friend. Try again", 500));
    }

    res.status(200).json({ message });
}


async function createConversation(req, res, next) {
    const conversation_name = req.body.conversation_name;
    const users = req.body.users; //id of all users in the conversation.
    const latest_message_date = null;

    const newUsers = users.map((item) => {
        return { user_id: item };
    })

    const query = await Conversation.find({ users: newUsers });
    console.log(query);
    if (query.length != 0) {
        return next(new HttpError("The conversation already exists", 409));
    }

    const newConvo = new Conversation({
        conversation_name,
        date_created: new Date(),
        users: newUsers,
        latest_message_date
    })
    try {
        await newConvo.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error while creating conversation. Try again", 500));
    }
    res.status(200).json(newConvo);
}


async function getAllConversations(req, res, next) {
    const id = req.params.id;
    let user;
    try {
        user = await Conversation.find({ users: { $elemMatch: { user_id: id } } }).sort({ latest_message_date: -1 });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error while getting conversations. Try again", 500));
    }
    if (!user) {
        return next(new HttpError("No conversations found", 404));
    }
    res.status(200).json(user);
}


async function addMessageToConversation(req, res, next) {
    if (!validationResult(req).isEmpty()) {
        return next(new HttpError("Input error", 400));
    }

    let message = req.body.message;
    message = message.trim();
    const conversation_id = req.body.conversation_id;
    const sent_by = mongoose.Types.ObjectId(req.body.sent_by);

    try {
        message = await cryptoEncrypt.encrypt(message);
    } catch (error) {
        return next(new HttpError("Internal error", 500))
    }

    const date = new Date()
    const newMessage = new Messaage({
        message,
        sent_date: date,
        sent_by,
        conversation_id
    })

    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(conversation_id, { latest_message_date: date });
    } catch (error) {
        return next(new HttpError("Error while saving message. Try again", 500));
    }
    res.status(200).json({ message: "Message added" });
}


async function getMessages(req, res, next) {
    const conversation_id = req.body.conversation_id;
    let messages;
    try {
        messages = await Messaage.find({ conversation_id });
    } catch (error) {
        return next(new HttpError("Error while saving message. Try again", 500));
    }
}

exports.signup = signup;
exports.login = login;
exports.addOrRemoveFriend = addOrRemoveFriend;
exports.createConversation = createConversation;
exports.getAllConversations = getAllConversations;
exports.addMessageToConversation = addMessageToConversation;