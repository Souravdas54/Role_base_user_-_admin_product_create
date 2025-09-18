const express = require('express');
const Auth = require('../../middleware/EjsAuthCheck');
const authController = require('../../controllers/ejs/auth.controller');
const userController = require('../../controllers/ejs/user.controller');
const UserOnly = require('../../middleware/UserOnly');
const router = express.Router();

// get method for user dashboard
// get method for user dashboard and product sorting category wise
router.get('/user-dashboard', Auth, UserOnly, authController.checkAuth, userController.getUserDashboardPageAndAllProducts);


module.exports = router;