const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//create ew compte
router.post("/signup", authController.signup);

//login by adress and psw
router.post("/login", authController.login);

//get profil by current user
router.get(
  "/me",
  authController.protect,
  //  req.user.id and put it in req.params.id
  userController.getMe,
  userController.getUserById
);

// Liste of all clients for admin
router.get(
  "/AllClients",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllClients
);

// Liste of all admins for admin
router.get(
  "/AllAdmins",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllAdmins
);

router.get(
  "/AllDesigner",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllDesigners
);

//get user by id for admin
router.get(
  "/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getUserById
);

//get designer by id for current client
router.get(
  "/getDesigner/:idDesigner",
  authController.protect,
  authController.restrictTo("client"),
  userController.getDesignerById
);

//update user
router.patch("/:id", authController.protect, userController.updateUser);

//delete user for admin
router.delete(
  "/:idUser",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
