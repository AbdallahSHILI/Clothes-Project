const mongoose = require("mongoose");

//Schema of an clothes
const ClothesSchema = new mongoose.Schema({
  // Img: {
  //   data: Buffer,
  //   contentType: String,
  // },
  Description: {
    type: String,
    required: [true, "Please enter the description of this clothes !! "],
    select: true,
    minlength: 2,
  },
  Price: {
    type: String,
    required: [true, "Please enter the Price !! "],
    select: true,
  },
  DesignerID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  CustomerID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  SoldOut: {
    type: Boolean,
    default: false,
    select: true,
  },
  ListReqCustomers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  Hidden: {
    type: Boolean,
    default: false,
    select: true,
  },
});

//MODEL SCHEMA
const Clothes = mongoose.model("Clothes", ClothesSchema);
module.exports = Clothes;
