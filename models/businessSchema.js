const mongoose = require("mongoose");

// Define the Business schema
const businessSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  business_name: {
    type: String,
    required: true,
  },
  business_description:{
    type: String,
    required:true
  },
  business_phone_number: {
    type: String,
    required: true,
  },
  business_email: {
    type: String,
    required: true,
  },
  business_type: {
    type: String,
    required: true,
  },
  business_location: {
    type: String,
    required: true,
  },
  business_status: {
    type: String,
    default: "pending",
  },
  business_address: {
    type: String,
    required: true,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  estimated_price: {
    type: Number,
    required: true,
  },
  venue_persons_capacity: {
    type: Number,
  },
  venue_coverage_area: {
    type: Number,
  },
  booked_dates: [
    {
      type: String,
    },
  ],
  business_packages: {
    type: [
      {
        name: {
          type: String,    
        },
        description: {
          type: String,    
          default:""        
        },
        price: {
          type: Number,
        },
      },
    ],
  },

  business_facebook_url: {
    type: String,
  },
  business_instagram_url: {
    type: String,
  },
  business_youtube_url: {
    type: String,
  },
  business_display_picture: {
    type: String,
    required: true,
  },
  business_albums: {
    type: [
      {
        album_name: {
          type: String,
        },
        description: {
          type: String,
        },
        images: [
          {
          
            public_id:{
              type:String,
              required:true
            },
            url:{
              type:String,
              required:true
            }
       
          },
        ],
      },
    ],
    default: null,
  },
});

businessSchema.methods.updateReviewStats = async function() {
  const businessId = this._id;
  const Review = mongoose.model("Review");

  const result = await Review.aggregate([
    { $match: { business_id: businessId } },
    {
      $group: {
        _id: null,
        totalRating: { $sum: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    this.numOfReviews = result[0].count;
    this.rating = result[0].totalRating / result[0].count;
  } else {
    this.numOfReviews = 0;
    this.rating = 0;
  }

  return this.save();
};
const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
