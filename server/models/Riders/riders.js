import mongoose  from "mongoose";

const riderSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            require : true,
            trim : true
        },
        phone : {
            type : String,
            require : true
        },
        email : {
            type : String,
            require : true,
            trim : true
        },
        password :{
            type : String,
            require : true,
        },
        age : {
            type : Number,
            minlength : [18,"minimum age required is 18"],
            maxlength : [80,"maximum age is 80"]
        },
        gender : {
            type : String,
            enum : ["male","female","others"]
        },
        isActive : {
            type : Boolean,
            default : true
        },
        isVerified : {
            email : {
                type : Boolean,
                default : false
            },
            phone : {
                type : Boolean,
                default : false
            }
        },
        isVerifiedToken : {
            emailToken: {
                type : String,
                default : null
            },
            phoneToken : {
                type : String,
                default : null
            }
        },
        vehicleType : {
            type : String,
            enum : ["bike","scooty"],
            require : true
        },
        vehicleRc : {
            type : String,
            require : true
        },
        isOnline : {
            type : Boolean,
            default : false
        }
    },
    {
        timestamps : true,
        strict : false
    },
)

const riderModel = mongoose.model("riders",riderSchema);

export default riderModel;