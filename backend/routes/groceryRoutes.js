const express = require("express");
const groceryController = require("./../controller/groceryController");
const reviewRoutes = require('./reviewRoutes');
const authController = require('./../controller/authController');
const router = express.Router();

router.use(express.json());

router
  .route("/")
  .get(groceryController.getAllGroceries)
router.post('/addGrocery', authController.protect, authController.restrictTo('admin'), groceryController.addGrocery);

router
  .route("/:id")
  .get(groceryController.getGrocery)
  .patch(authController.protect, authController.restrictTo('admin'),groceryController.updateGrocery)
  .delete(authController.protect, authController.restrictTo('admin'),groceryController.deleteGrocery);



router.use('/:itemId/reviews', reviewRoutes);

module.exports = router;
