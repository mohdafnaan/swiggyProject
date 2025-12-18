import express from "express";
import restaurantModel from "../../models/Restaurants/Restaurants.js";
// import userModel from "../../models/User/User.js";
import menuModel from "../../models/menu/menu.js";

const router = express.Router();
router.get("/restaurant-details", async (req, res) => {
  try {
    let restaurant = req.user;
    let details = await restaurantModel.findOne(
      { email: restaurant.email },
      { restaurantName: 1, restaurantaddress: 1, _id: 0 }
    );

    res.status(200).json({ msg: details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/restaurant-update", async (req, res) => {
  try {
    let restaurant = req.user;
    console.log(restaurant);
    let userInput = req.body;
    await restaurantModel.updateOne(
      { email: restaurant.email },
      { $set: userInput },
      { new: true }
    );

    res.status(200).json({ msg: "restaurant details updated sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.delete("/restaurant-delete", async (req, res) => {
  try {
    let restaurant = req.user;
    await restaurantModel.updateOne(
      { email: restaurant.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "restaurant deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/restaurant-addmenu", async (req, res) => {
  try {
    let restaurant = await restaurantModel.findOne({email : req.user.email})
    console.log(restaurant);
    if(!restaurant){
      return res.status(400).json({msg : "User not found"})
    }
    let {itemName,itemPrice,category} = req.body

    let menuObj = {
      restaurant_id : restaurant._id,
      restaurantName : restaurant.restaurantName,
      itemName,
      itemPrice,
      category
    }
    await menuModel.insertOne(menuObj)
    res.status(200).json({msg : "menu added"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.put("/restaurant-editmenu/:_id", async (req, res) => {
  try {
    let _id = req.params._id;
    let restaurant = await restaurantModel.findOne({email : req.user.email})
    let userInput = req.body;
    console.log(userInput);
    await menuModel.updateOne({restaurant_id : restaurant._id,_id : _id},{$set : userInput })
    res.status(200).json({ msg: "menu updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

router.delete("/restaurant-deletemenu/:_id",async (req,res)=>{
  try {
    let _id = req.params._id;
    let restaurant = await restaurantModel.findOne({email : req.user.email})
    console.log(restaurant);
    if(!restaurant){
      return res.status(400).json({msg : "user not found"})
    }
    await menuModel.deleteOne({_id : _id})
    res.status(200).json({msg : "item deleted"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
router.get("/restaurant-getmenu",async (req,res)=>{
  try {
    let restaurant = await restaurantModel.findOne({email : req.user.email})
    let item = await menuModel.find({restaurant_id:restaurant._id},{itemName : 1,itemPrice : 1 ,category : 1, _id : 0 })
    console.log(item);
    res.status(200).json(item)
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
router.get("/restaurant-previousorders",async(req,res)=>{
  try {
    let restaurant = req.user
    let orders = await salesModel.find({restaurantId : restaurant._id})
    console.log(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
router.get("/restaurant-offline",async (req,res)=>{
  try {
    let restaurant = req.user;
    await restaurantModel.updateOne({email : restaurant.email},{$set :{isOpen :false} })
    res.status(200).json({msg : "you are off duty"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg : error})
  }
})
export default router;
