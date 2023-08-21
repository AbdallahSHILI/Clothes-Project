const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const userController = require("../Controllers/userController");

//create designer customer admin
router.post("/Signup", authController.signup);

//login by password & email
router.post("/Login", authController.login);

//List of all customers for admin
router.get(
  "/AllCustomers",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllCustomers
);

// List of all admins for admin
router.get(
  "/AllAdmins",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllAdmins
);

// List of all designers for admin
router.get(
  "/AllDesigners",
  authController.protect,
  authController.restrictTo("admin"),
  userController.findAllDesigners
);

//get profile by current user
router.get(
  "/Me",
  authController.protect,
  userController.getMe,
  userController.getUserById
);

//get user by id for admin
router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getUserById
);

//get designer by id for current customer
router.get(
  "/GetDesigner/:idDesigner",
  authController.protect,
  authController.restrictTo("customer"),
  userController.getDesignerById
);

//update user
router.patch("/:idUser", authController.protect, userController.updateUser);

//delete designer by admin
router.delete(
  "/:idDesigner",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteDesigner
);

//delete customer by admin
router.delete(
  "/:idCustomer",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteCustomer
);

module.exports = router;
