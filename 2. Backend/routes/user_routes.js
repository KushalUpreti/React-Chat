const express = require('express');
const { check, query } = require('express-validator');
const userController = require('../controllers/user_controller');
const router = express.Router();
const dotenv = require('dotenv');
const authCheck = require('../middlewares/auth-check');
dotenv.config();

router.post("/signup", [
    check('username').not().isEmpty(),
    check('email').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty(),
    check('password').isLength({ min: 5 })], userController.signup);

router.post("/login", [
    check('email').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty(),
    check('password').isLength({ min: 5 })], userController.login);

router.use(authCheck);

router.post("/addOrRemoveFriend", userController.addFriend);

router.post("/createConversation", userController.createGroup);

router.get("/getAllConversations/:id", userController.getAllConversations);

router.post("/addMessage", [
    check('message').not().isEmpty(),
    check('message').isLength({ min: 1 })
], userController.addMessageToConversation);

router.get("/allMessages/:convId", userController.getMessages);

router.get("/searchUsers/:query", userController.searchUsers);

router.get("/getAllActiveUsers/:userId", userController.getAllActiveUsers);

router.post("/deleteAllMessages", userController.deleteAllMessages);

router.post("/unfriendUser", userController.unfriendUser);

router.post("/createGroup", [
    check('conversation_name').isLength({ min: 3 }),
    check('admin_id').not().isEmpty(),
], userController.createGroup);

router.get("/getAllFriends", userController.getAllFriends);

router.post("/deleteGroup", [check('conversation_id').not().isEmpty()], userController.deleteGroup);

router.post("/leaveGroup", [check('conversation_id').not().isEmpty()], userController.leaveGroup);

router.get("/loadMoreMessages", [
    query('conversation_id').not().isEmpty(),
    query('oldest_date').not().isEmpty()],
    userController.loadMoreMessages);

router.post("/deleteOneMessage", [check('message_id').not().isEmpty()], userController.deleteOneMessage);

module.exports = router;
