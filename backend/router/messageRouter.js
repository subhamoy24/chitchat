const express = require("express");
const { createMessage, viewMessage } = require("../controller/messageController");
const router = express.Router();
router.route("/").post(createMessage);
router.route("/view-message").post(viewMessage);


module.exports = router;
