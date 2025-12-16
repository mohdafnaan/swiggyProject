import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//import schema
import restaurantModel from "../../models/Restaurants/Restaurants.js";

// import functions
import sendMail from "../../utils/mailer.js";
import sendSms from "../../utils/sms.js";

const router = express.Router();

router.post("/restaurant-register", async (req, res) => {
  try {
    let {
      fullName,
      email,
      phone,
      password,
      age,
      gender,
      restaurantName,
      restaurantaddress,
    } = req.body;
    gender = gender.toLowerCase();

    let dupUser = await restaurantModel.findOne({
      $or: [{ email }, { phone }],
    });
    if (dupUser) {
      return res.status(400).json({ msg: "user already exist" });
    }

    let bPass = await bcrypt.hash(password, 10);

    let emailToken = Math.random().toString(36).slice(2, 10);
    let phoneToken = Math.random().toString(36).slice(2, 10);

    await sendMail(
      email,
      "Swiggy Verification",
      `visit this link to verifiy your e-mail http://localhost:5000/public/restaurant-email-verify/:${emailToken}`
    );
    await sendSms(
      phone,
      `visit this link to verify your phone http://localhost:5000/public/restaurant-phone-verify/:${phoneToken}`
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
      restaurantName,
      restaurantaddress,
    };

    await restaurantModel.insertOne(object);
    res.status(200).json({ msg: "user registered sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/restaurant-email-verify/:token", async (req, res) => {
  try {
    let token = req.params.token;

    let user = await restaurantModel.findOne({
      "isVerifiedToken.emailToken": token,
    });

    if (!user) {
      return res.status(400).json({ msg: "invalid link" });
    }
    await restaurantModel.updateOne(
      { "isVerifiedToken.emailToken": token },
      { $set: { "isVerifiedToken.emailToken": null, "isVerified.email": true } }
    );

    res.status(200).json({ msg: "email verified sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(5000).json({ msg: error });
  }
});
router.get("/restaurant-phone-verify/:token", async (req, res) => {
  try {
    let token = req.params.token;

    let user = await restaurantModel.findOne({
      "isVerifiedToken.phoneToken": token,
    });
    if (!user.isActive) {
      return res.status(400).json({ msg: "deleted account" });
    }
    if (!user) {
      return res.status(400).json({ msg: "invalid link" });
    }
    await restaurantModel.updateOne(
      { "isVerifiedToken.phoneToken": token },
      { $set: { "isVerifiedToken.phoneToken": null, "isVerified.phone": true } }
    );

    res.status(200).json({ msg: "phone verified sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(5000).json({ msg: error });
  }
});
router.post("/restaurant-login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await restaurantModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
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
router.post("/restaurant-forgotpass", async (req, res) => {
  try {
    let { email } = req.body;
    let user = await restaurantModel.findOne({ email });
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
    await restaurantModel.updateOne({ email }, { $set: { otp: otp } });
    res.status(200).json({ msg: "OTP sent on your registered email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.post("/restaurant-setnewpassword", async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    let user = await restaurantModel.findOne({ $and: [{ email }, { otp }] });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    if (!otp) {
      return res.status(400).json({ msg: "invalid otp" });
    }
    let bPass = await bcrypt.hash(password, 10);
    console.log(bPass);
    await restaurantModel.updateOne(
      { otp },
      { $set: { password: bPass }, $unset: { otp: "" } },
      { new: true }
    );
    res.status(200).json({ msg: "password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
export default router;
