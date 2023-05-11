const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const env = require("dotenv");
const PasswordReset = require("../models/passwordResetSchema");
env.config({ path: "config.env" });
const { v4: uuidv4 } = require("uuid");

module.exports = async ({ _id, Email }, res) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });
    const resetString = uuidv4() + _id;
    await PasswordReset.deleteMany({ userId: _id });

    const mailOptions = {
      from: process.env.USER,
      to: Email,
      subject: "Reset Your Taqreeb Password",
      html: `<p>We heard you lost your Password.</p> <p>Don't worry, use the link below to reset your password.</p>
       <p>This link <b>expires in 60 minutes</b>.Press <a href= ${
        process.env.BASE_URL + "/" + _id + "/" + resetString
       }>here</a> to proceed.</p>`,
    };
    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(resetString, salt);
    const passwordReset = await PasswordReset.create({
      userId: _id,
      resetString: hashedString,
    });
    if (!passwordReset) {
    return res.send({status:"FAILED",message:"Password reset email failed"})
    }
    const EmailSent = await transporter.sendMail(mailOptions);
    if(!EmailSent){
        return res.send({status:"FAILED",message:"Couldn't save password reset data!"})
    }
    res.send({status:"PENDING",message:"Password reset email sent"})
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "FAILED",
      message: "Clearing existing password reset records failed",
    });
  }
};
