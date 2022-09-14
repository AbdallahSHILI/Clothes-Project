const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/messageController");
const authController = require("../Controllers/authController");

// Send a message to admin by current customer
router.post(
  "/",
  authController.protect,
  authController.restrictTo("customer", "designer"),
  messageController.sendMessage
);

// Get all messages for admin
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getAllMessages
);

// Get all unread messages for admin
router.get(
  "/unreadMessages",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getAllUnreadMessage
);

// Get one message for admin
router.get(
  "/:idMessage",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.getOneMessage
);

// delete an message for admin
router.delete(
  "/:idMessage",
  authController.protect,
  authController.restrictTo("admin"),
  messageController.deleteOneMessageAdmin
);

module.exports = router;
