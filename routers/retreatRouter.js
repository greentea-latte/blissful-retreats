const express = require('express');
const retreatController = require('./../controllers/retreatController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

router.use('/:retreatId/reviews', reviewRouter);

router
  .route('/')
  .get(retreatController.getAllRetreats)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    retreatController.createRetreat
  );

router
  .route('/:id')
  .get(retreatController.getRetreat)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    retreatController.updateRetreat
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    retreatController.deleteRetreat
  );

module.exports = router;
