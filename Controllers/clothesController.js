const Clothes = require("../Models/ClothesModel");
const factoryTwo = require("./factoryTwo");
const User = require("../Models/UserModel");

// Create a new design
exports.createDesign = factory.createOne(Design);

// upload information about clothes
exports.sellOneClothes = factory.createOne(Clothes);

//get all clothes by current client
exports.findAllClothes = async (req, res) => {
  try {
    // Test if there is clothes
    const clothes = await Clothes.find({
      UserID: req.user.id,
    });
    if (!clothes) {
      return res.status(400).send({ message: "You don't have any clothes " });
    }
    return res.status(200).json({
      status: "succes",
      clothes,
    });
  } catch (err) {
    return res.status(404).json({
      status: "echec",
      err,
    });
  }
};

//get one clothes by cuurent user
exports.getOneClothesById = async (req, res) => {
  try {
    // Test if there is a clothes by id
    const clothes = await Clothes.findById(req.params.idClothes);
    if (!clothes) {
      return res.status(400).send({
        message: "No clothes with that id !! ",
      });
    }
    if (clothes.UserID == req.user.id) {
      return res.status(200).json({
        status: "succès",
        data: {
          clothes,
        },
      });
    }
    return res.status(404).json({
      status: "You are not the respansble of this clothes",
    });
  } catch (err) {
    return res.status(404).json({
      status: "échouer",
      data: err,
    });
  }
};
