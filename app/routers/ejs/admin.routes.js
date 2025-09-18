const express = require('express');
const adminController = require('../../controllers/ejs/admin.controller');
const Auth = require('../../middleware/EjsAuthCheck');
const AdminOnly = require('../../middleware/AdminOnly');
const authController = require('../../controllers/ejs/auth.controller');
const router = express.Router();

// get method for admin dashboard create category page
router.get('/admin-dashboard/category', Auth, AdminOnly, authController.checkAuth, adminController.getCategoryPage);

// post method for create category page
router.post('/create-category', Auth, AdminOnly, authController.checkAuth, adminController.createCategory);

// Edit category
router.post("/edit-category/:id", Auth, AdminOnly, authController.checkAuth, adminController.editCategory);

// delete category
router.get('/delete-category/:id', Auth, AdminOnly, authController.checkAuth, adminController.deleteCategory);

// get method for admin dashboard create product page
router.get('/admin-dashboard/create-product', Auth, AdminOnly, authController.checkAuth, adminController.getCreateProductPage);

// post method for admin dashboard create product
router.post('/create-product', Auth, AdminOnly, authController.checkAuth, adminController.createProduct);

// get method for admin dashboard all products page
router.get('/admin-dashboard', Auth, AdminOnly, authController.checkAuth, adminController.getAdminDashboardPage);

// get method for admin dashboard edit product page
router.get('/admin-dashboard/edit-product/:id', Auth, AdminOnly, authController.checkAuth, adminController.getEditProductPage);

// post method for admin dashboard update product
router.post('/products/update/:id', Auth, AdminOnly, authController.checkAuth, adminController.updateProduct);

// get method for admin dashboard delete product
router.get('/admin-dashboard/delete-product/:id', Auth, AdminOnly, authController.checkAuth, adminController.deleteProduct);


module.exports = router;