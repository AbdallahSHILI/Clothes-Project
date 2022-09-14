const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const offerController = require("../Controllers/offerController");

// get one offer by current customer
router.get(
  "/getOneOffer/:idOffer",
  authController.protect,
  authController.restrictTo("customer"),
  offerController.findOneOffer
);

// get one offer by admin
router.get(
  "/Administrator/:idOffer",
  authController.protect,
  authController.restrictTo("admin"),
  offerController.findOneOfferAdmin
);

// get all send Offers by current designer
router.get(
  "/",
  authController.protect,
  authController.restrictTo("designer"),
  offerController.myOffers
);

// get one offer by current designer
router.get(
  "/:idOffer",
  authController.protect,
  authController.restrictTo("designer"),
  offerController.getMyOneOffer
);

// get all Offers of an specific Model by current customer
router.get(
  "/request/:idModel",
  authController.protect,
  authController.restrictTo("customer"),
  offerController.findOffersModel
);

// get all Offers of an specific Model for admin
router.get(
  "/AdministratorModel/:idModel",
  authController.protect,
  authController.restrictTo("admin"),
  offerController.findOffersModelForAdmin
);

//update an offer by a current designer
router.patch(
  "/:idOffer",
  authController.protect,
  authController.restrictTo("designer"),
  offerController.updateOneOffer
);

// get one offer by admin
router.get(
  "/Administrator/:idOffer",
  authController.protect,
  authController.restrictTo("admin"),
  offerController.findOneOfferAdmin
);

module.exports = router;
