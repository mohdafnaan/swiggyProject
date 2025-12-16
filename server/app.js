import express from "express";
import dotenv from "dotenv";
dotenv.config();

// import database
import "./utils/dbConnect.js"
// import  user router
import userRouter from "./controllers/public/user.js"
//import private user router 
import privateuserRouter from "./controllers/private/user.js"
//import rider router
import riderRouter from "./controllers/public/rider.js"
//import private rider router
import privateriderRouter from "./controllers/private/rider.js"
// import resstaurant router
import restaurantRouter from "./controllers/public/restaurant.js";
// import private restrauntrouter 
import privaterestaurantRouter from "./controllers/private/restaurant.js"
//import middleware
import middleware from "./auth/auth.js";
const app  = express();
app.use(express.json())
const port  = process.env.PORT

app.get("/",(req,res)=>{
    try {
        res.status(200).json({msg : "server is running"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : error})
    }
})
app.use("/public",userRouter)
app.use("/public",riderRouter)
app.use("/public",restaurantRouter)
app.use(middleware)
app.use("/private",privateuserRouter)
app.use("/private",privateriderRouter)
app.use("/private",privaterestaurantRouter)
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})