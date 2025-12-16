import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      trim: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      minlength: [18, "minimum age required is 18"],
      maxlength: [80, "maximum age is 80"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      email: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Boolean,
        default: false,
      },
    },
    isVerifiedToken: {
      emailToken: {
        type: String,
        default: null,
      },
      phoneToken: {
        type: String,
        default: null,
      },
    },
    restaurantName: {
      type: String,
      require: true,
    },
    restaurantaddress: {
      type: String,
      require: true,
    },
    isOpen : {
        type : Boolean,
        default : true
    },
    menu: [
      {
        dishName: {
          type: String,
        },
        dishPrice: {
          type: String
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

const restaurantModel = mongoose.model("restraunts", restaurantSchema);

export default restaurantModel;
