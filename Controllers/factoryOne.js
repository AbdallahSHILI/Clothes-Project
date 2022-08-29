const User = require("../models/UserModel");

exports.findOne = (Model) => async (req, res, next) => {
  try {
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return "No doc with that id !! ";
    }
    return res.status(200).json({
      status: "succes",
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

exports.updateProfile = (Model) => async (req, res, next) => {
  try {
    if (req.user.id == req.params.id) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      // Test if document was update successfuly
      if (doc) {
        return res.status(200).json({
          status: "succes",
          data: {
            doc,
          },
        });
      }
      return res.status(404).json({
        status: "No doc with that id !! ",
      });
    }
    return res.status(404).json({
      status: "You don't have the permission to do that action !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};

exports.deleteOneUser = (Model) => async (req, res, next) => {
  try {
    // Find user and delete it
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return res.status(400).json({
        status: "No user with that id !!",
      });
    return res.status(200).json({
      status: "succes",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      data: err,
    });
  }
};
