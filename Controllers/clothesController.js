const Model = require("../Models/modelModel");
const factory = require("./factoryOne");
const User = require("../Models/userModel");
const Offer = require("../Models/offerModel");
const Clothes = require("../Models/clothesModel");

// Create and Save a new Model
exports.createModel = factory.createOne(Model);

// Create and Save a new Clothes
exports.AddOneClothes = factory.addOne(Clothes);

// Delete an Model with a specified Id in the request for current customer
exports.deleteOneModel = factory.deleteModel(Model);

// Update an Model identified by the Id in the request for current customer
exports.updateModel = factory.updateOneModel(Model);

// Find all Models for admin
exports.getAllModelsAdmin = factory.findAll(Model);

// Find all clothes for admin
exports.findAllClothes = factory.findAll(Clothes);

// Find an Model with an Id for designer
exports.getOneModelForDesigner = factory.findOne(Model);

// Find an Model with an Id for admin
exports.getOneModelForAdmin = factory.findOneModelAdmin(Model);

// Find all undone Models for admin
exports.findAllUndoneModelsAdmin = factory.getAllUndoneModelsAdmin(Model);

// Find all done Models for admin
exports.findAllDoneModelsAdmin = factory.getAllDoneModelsAdmin(Model);

// Get all send request by current designer
exports.findSendRequestDesigner = factory.getAllReq(Model);

