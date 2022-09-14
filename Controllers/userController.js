const factoryOne = require("./factoryOne");
const User = require("../Models/userModel");

// find one customer for admin
exports.getUserById = factoryOne.findOne(User);

// update current user
exports.updateUser = factoryOne.updateProfile(User);

// delete designer for admin
exports.deleteDesigner = factoryOne.deleteOneDesigner(User);

// delete customer for admin
exports.deleteCustomer = factoryOne.deleteOneCustomer(User);

//get current user using the getUserByID
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// find all customers for admin
exports.getAllCustomers = async (req, res, next) => {
  try {
    // Test if there is customers
    const doc = await User.find({ Role: "customer" });
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
    const doc = await User.find({ Role: "admin" });
    return res.status(200).json({
      status: "succes",
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
    // Test if there is designers
    const doc = await User.find({ Role: "designer" });
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
    // Test if there is an designer
    const user = await User.findById(req.params.idDesigner);
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

// List of designers who have 5 rate less than 2
exports.findAllFakeDesigner = async (req, res, next) => {
  try {
    // Test if there is a fake employees
    const fakeDesigner = await User.find({ NumberNegRate: { $gte: 5 } });
    if (fakeDesigner) {
      return res.status(200).json({
        status: "succes",
        result: fakeDesigner.length,
        data: {
          fakeDesigner,
        },
      });
    }
    return res.status(404).json({
      status: "There is no fake designers !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};
