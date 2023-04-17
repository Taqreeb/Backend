const User = require('../models/userSchema');

const bcrypt = require('bcryptjs');

// get user profile
const profile = async (req, res) => {
  try{
    const userId = req.userId;
    const user = await User.findById(userId)
    res.status(200).send(user)
  } catch(error){
    res.status(500).send("Internal Server Error")
  }

}

const updateUserEmail = async (req, res) => {
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
    const user = await User.findByIdAndUpdate(
      userId,
      { Email },
      {
        new: true,
      }
    );
    res.json({ user, message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update email" });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;
   
    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.Password);
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
    user.Password = hashedPassword;
    await user.save();
    return res.json({message: 'Password updated successfully',data:user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserFirstName = async (req, res) => {
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
    const user = await User.findByIdAndUpdate(
      userId,
      { FirstName },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user, message: "First Name updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update first name" });
  }
};

const updateUserLastName = async (req, res) => {
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
    const user = await User.findByIdAndUpdate(userId, { LastName });
    if (!user) {
      return res.status(404).json(
        { error: "User not found" },
        {
          new: true,
        }
      );
    }
    res.json({ user, message: "Last Name updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update last name" });
  }
};

const updateUserPhoneNo = async (req, res) => {
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
    const user = await User.findByIdAndUpdate(
      userId,
      { PhoneNo },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user, message: "Phone number updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update phone number" });
  }
};

const updateUserProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const profile_picture = req.body.profile_picture;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { profile_picture },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user, message: "profile picture updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};




module.exports = {profile,updateUserEmail, updateUserPassword, updateUserFirstName, updateUserLastName,updateUserPhoneNo, updateUserProfilePicture}


