const express = require('express');
const routes = express.Router();

const { signinPage, signupPage, signupUser, signinUser, logout, forgotPasswordPage, recoveryCheck, forgotPasswordOtpPage, userOtp, newPasswordPage, newPassword } = require('../controllers/AuthController');

const passport = require('passport');

routes.get('/', signinPage);
routes.get('/signup', signupPage);
routes.post('/signupuser', signupUser);
routes.post('/signinuser', passport.authenticate('local', { failureRedirect: '/' }), signinUser);
routes.get('/logout', logout);

// forgotpassword start
routes.get('/forgotpassword', forgotPasswordPage);
routes.post('/recoverycheck', recoveryCheck);
routes.get('/forgot_password_otp', forgotPasswordOtpPage);
routes.post('/userotp', userOtp);
routes.get('/new_password', newPasswordPage);
routes.post('/newpassword', newPassword);
// forgotpassword end

module.exports = routes;