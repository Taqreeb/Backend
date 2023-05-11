const User = require("../models/userSchema");
const Business = require("../models/businessSchema");
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");

//get vendor profile
const profile = async (req, res) => {
  try {
    const userId = req.userId;
    const vendor = await User.findById(userId);
    res.status(200).send(vendor);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updateVendorEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const Email = req.body.Email;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const emailExist = await User.findOne({ Email: Email });
    if (emailExist) {
      return res
        .status(400)
        .json({ error: "This Email Address is already registered" });
    }
    const vendor = await User.findByIdAndUpdate(
      userId,
      { Email },
      {
        new: true,
      }
    );
    res.json({ vendor, message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update email" });
  }
};

const updateVendorPassword = async (req, res) => {
  try{
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  // Retrieve the vendor from the database
  const vendor = await User.findById(userId);
  if (!vendor) {
    return res.status(404).json({ error: 'Vendor not found' });
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(oldPassword, vendor.Password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Update password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  vendor.Password = hashedPassword;
  await vendor.save();

  return res.json({match:true, message: 'Password updated successfully',data:vendor });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}
};

const updateVendorFirstName = async (req, res) => {
  try {
    const userId = req.userId;
    const FirstName = req.body.FirstName;
    if (!FirstName) {
      return res.json({ error: "Please enter first name" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const vendor = await User.findByIdAndUpdate(
      userId,
      { FirstName },
      {
        new: true,
      }
    );
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ vendor, message: "First Name updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update first name" });
  }
};

const updateVendorLastName = async (req, res) => {
  try {
    const userId = req.userId;
    const LastName = req.body.LastName;
    if (!LastName) {
      return res.json({ error: "Please Enter Last Name" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const vendor = await User.findByIdAndUpdate(userId, { LastName });
    if (!vendor) {
      return res.status(404).json(
        { error: "Vendor not found" },
        {
          new: true,
        }
      );
    }
    res.json({ vendor, message: "Last Name updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update last name" });
  }
};

const updateVendorPhoneNo = async (req, res) => {
  try {
    const userId = req.userId;
    const PhoneNo = req.body.PhoneNo;
    if (!PhoneNo) {
      return res.json({ error: "Please enter phone number" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const vendor = await User.findByIdAndUpdate(
      userId,
      { PhoneNo },
      {
        new: true,
      }
    );
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ vendor, message: "Phone number updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update phone number" });
  }
};

const updateVendorProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const profile_picture = req.body.profile_picture;
    const vendor = await User.findByIdAndUpdate(
      userId,
      { profile_picture },
      {
        new: true,
      }
    );
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ vendor, message: "profile picture updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

const getApprovedBusinesses=async (req, res) => {
  try {
    const approvedBusinesses = await Business.find({business_status:"approved"})
    res.status(200).json({approvedBusinesses,success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getPendingBusinesses=async (req, res) => {
  try {
    const pendingBusinesses = await Business.find({business_status:"pending"})
    res.status(200).json({pendingBusinesses,success:true});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  profile,
  updateVendorEmail,
  updateVendorPassword,
  updateVendorFirstName,
  updateVendorLastName,
  updateVendorPhoneNo,
  updateVendorProfilePicture,
  getApprovedBusinesses,
  getPendingBusinesses,
};
