const Business = require("../models/businessSchema");
const Review = require("../models/reviewSchema");
const cloudinary = require("../utils/cloudinary");
// Create a new business
const addBusiness = async (req, res) => {
  try {
    const {
      business_name,
      business_email,
      business_phone_number,
      business_type,
      business_location,
      business_address,
      estimated_price,
      venue_persons_capacity,
      venue_coverage_area,
      business_facebook_url,
      business_instagram_url,
      business_youtube_url,
      business_packages,
      business_albums,
      business_description,
      business_display_picture,
      booked_dates,
    } = req.body;

    if (
      !business_name ||
      !business_type ||
      !business_location ||
      !business_description ||
      !business_address ||
      !estimated_price ||
      !business_display_picture ||
      !booked_dates
    ) {
      return res.status(422).json({ error: "Please add the required fields" });
    }

    const vendorId = req.userId;

    const businessAlbums = [];

    for (const album of business_albums) {
      const imagesBuffer = [];
      for (const image of album.images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "albumImages",
        });
        imagesBuffer.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      businessAlbums.push({
        album_name: album.name,
        description: album.description,
        images: imagesBuffer,
      });
    }
    if (business_type === "venue") {
      if (!venue_coverage_area || !venue_persons_capacity) {
        res.status(422).json({
          error: "Please add both Coverage area and capacity of the venue",
        });
      }

      const business = new Business({
        vendor_id: vendorId,
        business_name: business_name,
        business_description: business_description,
        business_email: business_email,
        business_phone_number: business_phone_number,
        business_type: business_type,
        estimated_price: estimated_price,
        venue_coverage_area: venue_coverage_area,
        venue_persons_capacity: venue_persons_capacity,
        business_facebook_url: business_facebook_url,
        business_instagram_url: business_instagram_url,
        business_youtube_url: business_youtube_url,
        business_location: business_location,
        business_address: business_address,
        business_packages: business_packages,
        business_albums: businessAlbums,
        business_display_picture: business_display_picture,
        booked_dates: booked_dates,
      });
      await business.save();
      return res.status(201).json({ business, success: true });
    } else {
      const business = new Business({
        vendor_id: vendorId,
        business_name: business_name,
        business_description: business_description,
        business_email: business_email,
        business_phone_number: business_phone_number,
        business_type: business_type,
        estimated_price: estimated_price,
        business_location: business_location,
        business_address: business_address,
        business_facebook_url: business_facebook_url,
        business_instagram_url: business_instagram_url,
        business_youtube_url: business_youtube_url,
        business_packages: business_packages,
        business_albums: businessAlbums,
        business_display_picture: business_display_picture,
        booked_dates: booked_dates,
      });
      await business.save();
      return res.status(201).json({ business, success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific business by ID
const getSpecificBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ business, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a all businesses for specific vendor
const getSpecificVendorBusiness = async (req, res) => {
  try {
    const vendorId = req.userId;
    const business = await Business.find({ vendor_id: vendorId });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.status(200).json({ success: true, business: business });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBusinessName = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_name = req.body.business_name;
    if (!business_name) {
      return res.json({ error: "Business Name is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_name },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Business Name updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Name" });
  }
};

const updateBusinessDescription = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_description = req.body.business_description;
    if (!business_description) {
      return res.json({ error: "Business Description is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_description },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Description updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Description" });
  }
};

const updateBusinessPhoneNo = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business_phone_number = req.body.business_phone_number;
    if (!business_phone_number) {
      return res.json({ error: "Please enter phone number" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_phone_number },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Phone number updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update phone number" });
  }
};

const updateBusinessEmail = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_email = req.body.business_email;
    if (!business_email) {
      return res.json({ error: "Business Email is required" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_email },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Business Email updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Email" });
  }
};

const updateBusinessLocation = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_location = req.body.business_location;
    if (!business_location) {
      return res.json({ error: "Business Location is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_location },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Location updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Location" });
  }
};

const updateBusinessAddress = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_address = req.body.business_address;
    if (!business_address) {
      return res.json({ error: "Business Address is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_address },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Address updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Address" });
  }
};

const updateBusinessPrice = async (req, res) => {
  try {
    const businessId = req.params.id;

    const estimated_price = req.body.estimated_price;
    if (!estimated_price) {
      return res.json({ error: "Business Price is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { estimated_price },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Business Price updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Price" });
  }
};

const updatePersonsCapacity = async (req, res) => {
  try {
    const businessId = req.params.id;

    const venue_persons_capacity = req.body.venue_persons_capacity;
    if (!venue_persons_capacity) {
      return res.json({ error: "Business Persons Capacity is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { venue_persons_capacity },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Persons capacity updated successfully",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update Business Persons capacity" });
  }
};

const updateBookedDates = async (req, res) => {
  try {
    const businessId = req.params.id;

    const booked_dates = req.body.booked_dates;
    if (!booked_dates) {
      return res.json({ error: "Business booked dates are required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { booked_dates },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Booked Dates updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Booked Dates" });
  }
};

const updateFacebookUrl = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_facebook_url = req.body.business_facebook_url;
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_facebook_url },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Facebook Url updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Facebook Url" });
  }
};

const updateInstagramUrl = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_instagram_url = req.body.business_instagram_url;
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_instagram_url },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Instagram Url updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Instagram Url" });
  }
};

const updateYoutubeUrl = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business_youtube_url = req.body.business_youtube_url;
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_youtube_url },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Yotube Url updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Youtube Url" });
  }
};

