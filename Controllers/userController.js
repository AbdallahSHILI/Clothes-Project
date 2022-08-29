const factoryOne = require("./factoryOne");
const User = require("../models/UserModel");

// find one client for admin
exports.getUserById = factoryOne.findOne(User);

// update current user
exports.updateUser = factoryOne.updateProfile(User);

// delete user for admin
exports.deleteUser = factoryOne.deleteOneUser(User);

//get current user using the getUserByID
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// find all clients for admin
exports.findAllClients = async (req, res, next) => {
  try {
    // Test if there is clients
    const doc = await User.find({ role: "client" });
    return res.status(200).json({
      status: "succes",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};

// find all admins for admin
exports.findAllAdmins = async (req, res, next) => {
  try {
    // Test if there is admins
    const doc = await User.find({ role: "admin" });
    return res.status(200).json({
      status: "sucees",
      result: doc.length,
      data: {
        data: doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};

// find all Designers for admin
exports.findAllDesigners = async (req, res, next) => {
  try {
    // Test if there is employees
    const doc = await User.find({ role: "designer" });
    return res.status(200).json({
      status: "succes",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};

// find one designer for admin
exports.getDesignerById = async (req, res, next) => {
  try {
    // Test if there is an employee
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json({
        status: "succes",
        data: {
          user,
        },
      });
    }
    return res.status(404).json({
      status: "No designer with that id !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};
