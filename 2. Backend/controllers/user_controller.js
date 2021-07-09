const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cryptoEncrypt = require("../models/crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Messaage = require("../models/message");

dotenv.config();

async function signup(req, res, next) {
    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
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
        console.log(err);
        const error = new HttpError(
            "Could not create user, please try again.",
            500
        );
        return next(error);
    }

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        active: true,
        friends: [],
    });

    try {
        await newUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Signing up failed, please try again later.",
            500
        );
        return next(error);
    }
    const token = jwt.sign(
        { user_id: newUser.id, username: newUser.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2 days" }
    );
    res.status(200).json({
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        token,
    });
}

// Login function
async function login(req, res, next) {
    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        userData = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Logging in failed, please try again later.",
            500
        );
        return next(error);
    }

    if (!userData) {
        const error = new HttpError("Not an existing user. Please try again", 403);
        return next(error);
    }

    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
        const error = new HttpError(
            "Password did not match. Please try again",
            403
        );
        return next(error);
    }

    const token = jwt.sign(
        { user_id: userData.id, username: userData.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2 days" }
    );
    res.status(200).json({
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        token,
    });
}

async function addFriend(req, res, next) {
    const userId = req.userData.userId;
    const friendId = req.body.friendId;

    if (userId === friendId) {
        return next(
            new HttpError("Invalid request. Can't be friend with oneself", 400)
        );
    }

    let user;
    try {
        user = await User.findById(userId);
        const search = user.friends.find((item) => {
            return item === friendId;
        });
        if (search !== undefined) {
            console.log("already friend");
            return next(new HttpError("Already friend with that person", 409));
        }
    } catch (error) {
        return next(new HttpError("Internal error while finding the user", 500));
    }
    if (!user) {
        return next(new HttpError("No user of that id found", 404));
    }

    let friend;
    try {
        friend = await User.findById(friendId);
    } catch (error) {
        return next(new HttpError("Internal error while finding the friend", 500));
    }
    if (!friend) {
        return next(new HttpError("No user of that id found", 404));
    }

    try {
        user.friends.push(friendId);
        user.save();

        friend.friends.push(userId);
        friend.save();
        message = "Friend added";
    } catch (error) {
        return next(new HttpError("Error while adding friend. Try again", 500));
    }

    let conversation_name = user.username + " " + friend.username;
    const users = [userId, friendId];
    const admin = userId;
    //TODO Fix weak code below that might send headers twice.
    const newConversation = await createConvo(
        conversation_name,
        users,
        admin,
        next,
        "One"
    );
    res.status(200).json(newConversation);
}

async function createGroup(req, res, next) {
    const conversation_name = req.body.conversation_name;
    const admin_id = req.userData.userId;
    const users = req.body.users; //id of all users in the conversation.
    users.push(admin_id);

    const returnedVal = createConvo(conversation_name, users, admin_id, next, "Group");
    returnedVal.then(item => {
        if (item !== undefined) {
            res.json(item);
        }
    });
}

async function createConvo(conversation_name, users, admin, next, type) {
    const newUsers = users.map((item) => {
        return { user_id: item };
    });

    const query = await Conversation.find({ users: newUsers });
    if (query.length != 0) {
        return next(new HttpError("The conversation already exists", 409));
    }

    const newConvo = new Conversation({
        conversation_name,
        date_created: new Date(),
        users: newUsers,
        latest_message_date: new Date(),
        latest_message: "Say Hi..",
        type,
        admin: admin,
    });
    try {
        await newConvo.save();
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Error while creating conversation. Try again", 500)
        );
    }
    return newConvo;
}

async function getAllConversations(req, res, next) {
    const id = req.params.id;
    let user;
    try {
        user = await Conversation.find({
            users: { $elemMatch: { user_id: id } },
        }).sort({ latest_message_date: -1 });
    } catch (error) {
        return next(
            new HttpError("Error while getting conversations. Try again", 500)
        );
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
    let actualMsg = message;
    if (actualMsg.length > 25) {
        actualMsg = actualMsg.slice(0, 25) + "...";
    }

    const conversation_id = req.body.conversation_id;
    const sent_by = mongoose.Types.ObjectId(req.body.sent_by);

    try {
        message = await cryptoEncrypt.encrypt(message);
    } catch (error) {
        return next(new HttpError("Internal error", 500));
    }

    const date = new Date();
    const newMessage = new Messaage({
        message,
        sent_date: date,
        sent_by,
        conversation_id,
    });

    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(conversation_id, {
            latest_message_date: date,
            latest_message: actualMsg,
        });
    } catch (error) {
        return next(new HttpError("Error while saving message. Try again", 500));
    }
    res.status(200).json({ message: "Message added" });
}

