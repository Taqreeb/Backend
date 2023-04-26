const { default: mongoose } = require("mongoose");
const Business = require("../models/businessSchema");
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
        business_description:business_description,
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
        business_description:business_description,
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
    res.json({business, success:true});
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
// Update a specific business by ID
const UpdateSpecificBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    if (business.business_type === "venue") {
      business.booked_dates = req.body.booked_dates || business.booked_dates;
      (business.business_albums =
        req.body.business_albums || business.business_albums),
        (business.business_packages =
          req.body.business_packages || business.business_packages),
        (business.business_name =
          req.body.business_name || business.business_name),
        (business.business_facebook_url =
          req.body.business_facebook_url || business.business_facebook_url),
        (business.business_instagram_url =
          req.body.business_instagram_url || business.business_instagram_url),
        (business.business_youtube_url =
          req.body.business_youtube_url || business.business_youtube_url),
        (business.business_email =
          req.body.business_email || business.business_email),
        (business.business_phone_number =
          req.body.business_phone_number || business.business_phone_number);
      business.estimated_price =
        req.body.estimated_price || business.estimated_price;
      (business.venue_coverage_area =
        req.body.venue_coverage_area || business.venue_coverage_area),
        (business.venue_persons_capacity =
          req.body.venue_persons_capacity || business.venue_persons_capacity);
      business.business_display_picture =
        req.body.business_display_picture || business.business_display_picture;

      const updatedBusiness = await business.save();
      return res.status(200).json(updatedBusiness);
    } else {
      business.booked_dates = req.body.booked_dates || business.booked_dates;
      (business.business_albums =
        req.body.business_albums || business.business_albums),
        (business.business_packages =
          req.body.business_packages || business.business_packages),
        (business.business_name =
          req.body.business_name || business.business_name),
        (business.business_facebook_url =
          req.body.business_facebook_url || business.business_facebook_url),
        (business.business_instagram_url =
          req.body.business_instagram_url || business.business_instagram_url),
        (business.business_youtube_url =
          req.body.business_youtube_url || business.business_youtube_url),
        (business.business_email =
          req.body.business_email || business.business_email),
        (business.business_phone_number =
          req.body.business_phone_number || business.business_phone_number);
      business.estimated_price =
        req.body.estimated_price || business.estimated_price;
      business.business_display_picture =
        req.body.business_display_picture || business.business_display_picture;

      const updatedBusiness = await business.save();
      return res.status(200).json(updatedBusiness);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific business by ID
const deleteSpecificBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "Business deleted successfully",success:true  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all businesses of certain vendor
const deleteVendorSpecificBusinesses = async (req, res) => {
  const vendorId = req.userId;
  try {
    const business = await Business.deleteMany({vendor_id:vendorId});
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json({ message: "All Business of Vendor deleted successfully",success:true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBusiness,
  getSpecificBusiness,
  UpdateSpecificBusiness,
  deleteSpecificBusiness,
  getSpecificVendorBusiness,
  deleteVendorSpecificBusinesses
};
