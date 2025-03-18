const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares.js');
// const isLoggedIn = require("../middlewares.js");

const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.signUp)
    .post(wrapAsync(userController.signUpPost))

router.route("/login")
    .get(userController.logIn)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.logInPost))
 
router.get("/logout", wrapAsync(userController.logOut));

module.exports = router;