const path = require('path');
const express = require('express');
const reviewController = require('../../controllers/reviews');
const isAuthenticatedUser= require('../../middleware/authenticate')
const isAuthorizedUser= require('../../middleware/authorize')
const router = express.Router();

router.post('/business/:id/review',isAuthenticatedUser, isAuthorizedUser('user'),reviewController.addReview)
router.get('/business/:id/review',reviewController.getAllReviews)
router.get('/business/:id/reviewsratings',reviewController.getBusinessReviewsRatings)

module.exports = router;