async function getMessages(req, res, next) {
    const conversation_id = req.params.convId;

    let messages;
    try {
        messages = await Messaage.find({ conversation_id })
            .sort({ sent_date: -1 })
            .limit(30);
    } catch (error) {
        return next(new HttpError("Error while saving message. Try again", 500));
    }
    if (messages.length === 0) {
        res.status(200).json({});
        return;
    }
    let newMessages = await decryptMessage(messages);
    res.status(200).json(newMessages.reverse());
}

async function extractUserName(userId) {
    let user;
    try {
        user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    } catch (error) {
        console.log(error);
    }
    return user;
}

async function searchUsers(req, res, next) {
    if (req.params.query.length === 0) {
        return next(new HttpError("Invalid search query", 400));
    }

    const searchQuery = req.params.query;
    let regex;
    try {
        regex = new RegExp(".*" + searchQuery + ".*", "i");
    } catch (error) {
        return next(new HttpError("Invalid search query", 400));
    }

    let searchResult;
    try {
        searchResult = await User.find({ username: regex }).limit(7);
    } catch (error) {
        return next(new HttpError("Error while getting query. Try again", 500));
    }
    const filteredResult = searchResult.map((item) => {
        return {
            _id: item._id,
            username: item.username,
            initials: item.username.charAt(0),
        };
    });
    res.json(filteredResult);
}

async function getAllActiveUsers(req, res, next) {
    const userId = req.params.userId;
    let user;
    try {
        user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    } catch (error) {
        return next(new HttpError("Error while getting user. Try again", 500));
    }

    let activeFriends = [];

    for (let index = 0; index < user.friends.length; index++) {
        const recipient = user.friends[index];

        let friend;
        try {
            friend = await User.findOne({ _id: mongoose.Types.ObjectId(recipient) });
        } catch (error) {
            console.log(error);
        }
        if (friend.active === true) {
            const friendObj = {
                id: friend._id,
                username: friend.username,
                initials: friend.username.charAt(0),
            };
            activeFriends.push(friendObj);
        }
    }
    res.json(activeFriends);
}

async function deleteAllMessages(req, res, next) {
    const conversation_id = req.body.conversation_id;
    const userId = req.userData.userId;
    let conv;
    try {
        conv = await Conversation.find({
            users: { $elemMatch: { user_id: userId } },
            _id: conversation_id,
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Internal error. Try again", 500));
    }
    try {
        await Messaage.deleteMany({
            conversation_id: mongoose.Types.ObjectId(conversation_id),
        });
    } catch (error) {
        return next(new HttpError("Error while deleting messages. Try again", 500));
    }
    conv.latest_message = "Say Hi to your new friend";
    res.status(200).json({ message: "Messages deleted" });
}

async function unfriendUser(req, res, next) {
    const conversation_id = req.body.conversation_id;
    const userId = req.userData.userId;
    const friendId = req.body.friendId;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new HttpError("Internal error while finding the user", 500));
    }

    let friend;
    try {
        friend = await User.findById(friendId);
    } catch (error) {
        return next(new HttpError("Internal error while finding the friend", 500));
    }

    try {
        user.friends.pull(friendId);
        user.save();

        friend.friends.pull(userId);
        friend.save();
    } catch (error) {
        return next(new HttpError("Error while deleting friend. Try again", 500));
    }

    try {
        await Messaage.deleteMany({
            conversation_id: mongoose.Types.ObjectId(conversation_id),
        });
    } catch (error) {
        return next(new HttpError("Error while deleting messages. Try again", 500));
    }
    try {
        await Conversation.deleteOne({
            _id: mongoose.Types.ObjectId(conversation_id),
        });
    } catch (error) {
        return next(
            new HttpError("Error while deleting conversation. Try again", 500)
        );
    }

    res.status(200).json({ message: "User unfriended." });
}

async function activeStatus(userId, socket, emit, active) {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    user.friends.forEach((recipient) => {
        socket.broadcast.to(recipient).emit(emit, {
            id: user._id,
            username: user.username,
            initials: user.username.charAt(0),
        });
    });
    await User.updateOne(
        { _id: mongoose.Types.ObjectId(userId) },
        { active: active }
    );
}

const getAllFriends = async (req, res, next) => {
    const userId = req.userData.userId;
    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new HttpError("Internal error while finding the user", 500));
    }

    const friendArray = [...user.friends];
    const friendObject = [];

    for (let i = 0; i < friendArray.length; i++) {
        let friend;
        try {
            friend = await User.findById(friendArray[i]);
        } catch (error) {
            return next(new HttpError("Internal error while finding the user", 500));
        }
        const newObj = { ...friend._doc };
        friendObject.push({ username: newObj.username, id: newObj._id });
    }
    res.json(friendObject);
}

