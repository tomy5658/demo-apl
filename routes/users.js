const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');

// Routing
router.route('/register')
    .get(users.renderRegsterForm)
    .post(users.registerUser)

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)

router.get('/logout', users.logout);

module.exports = router;