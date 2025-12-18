import mongoose from "mongoose";

let menuSchema = new mongoose.Schema(
    {
        restaurant_id : {
            type : String,
            require : true
        },
        restaurantName : {
            type :String,
            require : true
        },
        itemName : {
            type : String,
            require : true,
            trim : true
        },
        itemPrice : {
            type : String,
            require : true,
            trim : true
        },
        category : {
            type : String,
            require : true,
            trim : true,
            enum : ["veg","non-veg","fast-food","bevarages"]
        },
    },
    {
        timestamps : true
    }
)
let menuModel = mongoose.model("menu",menuSchema)

export default menuModel;