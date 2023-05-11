const User = require("../models/userSchema");
const Token = require("../models/emailTokenSchema");
const crypto = require("crypto");
const sendEmailVerification = require("../utils/sendEmailForVerification");
const sendEmailForgotPassword = require("../utils/sendEmailForgotPassword");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const PasswordReset = require("../models/passwordResetSchema");
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
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
      await sendEmailVerification(user.Email, "Verify Email", url);

      res.status(201).send({
        message: "An Email has been sent to your account please verify",
        success: true,
      });
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
    const userLogin = await User.findOne({ Email: req.body.Email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(Password, userLogin.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      if (!userLogin.verified) {
        let token = await Token.findOne({ userId: userLogin._id });
        if (!token) {
          token = await new Token({
            userId: userLogin._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const url = `${process.env.BASE_URL}/users/${userLogin._id}/verify/${token.token}`;
          await sendEmailVerification(userLogin.Email, "Verify Email", url);
        }

        return res
          .status(400)
          .send({
            message: "An Email has been sent to your account please verify",
          });
      }
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
        profile_picture: userLogin.profile_picture,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const verifyEmailToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await User.findByIdAndUpdate(
      user._id,
      { verified: true },
      {
        new: true,
      }
    );
    await token.remove();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

const passwordRecoveryEmail = async (req, res) => {
  try{
   const {Email} = req.body
   const emailExist = await User.findOne({Email:Email})
   if(!emailExist){
    return res.status(400).send({status:"FAILED",message:"No account with supplied email exists!"})
   }
   if(!emailExist.verified){
    return res.status(400).send({status:"FAILED",message:"Email hasn't been verified yet."})
   }
   sendEmailForgotPassword(emailExist,res);
  }
  catch(error){
    console.log(error);
    res.status(500).send({status:"FAILED",message:"An error occurred while checking for existing user"})
  }
};

const resetPassword = async (req,res)=>{
  try{
   let {userId,resetString,newPassword} = req.body;
   const result = await PasswordReset.find({userId:userId});
   if(result.length>0){
    const hashedResetString = result[0].resetString;
    const expiresAt = result[0].expiresAt;
    if(expiresAt<Date.now()){
      const deletePassword = await PasswordReset.deleteOne({userId:userId})
      if(!deletePassword){
        return res.status(400).send({status:"FAILED",message:"Clearing password reset record failed."})
      }
      return res.status(400).send({status:"FAILED",message:"Password reset link expired."})
    }
    const isMatch = await bcrypt.compare(resetString,hashedResetString);
    if(!isMatch){
     return res.status(400).send({status:"FAILED",message:"Invalid password reset details passed."})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);
    const updatePassword = await User.updateOne({_id:userId},{Password:secPass},{new:true});
    if(!updatePassword){
      return res.status(400).send({status:"FAILED",message:"Updating user password failed."})
    }
    await PasswordReset.deleteOne({userId:userId})
    res.status(200).send({status:"SUCCESS",message:"Password has been reset successfully."})
   }
   else{
    return res.status(400).send({status:"FAILED",message:"Password reset request not found."})
   }
  }
  catch(error){
    console.log(error);
  }
}


module.exports = { login, signup, verifyEmailToken,passwordRecoveryEmail,resetPassword };
