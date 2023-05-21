const express = require("express");
const { accessChat, chatDetails, userChats, viewChat, createGroup} = require("../controller/chatController");
const router = express.Router();
router.route("/").post(accessChat);
router.route("/group").post(createGroup);

router.route("/details").get(chatDetails);
router.route("/user-chats").get(userChats);
router.route("/view-chat").get(viewChat);




module.exports = router;

