const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const router = express.Router();


router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.get('/me', authController.protect, userController.getMe, userController.getUser);

router.route('/forgotpassword').post(authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.patch('/updatepassword',authController.protect, authController.updatePassword);

router.get('/getAllUsers',authController.restrictTo(['admin']), userController.getAllUser);

router.get('/:id', userController.getUser);

// router.patch('/updateCart', authController.protect, userController.addItemToCart);
// router.post('/updateWishlist', authController.protect, userController.addItemToWishlist);

module.exports = router;