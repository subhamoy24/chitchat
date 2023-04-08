const express = require("express");
const { registerUser, authUser, allUsers } = require("../controller/userController");
const router = express.Router();
router.route("/").post(registerUser);
router.route("/list").get(allUsers);
router.route("/login").post(authUser);

module.exports = router;