// Send a request to a specific Model by current designer
exports.sendRequestAndOfferToModel = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a Model
    let model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !! ",
      });
    }
    // Test if the Model was done
    if (model.Done == false) {
      // Test if the current designer send a request
      if (model.ListReqDesigner.includes(currentUser.id)) {
        return res.status(400).send({
          message: "You already send a request to this model !! ",
        });
      }
      // Create an offer
      const offer = await Offer.create(req.body);
      // Push information of designer , Model , customer on the offer
      await Offer.findByIdAndUpdate(offer.id, {
        $push: {
          DesignerID: req.user.id,
          ModelID: req.params.idModel,
          CustomerID: model.UserID,
        },
      });
      //Add th id of offer in the specific Model
      await Model.findByIdAndUpdate(req.params.idModel, {
        $push: { Offers: offer.id, ListReqDesigner: currentUser.id },
      });
      //Add the id of offer and the id of Model in the profile current designer
      await User.findByIdAndUpdate(currentUser.id, {
        $push: {
          ReqSendModel: req.params.idModel,
          OfferSend: offer.id,
        },
      });
      return res.status(200).json({
        status: "Succes",
        data: {
          currentUser,
        },
      });
    }
    return res.status(404).json({
      status: "That model was already done !! ",
      err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// Cancel request and delete offer for a current designer
exports.cancelRequestDeleteOffer = async (req, res) => {
  try {
    let userToEdit = req.user;

    // Test if there is a Model
    let model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !! ",
      });
    }
    // Test if there is an offer
    let offer = await Offer.findById(req.params.idOffer);
    if (!offer) {
      return res.status(400).send({
        message: "No offer with that id !! ",
      });
    }

    // Test if the current designer send a request
    if (!model.ListReqDesigner.includes(userToEdit.id)) {
      return res.status(400).send({
        message: "You don't send any request to this model !! ",
      });
    }

    // Test if the current designer is the responsible to the specific Model
    // the responsible designer can't cancel his request
    if (!model.ResponsibleDesigner.includes(userToEdit.id)) {
      //Filter the id of the current designer from the list of request in a specific Model
      model.ListReqDesigner = model.ListReqDesigner.filter(
        (e) => e._id != userToEdit.id
      );
      //Filter the id of an offer from the list of Offers in a specific Model
      model.Offers = model.Offers.filter((e) => e._id != req.params.idOffer);
      // Update all the last changes on Model

      let doc = await Model.findByIdAndUpdate(model.id, model, {
        new: true,
        runValidators: true,
      });
      //Filter the id of a specific Model from the list of Models that the current designer send request to them
      userToEdit.ReqSendModel = userToEdit.ReqSendModel.filter(
        (e) => e._id != req.params.idModel
      );
      //Filter the id of a specific offer from the list of Offers that the current designer send it to a specific Model
      userToEdit.OfferSend = userToEdit.OfferSend.filter(
        (e) => e._id != req.params.idOffer
      );
      // Update all the last changes on the current designer
      let user = await User.findByIdAndUpdate(userToEdit.id, userToEdit, {
        new: true,
        runValidators: true,
      });
      //delete the specific offer
      const offer2 = await Offer.findByIdAndDelete(req.params.idOffer);
      if (user) {
        return res.status(200).json({
          status: "Your request was deleted",
          data: {
            user,
          },
        });
      }
    }
    return res.status(400).send({
      message:
        "You are the responsible of this model , You can't cancel the request !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// Perform an designer to a Model by current customer and change the  Model's status
exports.PerformDesignerToModel = async (req, res) => {
  try {
    // Test if there is a Model
    let model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !!",
      });
    }
    // Test if the current designer is the maker of the specific Model
    if (model.UserID == req.user.id) {
      // Test if the current customer choose an designer to be the responsible to the Model
      if (!model.ResponsibleDesigner.includes(req.params.idDesigner)) {
        console.log(model);
        // Test if the designer already send a request to the specific Model
        if (model.ListReqDesigner.includes(req.params.idDesigner)) {
          //Make the specific designer a responsible to the specific Model
          model.ResponsibleDesigner = req.params.idDesigner;
          //Change the status of th Model
          model.Done = true;
          (model.AcceptedOffer = true),
            //Push id of Model into the list of incomplet Model in profile of designer
            await User.findByIdAndUpdate(req.params.idDesigner, {
              $push: { ModelsIncomplet: req.params.idModel },
            });
          //save the last changes
          model.save();
          return res.status(200).send({
            status: "Succes",
            data: {
              model,
            },
          });
        }
        return res.status(400).send({
          message: "That designer don't send any request to this model !! ",
        });
      }
      return res.status(400).send({
        message: "You already select an designer to this model !! ",
      });
    }
    return res.status(400).send({
      message: "You are not the responsible of this model!! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// Find all unreached Models for current customer and admin
exports.findAllUndoneModels = async (req, res) => {
  try {
    // Test if there is a Model
    const Models = await Model.find({
      Hidden: false,
      Done: false,
      UserID: req.user.id,
    });
    if (!Models) {
      return res
        .status(400)
        .send({ message: "You don't have any undone models !! " });
    }
    return res.status(200).json({
      status: "Succes",
      Models,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// Find all reached Models for current customer and admin
exports.findAllDoneModels = async (req, res) => {
  try {
    // Test if there is a Model
    const Models = await Model.find({
      Hidden: false,
      Done: true,
      UserID: req.user.id,
    });
    if (!Models) {
      return res
        .status(400)
        .send({ message: "You don't have any done models !! " });
    }
    return res.status(200).json({
      status: "Succes",
      Models,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// delete one Model for admin
exports.deleteModelAdmin = async (req, res, next) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !!",
      });
    }
    // Test if the Model already have an designer responsible (done model)
    if (model.Done == true) {
      return res.status(400).send({
        message: "You don't have the permission to do this action !! ",
      });
    }
    const lngList = model.ListReqDesigner.length;
    // enter into the list of designer request
    for (i = 0; i < lngList; i++) {
      // select designer
      const designerSelected = await User.findById(model.ListReqDesigner[i]);
      designerSelected.ReqSendModel =
        //Filter the id of Model from the list of request send
        designerSelected.ReqSendModel.filter(
          (e) => e._id != req.params.idModel
        );
      let user1 = await User.findByIdAndUpdate(
        designerSelected.id,
        designerSelected,
        {
          new: true,
          runValidators: true,
        }
      );
    }
    // Update all the last changes on the designer
    const lngListOffers = model.Offers.length;
    for (i = 0; i < lngListOffers; i++) {
      const offers = await Offer.findByIdAndDelete(Model.Offers[i]);
    }
    customerResponsible = await User.findById({ _id: Model.UserID });
    //Filter the id of Modelan from the List of Models of  an customer
    customerResponsible.MyModels = customerResponsible.MyModels.filter(
      (e) => e._id != req.params.idModel
    );
    // Update all the last changes on the designer profile
    let user2 = await User.findByIdAndUpdate(
      customerResponsible.id,
      customerResponsible,
      {
        new: true,
        runValidators: true,
      }
    );
    const doc = await Model.findByIdAndDelete(req.params.idModel);
    if (doc) {
      return res.status(200).json({
        status: "Succes",
        data: null,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// delete one Clothes for admin
exports.deleteClothesAdmin = async (req, res, next) => {
  try {
    // Test if there is a clothes
    const clothes = await Clothes.findById(req.params.idClothes);
    if (!clothes) {
      return res.status(400).send({
        message: "No clothes with that id !!",
      });
    }
    // Test if the clothes already sold out
    if (clothes.SoldOut == true) {
      return res.status(400).send({
        message: "You don't have the permission to do this action !! ",
      });
    }

    const lngList = clothes.ListReqCustomers.length;
    // enter into the list of designer request
    for (i = 0; i < lngList; i++) {
      // select designer
      const customerSelected = await User.findById(clothes.ListReqCustomers[i]);
      customerSelected.ReqSendClothes =
        //Filter the id of Model from the list of request send
        customerSelected.ReqSendClothes.filter(
          (e) => e._id != req.params.idClothes
        );
      // Update all the last changes on the designer
      let user1 = await User.findByIdAndUpdate(
        customerSelected.id,
        customerSelected,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    CurrentDesigner = await User.findById({ _id: clothes.DesignerID });
    //Filter the id of Model an from the List of Models of  an customer
    CurrentDesigner.MyClothes = CurrentDesigner.MyClothes.filter(
      (e) => e._id != req.params.idClothes
    );
    // Update all the last changes on the designer profile
    let user2 = await User.findByIdAndUpdate(
      CurrentDesigner.id,
      CurrentDesigner,
      {
        new: true,
        runValidators: true,
      }
    );
    const doc = await Clothes.findByIdAndDelete(req.params.idClothes);
    if (doc) {
      return res.status(200).json({
        status: "Succes",
        data: null,
      });
    }
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

//get Models by current customer
exports.getModelsCustomer = async (req, res) => {
  try {
    // Test if there is a Model
    const Models = await Model.find({
      UserID: req.user.id,
      Hidden: false,
    });
    if (!Models) {
      return res.status(400).send({ message: "You don't have any Model !! " });
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

//get one Model by current user
exports.getOneModelCustomer = async (req, res) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No model with that id !! ",
      });
    }
    // Test if current customer is the responsible of the Model
    if (model.UserID == req.user.id) {
      // Test if Model was already invisible from current customer
      if (model.Hidden == true) {
        return res.status(400).send({
          message: "You delete this model !!",
        });
      }
      return res.status(200).json({
        status: "Succes",
        data: {
          model,
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

//get clothes by current designer
exports.getMyAllClothes = async (req, res) => {
  try {
    // Test if there is clothes
    const clothes = await Clothes.find({
      DesignerID: req.user.id,
      Hidden: false,
    });

    if (!clothes) {
      return res
        .status(400)
        .send({ message: "You don't have any clothes !! " });
    }
    return res.status(200).json({
      status: "Succes",
      clothes,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};

//get one clothes by current designer
exports.findMyOneClothes = async (req, res) => {
  try {
    // Test if there is a Model
    const clothes = await Clothes.findById(req.params.idClothes);
    if (!clothes) {
      return res.status(400).send({
        message: "No clothes with that id !! ",
      });
    }
    // Test if current  designer is the responsible of the clothes
    if (clothes.DesignerID == req.user.id) {
      // Test if clothes was already invisible from current designer
      if (clothes.Hidden == true) {
        return res.status(400).send({
          message: "You delete this clothes !!",
        });
      }
      return res.status(200).json({
        status: "Succes",
        data: {
          clothes,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the responsible of this clothes !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// rating of an designer by current user
exports.Rate = async (req, res) => {
  try {
    const Rating = req.body;
    // Test if there is an designer
    const designer = await User.findById(req.params.idDesigner);
    if (!designer) {
      return res.status(400).send({
        message: "No designer with that id !!",
      });
    }
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    if (!model) {
      return res.status(400).send({
        message: "No Model with that id !! ",
      });
    }
    // Test if Model's responsible id already review
    if (model.ResponsibleDesignerRate == true) {
      return res.status(400).send({
        message: "You already rate this designer !! ",
      });
    }
    // Test if the designer is the responsible of Model
    if (designer.id == model.ResponsibleDesigner) {
      // Test if the Model is already done
      if (model.Done == true) {
        // Create review
        const rate = {
          Name: req.user.Name,
          Rating: req.body.Rating,
          CustomerID: req.user.id,
          DesignerID: designer.id,
        };
        // Test if designer has rate under 1
        if (rate.Rating <= 1) {
          designer.NumberNegRate++;
        } else {
          designer.NumberNegRate = designer.NumberNegRate + 0;
        }
        // Push review into profile of designer
        designer.Rate.push(rate);
        // Convert rate to int
        designer.TabRate.push(parseInt(Rating));
        designer.NumRate = designer.Rate.length;
        // Calculate new rate of designer
        const ev =
          designer.TabRate.reduce((acc, item) => acc + item, 0) /
          designer.NumRate;
        // push new rate into profile of designer
        designer.Rating = ev;
        // Update all the last changes on the designer profile
        await User.findByIdAndUpdate(req.params.idDesigner, designer, {
          new: true,
          runValidators: true,
        });
        // Change the status of designer's rate to be already review
        model.ResponsibleDesignerRate = true;
        //save the last changes
        await model.save();
        return res.status(200).json({
          status: "Rate done !!",
          data: {
            designer,
          },
        });
      }
      return res.status(400).send({
        message: "You can't rate now , because this model not finished !! ",
      });
    }
    return res.status(400).send({
      message: "This designer are not the responsible of this model",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};

// Get all Models that current designer don't send request to it and open Models
exports.findAllUnknownModels = async (req, res, next) => {
  try {
    // Test if there is a Model
    const doc = await Model.find({
      ListReqDesigner: { $ne: req.user.id },
      Done: false,
    });
    if (doc) {
      return res.status(200).json({
        status: "Succes",
        result: doc.length,
        data: {
          doc,
        },
      });
    }
    return res.status(404).json({
      status: "There is no doc !! ",
      data: err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// Get all Models that current designer was accepted in it
exports.getAllNewMissions = async (req, res, next) => {
  try {
    // Test if there is new accepted Models
    const Missions = await Model.find({
      ResponsibleDesigner: req.user.id,
      AcceptedOffer: true,
    });
    if (Missions) {
      return res.status(200).json({
        status: "Succes",
        resultat: Missions.length,
        data: {
          Missions,
        },
      });
    }
    return res.status(400).json({
      status: "There is no missions !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// Get one Model that current designer was accepted in it
exports.getOneMission = async (req, res, next) => {
  try {
    // Test if there is Model
    const Mission = await Model.findById(req.params.idModel);
    if (Mission) {
      // Test if the current designer is the responsible of Model
      if (Mission.ResponsibleDesigner == req.user.id) {
        return res.status(200).json({
          status: "Succes",
          data: {
            Mission,
          },
        });
      }
    }
    return res.status(400).json({
      status: "There is no mission !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// Send request to buy one clothes by current customer
exports.ReqBuyOneClothes = async (req, res) => {
  try {
    currentUser = req.user;
    // Test if there is a Model
    let clothes = await Clothes.findById(req.params.idClothes);
    if (!clothes) {
      return res.status(400).send({
        message: "No clothes with that id !! ",
      });
    }
    // Test if the clothes was sold out
    if (clothes.SoldOut == false) {
      // Test if the current customer send a request
      if (clothes.ListReqCustomers.includes(currentUser.id)) {
        return res.status(400).send({
          message: "You already send a request to this clothes !! ",
        });
      }
      //Add th id of current customer in clothes
      await Clothes.findByIdAndUpdate(req.params.idClothes, {
        $push: { ListReqCustomers: currentUser.id },
      });
      //Add the id of clothes in the profile current customer
      await User.findByIdAndUpdate(currentUser.id, {
        $push: {
          ReqSendClothes: req.params.idClothes,
        },
      });
      return res.status(200).json({
        status: "Succes",
        data: {
          currentUser,
        },
      });
    }
    return res.status(404).json({
      status: "That clothes was already sould out !! ",
      err,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      message: err,
    });
  }
};
