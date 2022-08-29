const express = require("express");
const router = express.Router();
const clothesController = require("../controllers/clothesController");

//Create Design by current client
router.post(
  "/CreateDesign",
  authController.protect,
  authController.restrictTo("client"),
  clothesController.createDesignClothes
);

//Sell clothes by current designer
router.post(
  "/SellClothes",
  authController.protect,
  authController.restrictTo("client"),
  clothesController.sellOneClothes
);

//Reserve one design by cuurent designer
router.patch(
  "/DesigneReserve/:idDesign",
  authController.protect,
  authController.restrictTo("designer"),
  commandeController.ReserveOneDesign
);

// Liste of clothes
router.get(
  "/AllClothes",
  authController.protect,
  authController.restrictTo("client"),
  userController.findAllClothes
);

//get clothes by id for current client
router.get(
  "/:idClothes",
  authController.protect,
  authController.restrictTo("client"),
  userController.getOneClothesById
);

//Reserve one clothes by cuurent client
router.patch(
  "/Resrve/:idClothes",
  authController.protect,
  authController.restrictTo("client"),
  commandeController.ReserveOneClothes
);

//Perform an employee to a commande by cuurent client
router.patch(
  "/Choose/:idClothes/:idClient",
  authController.protect,
  authController.restrictTo("designer"),
  commandeController.ChooseClientToClothes
);

//update condition of one clothes by a currrent designer
router.patch(
  "/condition/:idClothes",
  authController.protect,
  authController.restrictTo("designer"),
  commandeController.changeClothesCondition
);

// Get one clothes for an admin
router.get(
  "/Administrator/:idClothes",
  authController.protect,
  authController.restrictTo("admin"),
  commandeController.getOneClothesForAdmn
);

module.exports = router;
