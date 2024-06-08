const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    forgotPassword
} = require("../Controllers/authController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);

module.exports = router;