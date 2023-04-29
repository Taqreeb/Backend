const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  date_of_review:{
    type:Date,
    default: Date.now
}
});

const Review = mongoose.model('Review', reviewSchema);

module.exports =  Review;