const deleteGroup = async (req, res, next) => {
    const conversation_id = req.body.conversation_id;
    const userId = req.userData.userId;

    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    let conv;
    try {
        conv = await Conversation.find({
            _id: conversation_id,
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error finding the group. Try again", 500));
    }
    if (userId !== conv[0].admin + "") {
        return next(new HttpError("Group admin privileges not found.", 401));
    }
    try {
        await Messaage.deleteMany({
            conversation_id: mongoose.Types.ObjectId(conversation_id),
        });
    } catch (error) {
        return next(new HttpError("Error while deleting messages. Try again", 500));
    }
    try {
        await Conversation.deleteOne({
            _id: mongoose.Types.ObjectId(conversation_id),
        });
    } catch (error) {
        return next(
            new HttpError("Error while deleting group. Try again", 500)
        );
    }
    res.status(200).json({ message: "Group deleted." });
}

const leaveGroup = async (req, res, next) => {
    const conversation_id = req.body.conversation_id;
    const userId = req.userData.userId;

    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    let conv;
    try {
        conv = await Conversation.find({
            users: { $elemMatch: { user_id: userId } },
            _id: conversation_id,
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error finding the group. Try again", 500));
    }
    if (conv.length === 0) {
        return next(new HttpError("You are not part of this group.", 403));
    }

    conv[0].users.pull({ user_id: userId });
    conv[0].save();
    if (userId === conv[0].admin + "") {
        conv[0].admin = conv[0].users[0].user_id;
    }
    res.status(200).json({ message: "Group left." });
}

const loadMoreMessages = async (req, res, next) => {
    const conversation_id = req.query.conversation_id;
    const oldest_date = req.query.oldest_date;
    const userId = req.userData.userId;

    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    let conv;
    try {
        conv = await Conversation.find({
            users: { $elemMatch: { user_id: userId } },
            _id: conversation_id,
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error finding the group. Try again", 500));
    }
    if (conv.length === 0) {
        return next(new HttpError("You are not part of this group.", 403));
    }
    let oldMessages = [];
    try {
        oldMessages = await Messaage.find({ conversation_id, sent_date: { $lt: new Date(oldest_date) } })
            .sort({ sent_date: -1 })
            .limit(30);
    } catch (error) {
        console.log(error);
        return next(new HttpError("Error fetching old messages. Try again", 500));
    }
    const messages = await decryptMessage(oldMessages);
    res.json(messages.reverse());
}

async function decryptMessage(encryptedMessages) {
    let newMessages = [];
    for (let i = 0; i < encryptedMessages.length; i++) {
        user = await extractUserName(encryptedMessages[i].sent_by);
        newMessages[i] = { ...encryptedMessages[i] }._doc;
        newMessages[i].username = user.username;
    }

    newMessages = newMessages.map((item) => {
        item.message = cryptoEncrypt.decrypt(item.message);
        return item;
    });
    return newMessages;
}

const deleteOneMessage = async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    const message_id = req.body.message_id;
    const userId = req.userData.userId;

    let message;
    try {
        message = await Messaage.find({ _id: mongoose.Types.ObjectId(message_id) });
    } catch (error) {
        return next(new HttpError("Error deleting message. Try again", 500));
    }

    if (String(message[0].sent_by) !== userId) {
        return next(new HttpError("Not authorized to delete message", 403));
    }

    try {
        await Messaage.deleteOne({ _id: mongoose.Types.ObjectId(message_id) });
    } catch (error) {
        return next(new HttpError("Error deleting message. Try again", 500));
    }
    res.json({ message: "Message deleted" });
}

exports.signup = signup;
exports.login = login;
exports.addFriend = addFriend;
exports.createGroup = createGroup;
exports.getAllConversations = getAllConversations;
exports.addMessageToConversation = addMessageToConversation;
exports.getMessages = getMessages;
exports.searchUsers = searchUsers;
exports.activeStatus = activeStatus;
exports.getAllActiveUsers = getAllActiveUsers;
exports.deleteAllMessages = deleteAllMessages;
exports.unfriendUser = unfriendUser;
exports.getAllFriends = getAllFriends;
exports.deleteGroup = deleteGroup;
exports.leaveGroup = leaveGroup;
exports.loadMoreMessages = loadMoreMessages;
exports.deleteOneMessage = deleteOneMessage;

