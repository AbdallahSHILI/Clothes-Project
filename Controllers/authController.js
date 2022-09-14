const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const dotenv = require("dotenv");
require("dotenv").config;

//get token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// create and send token => to USE
const createSendToken = (user, statusCode, res) => {
  // call her
  const token = signToken(user._id);
  // Remove password from output pour la secrete
  user.password = undefined;
  res.status(statusCode).json({
    status: "Succes",
    token,
    data: {
      user,
    },
  });
};

//login
exports.login = async (req, res, next) => {
  try {
    //1)check if email and password exist in req.body
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(404).json({
        status: "echec",
        message: "You must paste an email and password !",
      });
    }
    //2) check if user email exists && password is correct password exist
    const user = await User.findOne({ Email }).select("+Password");
    if (!user || !(await user.validatePassword(Password, user.Password))) {
      return res.status(401).json({
        status: "echec",
        message: "Invalid email or password ",
      });
    }
    //3) if everything ok , send token to the customer
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: "echec",
      message: err,
    });
  }
};

//signup
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      FirstLastName: req.body.FirstLastName,
      Email: req.body.Email,
      Password: req.body.Password,
      ConfirmPassword: req.body.ConfirmPassword,
      PhoneNumber: req.body.PhoneNumber,
      Role: req.body.Role,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(404).json({
      status: "echec",
      message: err,
    });
  }
};

//protect routes => authorize just the logged  user
exports.protect = async (req, res, next) => {
  // 1)GETTING TOKEN AND CHECK OF IT'S THERE
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({
      status: "echec",
      message: "You are not connected ! You need to be connected to access !! ",
    });
  }
  // 2) VERIFICATION TOKEN
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // 3) IF THE USER STILL EXIST
  const currentUser = await User.findById(decoded.id);
  //decoded.id is the id of the user logged in
  if (!currentUser) {
    return res.status(401).send({
      status: "echec",
      message: "User of this token no longer exist !! ",
    });
  }
  // Grand access to protected route
  req.user = currentUser;
  next();
};

//restrict to admin , customer , designer
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      return res.status(401).json({
        status: "echec",
        message: "You don't have the permission to do this action !! ",
      });
    }
    next();
  };
};
