const express = require('express');
const authController = require('../../controllers/ejs/auth.controller');
const Auth = require('../../middleware/EjsAuthCheck');
const UserOnly = require('../../middleware/UserOnly');
const AdminOnly = require('../../middleware/AdminOnly');
const router = express.Router();

// for welcome page 
router.get('/index', authController.getWelcomePage);
// for getting login page
router.get('/', authController.getLoginPage);

// for getting register page
router.get('/register', authController.getRegisterPage);

// post method for registering new user
router.post('/sign-up/create', authController.registerUser);

// post method for login user
router.post('/login/authenticate', authController.loginUser);


// // get method for user dashboard
// router.get('/user-dashboard', Auth, UserOnly, authController.checkAuth, authController.getUserDashboardPage);

// get route for user logout
router.get('/logout', authController.logoutUser);

// get route for admin logout
router.get('/admin/logout', authController.logoutAdmin);

module.exports = router;