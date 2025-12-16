import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import schema
import riderModel from "../../models/Riders/riders.js";

// import functions
import sendMail from "../../utils/mailer.js";
import sendSms from "../../utils/sms.js";

const router = express.Router();

router.post("/rider-register", async (req, res) => {
  try {
    let {
      fullName,
      email,
      phone,
      password,
      age,
      gender,
      vehicleType,
      vehicleRc,
    } = req.body;
    gender = gender.toLowerCase();
    vehicleType = vehicleType.toLowerCase();
    vehicleRc = vehicleRc.toUpperCase();
    let dupUser = await riderModel.findOne({ $or: [{ email }, { phone }] });
    if (dupUser) {
      return res.status(400).json({ msg: "rider already exist" });
    }

    let bPass = await bcrypt.hash(password, 10);

    let emailToken = Math.random().toString(36).slice(2, 10);
    let phoneToken = Math.random().toString(36).slice(2, 10);

    await sendMail(
      email,
      "Swiggy Verification",
      `visit this link to verifiy your e-mail http://localhost:5000/public/rider-email-verify/${emailToken}`
    );
    await sendSms(
      phone,
      `visit this link to verify your phone http://localhost:5000/public/rider-phone-verify/${phoneToken}`
    );

    let object = {
      fullName,
      email,
      phone,
      password: bPass,
      age,
      gender,
      isVerifiedToken: {
        emailToken,
        phoneToken,
      },
      vehicleType,
      vehicleRc,
    };

    await riderModel.insertOne(object)
    res.status(200).json({ msg: "rider registered sucessfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/rider-email-verify/:token", async (req, res) => {
  try {
    let token = req.params.token;

    let user = await riderModel.findOne({ "isVerifiedToken.emailToken": token });

    if (!user) {
      return res.status(400).json({ msg: "invalid link" });
    }
    await riderModel.updateOne(
      { "isVerifiedToken.emailToken": token },
      { $set: { "isVerifiedToken.emailToken": null, "isVerified.email": true } }
    );

    res.status(200).json({ msg: "email verified sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/rider-phone-verify/:token", async (req, res) => {
  try {
    let token = req.params.token;

    let user = await riderModel.findOne({ "isVerifiedToken.phoneToken": token });

    if (!user) {
      return res.status(400).json({ msg: "invalid link" });
    }
    await riderModel.updateOne(
      { "isVerifiedToken.phoneToken": token },
      { $set: { "isVerifiedToken.phoneToken": null, "isVerified.phone": true } }
    );

    res.status(200).json({ msg: "phone verified sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/rider-login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await riderModel.findOne({ email });
     if(!user.isActive){
      return res.status(400).json({msg : "deleted account"})
    }
    if (!user) {
      return res.status(400).json({ msg: "rider not found" });
    }
    let hPass = await bcrypt.compare(password, user.password);
    if (!hPass) {
      return res.status(400).json({ msg: "invalid credentials" });
    }
    let payload = {
      email,
    };
    let token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1D",
    });
    res.status(200).json({ msg: "login sucessfull", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/rider-forgotpass", async (req, res) => {
  try {
    let { email } = req.body;
    let user = await riderModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    let otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    let otpUrl = `http://localhost:5000/public/setnewpassword`;
    await sendMail(
      email,
      "Otp for changing password",
      `Enter this otp to change password\nOTP : ${otp}\nvisit this site to enter otp and change password ${otpUrl}`
    );
    await riderModel.updateOne({ email },{$set: { otp : otp }} );
    res.status(200).json({ msg: "OTP sent on your registered email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/rider-setnewpassword", async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    let user = await riderModel.findOne({ $and: [{ email}, {otp }] });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    if (!otp) {
      return res.status(400).json({ msg: "invalid otp" });
    }
    let bPass = await bcrypt.hash(password, 10);
    console.log(bPass);
    await riderModel.updateOne({otp},{$set:{password : bPass},$unset : {otp : "" }},{new : true})
    res.status(200).json({msg : "password changed"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router
