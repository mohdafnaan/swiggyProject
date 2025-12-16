import express from "express";

const router = express.Router();

import userRouter from "../../models/User/User.js"

router.get("/user-details",async (req,res)=>{
    try {
        let user = req.user
        let details = await userRouter.findOne({email : user.email},{fullName:1,age:1,_id : 0})

        res.status(200).json({msg : details})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
router.put("/user-update",(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
export default router