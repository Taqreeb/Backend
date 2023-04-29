const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const signup = async (req, res) => {
  try {
    const { FirstName, LastName, Email, PhoneNo, Password, role } = req.body;

    if (!FirstName || !LastName || !Email || !PhoneNo || !Password || !role) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    if (role === "admin") {
      return res.status(500).json({ error: "Cannot create admin" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!(role === "user" || role === "vendor")) {
      return res
        .status(500)
        .json({ error: "We can only cater user and vendor roles" });
    }
    const userExist = await User.findOne({ Email: Email });
    if (userExist) {
      return res
        .status(400)
        .json({ error: "This Email Address is already registered" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(Password, salt);
      const user = await User.create({
        FirstName: FirstName,
        LastName: LastName,
        PhoneNo: PhoneNo,
        Email: Email,
        Password: secPass,
        role: role,
      });
      res.status(201).json({user,success:true});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(422).json({ Error: "Please fill all the fields" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userLogin = await User.findOne({ Email: req.body.Email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(Password, userLogin.Password);
      if (!isMatch) {
        res.status(400).json({ Error: "Invalid Credentials" });
      } else {
        const authtoken = jwt.sign(
          { _id: userLogin._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );

        res.status(201).send({
          id: userLogin._id,
          authtoken,
          Status: "User login successfully",
          Email: Email,
          role: userLogin.role,
          profile_picture: userLogin.profile_picture
        });
      }
    } else {
      res.status(400).json({ Error: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error.message });
  }
};

module.exports = { login, signup };
