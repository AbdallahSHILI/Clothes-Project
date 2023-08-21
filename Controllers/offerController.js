const Offer = require("../Models/offerModel");
const User = require("../Models/userModel");
const Model = require("../Models/modelModel");

// get all Offers maked by current designer
exports.myOffers = async (req, res) => {
  try {
    // Test if there is Offers
    const offers = await Offer.find({ DesignerID: req.user.id });
    // Test if designer have no Offers send
    if (offers.length == 0) {
      return res.status(400).send({ message: "You don't have any offers !! " });
    }
    return res.status(200).json({
      status: "Succes",
      offers,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};

// Get one Offer by current designer
exports.getMyOneOffer = async (req, res, next) => {
  try {
    // Test if there is an Offer
    const offer = await Offer.findById(req.params.idOffer);
    if (!offer) {
      return res.status(400).send({
        message: "No Offer with that id !! ",
      });
    }
    // Test if designer is the responsible of Offer
    if (offer.DesignerID == req.user.id) {
      return res.status(200).json({
        status: "Succes",
        offer,
      });
    }
    return res.status(404).json({
      status: "You are not the responsible of this offer !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// get all Offers of an specific Model by current customer
exports.findOffersModel = async (req, res) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    let Offers = model.Offers;
    // Test if current customer have no Offers
    if (Offers.length == 0) {
      return res.status(400).send({ message: "You don't have any offers !! " });
    }
    // Test if current customer is the owner of Model
    if (model.UserID == req.user.id) {
      return res.status(200).json({
        status: "Succes",
        Offers,
      });
    }
    return res
      .status(400)
      .send({ message: "You are not the responsible of this model !! " });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};

// get one Offer by current customer
exports.findOneOffer = async (req, res) => {
  try {
    // Test if there is an Offer
    const offer = await Offer.findById(req.params.idOffer);
    if (!offer) {
      return res.status(400).send({
        message: "No Offer with that id !! ",
      });
    }
    // Test if current customer is the the Offer's customer
    if (offer.CustomerID == req.user.id) {
      return res.status(200).json({
        status: "Succes",
        offer,
      });
    }
    return res.status(400).send({
      message: "You don't have the permission to do this action !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};

// Update one Offer by current designer
exports.updateOneOffer = async (req, res, next) => {
  try {
    // Test if there is an Offer
    const offer = await Offer.findById(req.params.idOffer);
    if (!offer) {
      return res.status(400).send({
        message: "No Offer with that id !! ",
      });
    }
    // Test if current designer is the the owner of Offer
    if (offer.DesignerID == req.user.id) {
      // Update changes in Offer
      let doc = await Offer.findByIdAndUpdate(req.params.idOffer, req.body, {
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
      status: "You are not the responsible of this offre !!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      data: err,
    });
  }
};

// get one Offer by admin
exports.findOneOfferAdmin = async (req, res) => {
  try {
    // Test if there is an Offer
    const offer = await Offer.findById(req.params.idOffer);
    if (offer) {
      return res.status(200).json({
        status: "Succes",
        offer,
      });
    }
    return res.status(400).send({
      message: "No Offer with that id !! ",
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};

// get all Offers of an specific Model by admin
exports.findOffersModelForAdmin = async (req, res) => {
  try {
    // Test if there is a Model
    const model = await Model.findById(req.params.idModel);
    let Offers = model.Offers;
    // Test if Model's Offers s an empty array
    if (Offers.length == 0) {
      return res.status(400).send({ message: "There is no offer !! " });
    }
    return res.status(200).json({
      status: "Succes",
      Offers,
    });
  } catch (err) {
    return res.status(404).json({
      status: "Echec",
      err,
    });
  }
};
