import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
    {
        userId : {
            type : String,
            require : true
        },
        restaurantId : {
            type : String,
            require : true
        },
        riderId : {
            type : String,
            require : true
        },
        orderDetails : {
            itemName : {
                type : String,
                require : true
            },
            itemPrice : {
                type : String,
                require : true
            },
            itemQty : {
                type : Number,
                require : true,
                minlength : [1, "Quantity must be atleat 1"],
                maxlength : [15,"maximum quantity is 15"]
            },
            total : {
                type : Number,
                require : true
            },
            orderStatus : {
                type : String,
                default : "on-the-way",
                enum : ["finished","on-the-way"]
            },
            paymentMethod : {
                type : String,
                enum : ["cod","UPI","card"]
            }
        }
    },
    {
        timestamps : true
    }
)

const salesModel = mongoose.model("sales",salesSchema)

export default salesModel;