const updateCoverageArea = async (req, res) => {
  try {
    const businessId = req.params.id;

    const venue_coverage_area = req.body.venue_coverage_area;
    if (!venue_coverage_area) {
      return res.json({ error: "Business Coverage Area is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { venue_coverage_area },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Business Coverage Area updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Coverage Area" });
  }
};



const updateBusinessPackages = async (req, res) => {
  try {
    const businessId = req.params.id;
    const package_id = req.body.package_id;
    const price = req.body.price;

    // Find the business document using the businessId
    const business = await Business.findById(businessId);

    // Find the business package within the document using the package_id
    const package = business.business_packages.find(
      (p) => p._id.toString() === package_id.toString()
    );

    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Update the price of the business package
    package.price = price;

    // Save the updated business document
    await business.save();

    res.json({
      message: "Business Package updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update Business Package" });
  }
};
const updateBusinessDisplayPicture = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business_display_picture = req.body.business_display_picture;
    if (!business_display_picture) {
      return res.json({ error: "Display picture is required" });
    }
    const business = await Business.findByIdAndUpdate(
      businessId,
      { business_display_picture },
      {
        new: true,
      }
    );
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "Display picture updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update display picture" });
  }
};
// // Update a specific business by ID
// const UpdateSpecificBusiness = async (req, res) => {
//   try {
//     const businessId = req.params.id;

//     const business = await Business.findById(businessId);
//     if (!business) {
//       return res.status(404).json({ error: "Business not found" });
//     }
//     if (business.business_type === "venue") {
//       business.booked_dates = req.body.booked_dates || business.booked_dates;
//       (business.business_albums =
//         req.body.business_albums || business.business_albums),
//         (business.business_packages =
//           req.body.business_packages || business.business_packages),
//         (business.business_name =
//           req.body.business_name || business.business_name),
//         (business.business_facebook_url =
//           req.body.business_facebook_url || business.business_facebook_url),
//         (business.business_instagram_url =
//           req.body.business_instagram_url || business.business_instagram_url),
//         (business.business_youtube_url =
//           req.body.business_youtube_url || business.business_youtube_url),
//         (business.business_email =
//           req.body.business_email || business.business_email),
//         (business.business_phone_number =
//           req.body.business_phone_number || business.business_phone_number);
//       business.estimated_price =
//         req.body.estimated_price || business.estimated_price;
//       (business.venue_coverage_area =
//         req.body.venue_coverage_area || business.venue_coverage_area),
//         (business.venue_persons_capacity =
//           req.body.venue_persons_capacity || business.venue_persons_capacity);
//       business.business_display_picture =
//         req.body.business_display_picture || business.business_display_picture;

//       const updatedBusiness = await business.save();
//       return res.status(200).json(updatedBusiness);
//     } else {
//       business.booked_dates = req.body.booked_dates || business.booked_dates;
//       (business.business_albums =
//         req.body.business_albums || business.business_albums),
//         (business.business_packages =
//           req.body.business_packages || business.business_packages),
//         (business.business_name =
//           req.body.business_name || business.business_name),
//         (business.business_facebook_url =
//           req.body.business_facebook_url || business.business_facebook_url),
//         (business.business_instagram_url =
//           req.body.business_instagram_url || business.business_instagram_url),
//         (business.business_youtube_url =
//           req.body.business_youtube_url || business.business_youtube_url),
//         (business.business_email =
//           req.body.business_email || business.business_email),
//         (business.business_phone_number =
//           req.body.business_phone_number || business.business_phone_number);
//       business.estimated_price =
//         req.body.estimated_price || business.estimated_price;
//       business.business_display_picture =
//         req.body.business_display_picture || business.business_display_picture;

//       const updatedBusiness = await business.save();
//       return res.status(200).json(updatedBusiness);
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Delete a specific business by ID
const deleteSpecificBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    const reviews = await Review.deleteMany({ business_id: req.params.id });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Business deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all businesses of certain vendor
const deleteVendorSpecificBusinesses = async (req, res) => {
  const vendorId = req.userId;
  try {
    const business = await Business.deleteMany({ vendor_id: vendorId });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({
      message: "All Business of Vendor deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBusiness,
  getSpecificBusiness,
  updateBusinessName,
  updateBusinessDescription,
  updateBusinessEmail,
  updateBusinessPhoneNo,
  updateBusinessDisplayPicture,
  updateBookedDates,
  updateFacebookUrl,
  updateInstagramUrl,
  updateYoutubeUrl,
  updateBusinessPrice,
  updateCoverageArea,
  updatePersonsCapacity,
  updateBusinessAddress,
  updateBusinessLocation,
  updateBusinessPrice,
  updateBusinessPackages,
  deleteSpecificBusiness,
  getSpecificVendorBusiness,
  deleteVendorSpecificBusinesses,
};
