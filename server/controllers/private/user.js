import express from "express";
// import bcrypt from "bcrypt"
const router = express.Router();

import userModel from "../../models/User/User.js";
import menuModel from "../../models/menu/menu.js";
import restaurantModel from "../../models/Restaurants/Restaurants.js";
import riderModel from "../../models/Riders/riders.js";
import salesModel from "../../models/sales/sales.js";


router.get("/user-details", async (req, res) => {
  try {
    let user = req.user;
    let details = await userModel.findOne(
      { email: user.email },
      { fullName: 1, age: 1, _id: 0 }
    );

    res.status(200).json({ msg: details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/user-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body;
    await userModel.updateOne(
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
router.delete("/user-delete", async (req, res) => {
  try {
    let user = req.user;
    await userModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "user deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/place-order",async (req,res)=>{
  try {
    let{itemName,qty,method,restaurant} = req.body;
    let resta = await restaurantModel.findOne({restaurantName : restaurant,isOpen : true},{_id : 1})
    if(!resta) return res.status(400).json({msg : "your selected restaurant is not available at the moment"})
    let itemAvail = await menuModel.findOne({restaurant_id:resta._id,itemName})
    if(!itemAvail) return res.status(400).json({msg : "your selected dish is not available at the choosen restaurant"})
    let rider = await riderModel({isOnline : true})
    if(!rider) return res.status(200).json({msg : "plese wait for a while"});
    let salesPlayload = {
      userId : req.user._id,
      restaurantId : resta._id,
      riderId : rider._id,
      orderDetails : {
        itemName,
        itemPrice : itemAvail.itemPrice,
        itemQty : qty,
        total : itemAvail.itemPrice * qty,
        paymentMethod : method
      }
    }
    await salesModel.insertOne(salesPlayload);
    res.status(200).json({msg : "order placed sucessfully"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})

router.post("/getrestaurantswithfood",async (req,res)=>{
try {
  let {itemName} = req.body;
  let menu = await menuModel.find({itemName},{restaurantName : 1,_id: 0})
  let mObj = menu.map(x=>x.restaurantName)
  console.log(mObj);
  let restaurantsDetails = await restaurantModel.find({restaurantName :{$in:mObj}},{_id : 0 , restaurantName:1,restaurantaddress:1,isOpen :1,phone:1})
  // console.log(restaurantsDetails);
  res.status(200).json(restaurantsDetails)
} catch (error) {
  console.log(error);
  res.status(500).json({msg : error})
}
})
router.get("/user-previousorders",async(req,res)=>{
  try {
    let user = req.user
    let orders = await salesModel.find({userId : user._id})
    console.log(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
export default router;
