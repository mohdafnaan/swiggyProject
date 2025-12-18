import express from "express";
const router = express.Router();

import riderModel from "../../models/Riders/riders.js";
import salesModel from "../../models/sales/sales.js";

router.get("/rider-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await riderModel.findOne({email : user.email},{fullName:1,vehicleRc: 1,vehicleType : 1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/rider-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body;
    await riderModel.updateOne(
      { email: user.email },
      { $set: userInput },
      { new: true }
    );

    res.status(200).json({ msg: "user updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.delete("/rider-delete", async (req, res) => {
  try {
    let user = req.user;
    await riderModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "rider deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.get("/delivered/:orderId",async (req,res)=>{
  try {
    let rider = req.user;
    let {orderId} = req.params;
    await salesModel.updateOne({riderId : rider._id,_id:orderId},{$set : {"orderDetails.orderStatus" : "finished"}})
    res.status(200).json({msg : "order delivered"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
router.get("/rider-previousorders",async(req,res)=>{
  try {
    let rider = req.user
    let orders = await salesModel.find({riderId : rider._id})
    console.log(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
router.get("/rider-offline",async (req,res)=>{
  try {
    let restaurant = req.user;
    await riderModel.updateOne({email : restaurant.email},{$set :{isOnline :false} })
    res.status(200).json({msg : "you are off duty"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
export default router