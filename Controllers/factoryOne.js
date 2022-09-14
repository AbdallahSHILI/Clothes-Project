const User = require("../Models/userModel");

exports.createOne = (Model) => async (req, res, next) => {
  try {
    // Create new Model
    const doc = await Model.create(req.body);
    // Test if Model was created
    if (doc) {
      // Push the id of current customer in Model
      await Model.findByIdAndUpdate(doc.id, {
        $push: { UserID: req.user.id },
      });
      //Add the id of Model in the profile current customer
      await User.findByIdAndUpdate(req.user.id, {
        $push: { MyModels: doc.id },
      });
      return res.status(201).json({
        status: "Succes",
        doc,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.addOne = (Model) => async (req, res, next) => {
  try {
    // Add new clothes
    const doc = await Model.create(req.body);
    // Test if clothes was created
    if (doc) {
      // Push the id of current designer in clothes
      await Model.findByIdAndUpdate(doc.id, {
        $push: { DesignerID: req.user.id },
      });
      //Add the id of clothes in the profile current designer
      await User.findByIdAndUpdate(req.user.id, {
        $push: { MyClothes: Model.id },
      });
      return res.status(201).json({
        status: "Succes",
        doc,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.findAll = (Model) => async (req, res, next) => {
  try {
    // Test if there is a document
    const doc = await Model.find({});
    return res.status(200).json({
      status: "Succes",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.findOne = (Model) => async (req, res, next) => {
  try {
    // Test if there is a document
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return "NO document with that id !! ";
    }
    return res.status(200).json({
      status: "Succes",
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.findOneModelAdmin = (Model) => async (req, res, next) => {
  try {
    // Test if there is a Model
    let doc = await Model.findById(req.params.id);
    if (!doc) {
      return "No document with that id !! ";
    }
    return res.status(200).json({
      status: "Succes",
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.updateProfile = (Model) => async (req, res, next) => {
  try {
    if (req.user.id == req.params.idUser) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.idUser, req.body, {
        new: true,
        runValidators: true,
      });
      // Test if document was update successfuly
      if (doc) {
        return res.status(200).json({
          status: "Succes",
          data: {
            doc,
          },
        });
      }
      return res.status(404).json({
        status: "No document with that id !!",
      });
    }
    return res.status(404).json({
      status: "You don't have the permission to do this action !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.deleteOneDesigner = (Model) => async (req, res, next) => {
  try {
    // Test if there is a designer
    const user = await User.findById(req.params.idDesigner);
    if (!user) {
      return res.status(400).send({
        message: "No user with that id !! ",
      });
    }
    currentUser = req.user;
    if (model.UserID == currentUser.id) {
      if (model.Done == false) {
        if (model.Hidden == false) {
          model.Hidden = true;
          //save the last changes
          model.save();
          return res.status(200).json({
            status: "Succes",
            data: null,
          });
        }
        return res.status(400).send({
          message: "That model is already deleted !!  ",
        });
      }
      const lngList = user.MyClothes.length;
      for (i = 0; i < lngList; i++) {
        // Test if the designer selected is exist
        const designerSelected = await User.findById(model.ListReqDesigner[i]);
        //Filter the id of Model from the list of request send
        designerSelected.ReqSendModel = designerSelected.ReqSendModel.filter(
          (e) => e._id != req.params.idModel
        );
        // Update all the last changes on the designer profile
        let designer = await User.findByIdAndUpdate(
          designerSelected.id,
          designerSelected,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      const lngListOffers = model.Offers.length;
      for (i = 0; i < lngListOffers; i++) {
        // Find offers and delete it
        const Offers = await Offer.findByIdAndDelete(model.Offers[i]);
      }
      //Filter the id of Model from the list of Models for current customer
      currentUser.MyModels = currentUser.MyModels.filter(
        (e) => e._id != req.params.idModel
      );
      // Update all the last changes on the current customer
      let user = await User.findByIdAndUpdate(currentUser.id, currentUser, {
        new: true,
        runValidators: true,
      });
      // Find Model and delete it
      const doc = await Model.findByIdAndDelete(req.params.idModel);
      if (doc) {
        return res.status(200).json({
          status: "Succes",
          data: null,
        });
      }
      return res.status(404).json({
        status: "You are not the responsible of this Model",
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.deleteOneCustomer = (Model) => async (req, res, next) => {
  try {
    // Find user and delete it
    const doc = await Model.findByIdAndDelete(req.params.idUser);
    if (!doc)
      return res.status(400).json({
        status: "No User with that id !!",
      });
    return res.status(200).json({
      status: "Succes",
      data: null,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.updateOneModel = (Model) => async (req, res, next) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !! ",
      });
    }
    // Test if current user was the owner of Model
    if (model.UserID == req.user.id) {
      // Update new changes
      let doc = await Model.findByIdAndUpdate(req.params.idModel, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({
        status: "Succes",
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the responsible of this model !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.deleteModel = (Model) => async (req, res, next) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !! ",
      });
    }

    currentUser = req.user;
    if (model.UserID == currentUser.id) {
      if (model.Done == true) {
        if (model.Hidden == false) {
          console.log(model);
          model.Hidden = true;
          //save the last changes
          model.save();
          return res.status(200).json({
            status: "Succes",
            data: null,
          });
        }
        return res.status(400).send({
          message: "That model is already deleted !!  ",
        });
      }
      const lngList = model.ListReqDesigner.length;
      for (i = 0; i < lngList; i++) {
        // Test if the designer selected is exist
        const designerSelected = await User.findById(model.ListReqDesigner[i]);
        //Filter the id of Model from the list of request send
        designerSelected.ReqSendModel = designerSelected.ReqSendModel.filter(
          (e) => e._id != req.params.idModel
        );
        // Update all the last changes on the designer profile
        let designer = await User.findByIdAndUpdate(
          designerSelected.id,
          designerSelected,
          {
            new: true,
            runValidators: true,
          }
        );
      }
      const lngListOffers = model.Offers.length;
      for (i = 0; i < lngListOffers; i++) {
        // Find offers and delete it
        const Offers = await Offer.findByIdAndDelete(model.Offers[i]);
      }
      //Filter the id of Model from the list of Models for current customer
      currentUser.MyModels = currentUser.MyModels.filter(
        (e) => e._id != req.params.idModel
      );
      // Update all the last changes on the current customer
      let user = await User.findByIdAndUpdate(currentUser.id, currentUser, {
        new: true,
        runValidators: true,
      });
      // Find Model and delete it
      const doc = await Model.findByIdAndDelete(req.params.idModel);
      if (doc) {
        return res.status(200).json({
          status: "Succes",
          data: null,
        });
      }
    }
    return res.status(404).json({
      status: "You are not the responsible of this Model",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.getAllUndoneModelsAdmin = (Model) => async (req, res, next) => {
  try {
    // Test if there is Models
    const doc = await Model.find({ Done: false });
    return res.status(200).json({
      status: "Succes",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

exports.getAllDoneModelsAdmin = (Model) => async (req, res, next) => {
  try {
    // Test if there is Models
    const doc = await Model.find({ Done: true });
    return res.status(200).json({
      status: "Succes",
      result: doc.length,
      data: {
        doc,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

//get request send to clothes by current designer
exports.getAllReq = (Model) => async (req, res) => {
  try {
    // find the profile of current user
    const user = await User.findById(req.user.id);
    let Models = user.ReqSendModel;
    // Test if List of send request is an empty List
    if (!Models.length) {
      return res
        .status(400)
        .send({ message: "You don't have any send request !! " });
    }
    return res.status(200).json({
      status: "Succes",
      Models,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};
