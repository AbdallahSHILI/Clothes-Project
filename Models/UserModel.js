const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const SALT_WORK_FACTOR = 10;

//Schema of User
const userSchema = new mongoose.Schema({
  FirstLastName: {
    type: String,
    required: [true, "Please enter your first and last name !! "],
  },
  Email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Please enter your Email !! "],
    validate: [validator.isEmail, "Please enter an valid email !! "],
  },
  Password: {
    type: String,
    required: [true, "Please enter your password !! "],
    minlength: 8,
    select: false,
  },
  ConfirmPassword: {
    type: String,
    required: [true, "Please Confirm your password !! "],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.Password;
      },
      message: "The two passwords are not the same !",
    },
  },
  PhoneNumber: {
    type: Number,
    required: [true, "Please enter your phone number !! "],
    minlength: 8,
  },
  Role: {
    type: String,
    default: "customer",
    enum: ["admin", "designer", "customer"],
  },

  //  Models maked by user
  MyModels: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Model",
    },
  ],
  //  Clothes maked by user
  MyClothes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Clothes",
    },
  ],
  // Request of Models for designer
  ReqSendModel: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Model",
    },
  ],
  // Request of clothes for customer
  ReqSendClothes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Clothes",
    },
  ],
  ModelsComplet: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Model",
    },
  ],
  ModelsIncomplet: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Model",
    },
  ],
  OfferSend: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "offer",
    },
  ],
  CreationDate: {
    type: Date,
    default: Date.now(),
  },
  NumberSuccesModel: {
    type: Number,
    default: 0,
  },
});

//2) validate password
userSchema.methods.validatePassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

userSchema.pre("save", async function save(next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.Password = await bcrypt.hash(this.Password, salt);
    this.ConfirmPassword = undefined;
    return next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
