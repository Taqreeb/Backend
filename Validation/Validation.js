const { body } = require("express-validator");

const loginValidation = [
  body("Email", "Enter a valid email address").isEmail(),
  body("Password", "Password must be atleast 8 characters long").isLength({
    min: 8,
  }),
];
const emailValidation = [
  body("Email", "Enter a valid email address").isEmail(),
  
 
];

const phoneValidation = [
  body("phoneNumber")
    .isMobilePhone("en-PK", {
      strictMode: true,
      message: "Please enter a valid Pakistani phone number",
    })
];

const passwordValidation = [
  body("newPassword", "Password must be atleast 8 characters long").isLength({
    min: 8,
  }),
]

const profilePictureValidation = [
  body('profile_picture').custom((value,{req})=>{
    if(req.file.mimetype==='image/jpeg' || req.file.mimetype==='image/png' || req.file.mimetype==='image/jpg'){
      return true;
    }
    else{
      return false;
    }
}).withMessage('Please upload an image type of PNG or JPEG/JPG')
]
module.exports = {loginValidation,emailValidation,profilePictureValidation,passwordValidation,phoneValidation}