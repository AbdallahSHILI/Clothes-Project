const express = require("express");
const router = express.Router();
const clothesController = require("../Controllers/clothesController");
const authController = require("../Controllers/authController");
const upload = require("../Middleware/upload");

// Add new clothes
router.post(
  "/New",
  authController.protect,
  authController.restrictTo("designer"),
  upload.single("Image"),
  clothesController.AddOneClothes
);

// Send request to buy one clothes by current customer
router.post(
  "/ReqByClothes/:idClothes",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.ReqBuyOneClothes
);

// get all own clothes by current designer
router.get(
  "/MyAllClothes",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.getMyAllClothes
);

// get all clothes by admin
router.get(
  "/AllClothes",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.findAllClothes
);

//get all models that current designer send a request for it and he was accepted
router.get(
  "/MyMissions",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.getAllNewMissions
);

//get all models that current designer send a request for it
router.get(
  "/MySendRequest",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.findSendRequestDesigner
);

// get one own clothes by current designer
router.get(
  "/MyAllClothes/:idClothes",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.findMyOneClothes
);

//get models of current customer
router.get(
  "/MyModels",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.getModelsCustomer
);

// get all undone models for current customer
router.get(
  "/UndoneModels",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.findAllUndoneModels
);

// get all done models for current customer
router.get(
  "/DoneModels",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.findAllDoneModels
);

//get one model by current customer
router.get(
  "/MyModels/:idModel",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.getOneModelCustomer
);

//update model by current customer
router.patch(
  "/:idModel",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.updateModel
);

// Create a new model
router.post(
  "/",
  authController.protect,
  authController.restrictTo("customer"),
  upload.single("Image"),
  clothesController.createModel
);

// Retrieve all models
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.getAllModelsAdmin
);

// get all models that current designer does'nt send any request to it
router.get(
  "/AllUnknownModels",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.findAllUnknownModels
);

// Get one model by current designer
router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.getOneModelForDesigner
);

// Get one model by admin
router.get(
  "/Administrator/:id",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.getOneModelForAdmin
);

// get all undone models for admin
router.get(
  "/Admin/UndoneModels",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.findAllUndoneModelsAdmin
);

// get all done models for admin
router.get(
  "/Admin/DoneModels",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.findAllDoneModelsAdmin
);

// cancel a request to a Model by current designer
router.delete(
  "/CancelReq/:idModel/:idOffer",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.cancelRequestDeleteOffer
);

//Perform an designer to a model by current customer
router.patch(
  "/Perform/:idModel/:idDesigner",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.PerformDesignerToModel
);

//delete one model by admin
router.delete(
  "/adminDeleteModel/:idModel",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.deleteModelAdmin
);

// Rate an designer by current customer
router.post(
  "/Rate/:idModel/:idDesigner",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.Rate
);

//delete one clothes by admin
router.delete(
  "/adminDeleteClothes/:idClothes",
  authController.protect,
  authController.restrictTo("admin"),
  clothesController.deleteClothesAdmin
);

//delete one model by current customer
router.delete(
  "/:idModel",
  authController.protect,
  authController.restrictTo("customer"),
  clothesController.deleteOneModel
);

//get one model that current designer send a request for it and he was accepted
router.get(
  "/MyMissions/:idModel",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.getOneMission
);

// Send a request to an model by current designer
router.post(
  "/SendRequest/:idModel",
  authController.protect,
  authController.restrictTo("designer"),
  clothesController.sendRequestAndOfferToModel
);

module.exports = router;
