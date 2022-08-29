const mongoose = require("mongoose");
const validator = require("validator");

// Clothes Schema
const DesignClothesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name "],
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "please enter your email ! "],
    validate: [validator.isEmail, "Please fill a valid email !! "],
  },
  // IMG FORMAT
});

const Clothes = mongoose.model("Clothes", DesignClothesSchema);
module.exports = Clothes;
