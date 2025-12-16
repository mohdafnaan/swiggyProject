import express from "express";
import restaurantModel from "../../models/Restaurants/Restaurants.js";

const router = express.Router();
router.get("/restaurant-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await restaurantModel.findOne({email : user.email},{restaurantName: 1,restaurantaddress : 1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/restaurant-update", async (req, res) => {
  try {
    let user = req.user;
    console.log(user);
    let userInput = req.body;
    await restaurantModel.updateOne(
      { email: user.email },
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
    let user = req.user;
    await restaurantModel.updateOne(
      { email: user.email },
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ msg: "restaurant deleted sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});
router.post("/restaurant-addmenu",async (req,res)=>{
    try {
        let user = req.user;
        let userInput = req.body;
        await restaurantModel.updateOne({email : user.email},{$push : {menu : userInput}})
        res.status(200).json({msg : `${userInput.dishName} added to menu`})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/restaurant-editmenu/:_id",async (req,res)=>{
    try {
        // let user = req.user
        // if(!user) return res.status(500).json({msg:"User not found"})
        let id = req.params._id
        let {price} = req.body;
        await restaurantModel.updateOne({"menu[_id]":id},{$set:{"menu[dishPrice]":price}})
        res.status(200).json({msg : `menu updated`})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
export default router