const Review = require('../models/reviewSchema'); 
const Business = require('../models/businessSchema');
const User = require('../models/userSchema');

// Add a review for a specific business
const addReview=async (req, res) => {
    try {
     if(!req.body.review || !req.body.rating){
        return res.status(422).json({ error: 'review and rating both are required' });
     }
      const business = await Business.findById(req.params.id);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      const userId = req.userId;
      const user = await User.findById(userId)
      const user_name = user.FirstName + " " + user.LastName
     
      const review = new Review({   
        business_id: req.params.id,
        user_name: user_name,
        review: req.body.review,
        rating: req.body.rating,
      });
      await review.save();
      await business.updateReviewStats();
      res.status(201).json({review,success:true});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  
  // Get all reviews for a specific business
  const getAllReviews= async (req, res) => {
    try {
      const business = await Business.findById(req.params.id);
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      const reviews = await Review.find({ business_id: req.params.id });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Get a specific review by ID
  const getSpecificReview = async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });

    }
  }

  const getBusinessReviewsRatings = async (req, res) => {
    try {
      
      const business = await Business.findById(req.params.id);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.status(200).json({ success: true, review: business.numOfReviews, rating:business.rating });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

module.exports = {addReview,getSpecificReview,getAllReviews,getBusinessReviewsRatings}