const mongoose = require("mongoose");

//Schema of a Model
const ModelSchema = new mongoose.Schema({
  // Img: {
  //   data: Buffer,
  //   contentType: String,
  // },
  Description: {
    type: String,
    required: [true, "Please enter the description of Model !! "],
    select: true,
    minlength: 2,
  },
  UserID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  ListReqDesigner: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  ResponsibleDesigner: [
    {
      select: true,
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  Done: {
    type: Boolean,
    default: false,
    select: true,
  },
  Offers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "offer",
    },
  ],
  ResponsibleDesignerRate: {
    type: Boolean,
    default: false,
    select: true,
  },
  CreationDate: {
    type: Date,
    default: Date.now(),
  },
  Hidden: {
    type: Boolean,
    default: false,
    select: true,
  },
  AcceptedOffer: {
    type: Boolean,
    default: false,
    select: true,
  },
  Image: {
    type: String,
    required: [true, "Please upload the picture of Model !! "],
  },
});

//MODEL SCHEMA
const Model = mongoose.model("Model", ModelSchema);
module.exports = Model;
