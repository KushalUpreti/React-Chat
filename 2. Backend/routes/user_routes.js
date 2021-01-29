const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user_controller');
const router = express.Router();

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

router.patch("/addOrRemoveFriend", userController.addOrRemoveFriend);

router.post("/createConversation", userController.createConversation);

router.get("/getAllConversations/:id", userController.getAllConversations);

router.post("/addMessage", [check('message').not().isEmpty(),
check('message').isLength({ min: 1 })], userController.addMessageToConversation);

router.get("/allMessages/:convId", userController.getMessages);


module.exports = router;