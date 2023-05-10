const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    PhoneNo: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    role:{
      type:String,
      required:true,
      lowercase:true
    },
    profile_picture: {
      type: String,
      default:"https://via.placeholder.com/150",
    },
    verified:{
      type:Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
