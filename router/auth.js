const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get("/", (req, res) => {
  res.send("Welcome To Taqreeb");
});

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword } =
    req.body;

  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword){
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ error: "Email already exists" });
    }
    else if(password!=confirmPassword){
        return res.status(400).json({ error: "Password and confirm password dont match" });
    }
    else {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered Successfully" });
    }
} 
catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const userLogin = await User.findOne({ email: email });
   
    
    if(userLogin){
        const isMatch = await bcrypt.compare(password,userLogin.password);
        const token = await userLogin.generateAuthToken();
        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credentials" });
          }
          else{
            res.status(201).json({ message: "user login successfully" });
          }
        
    }
    else{
        res.status(400).json({error:"User is not registered"})
    }

   
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
