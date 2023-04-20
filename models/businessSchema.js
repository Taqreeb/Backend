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
    type: String,
  },
  venue_coverage_area: {
    type: String,
  },
  booked_dates: [
    {
      type: Date,
    },
  ],
  business_packages: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    default: null,
  },

  business_facebook_url: {
    type: String,
    default: "www.facebook.com",
  },
  business_instagram_url: {
    type: String,
    default: "www.instagram.com",
  },
  business_youtube_url: {
    type: String,
    default: "www.youtube.com",
  },
  business_display_picture:{
    type: String,
    required:true
  },
  business_albums: {
    type: [
      {
        album_id: {
          type: Number,
        },

        name: {
          type: String,
        },
        description: {
          type: String,
        },
        images: [
          {
            type: String,
          },
        ],
      },
    ],
    default: null,
  },
});

businessSchema.methods.updateReviewStats = () => {
  const businessId = this._id;
  const Review = mongoose.model("Review");

  return Review.aggregate([
    { $match: { business: businessId } },
    {
      $group: {
        _id: null,
        totalRating: { $sum: "$rating" },
        count: { $sum: 1 },
      },
    },
  ])
    .then((result) => {
      if (result.length > 0) {
        this.numOfReviews = result[0].count;
        this.averageRating = result[0].totalRating / result[0].count;
      } else {
        this.numOfReviews = 0;
        this.averageRating = 0;
      }

      return this.save();
    })
    .catch((err) => {
      throw err;
    });
};

const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
