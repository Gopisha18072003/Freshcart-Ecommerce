const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const cartController = require('../controller/cartController');
const fileUpload = require('../utils/fileUploads');
const router = express.Router();

// Implementation done
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logOut);
router.route('/refresh').get(authController.refresh);
router.route('/updateimage').post(authController.protect, fileUpload.single('image'), authController.uploadImage);
router.route('/updateMe').patch(authController.protect, userController.updateUser);
router.get('/me', authController.protect, userController.getMe, userController.getUser);
router.patch('/updatepassword',authController.protect, authController.updatePassword);
router.patch('/updatepassword',authController.protect, authController.updatePassword);

router.post('/createCart', authController.protect, cartController.createCart)
router.get('/getCart', authController.protect, cartController.getCart)
router.patch('/updateCart', authController.protect, cartController.updateCart)
router.delete('/deleteCart', authController.protect, cartController.deleteCart)

router.route('/forgotpassword').post(authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);


router.get('/getAllUsers',authController.restrictTo(['admin']), userController.getAllUser);

router.get('/:id', userController.getUser);

// router.patch('/updateCart', authController.protect, userController.addItemToCart);
// router.post('/updateWishlist', authController.protect, userController.addItemToWishlist);

module.exports = router;