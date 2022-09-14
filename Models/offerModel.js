const mongoose = require("mongoose");

// Schema of an offer
const OfferSchema = new mongoose.Schema({
  PhoneNumber: {
    type: Number,
    required: [true, "please enter your phone number !! "],
    minlength: 8,
  },
  Price: {
    type: String,
    required: [true, "Please enter your price !! "],
    select: true,
  },
  DesignerID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    select: true,
  },
  ModelID: {
    type: mongoose.Schema.ObjectId,
    ref: "Model",
    select: true,
  },
  CustomerID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    select: true,
  },
  CreationDate: {
    type: Date,
    default: Date.now(),
    select: true,
  },
});

//MODEL SCHEMA

module.exports = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
