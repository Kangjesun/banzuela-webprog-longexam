const express = require("express");

const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getOrders);
router.get("/user/:userId", getMyOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
