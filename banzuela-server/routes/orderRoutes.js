const express = require("express");

const {
  getOrders,
  getDashboardOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  cancelOrder,
} = require("../controllers/orderController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Admin
router.get("/", authentication, authorize("admin"), getOrders);

// Admin / Seller
router.get("/dashboard", authentication, authorize("admin", "seller"), getDashboardOrders);
router.put("/:id", authentication, authorize("admin", "seller"), updateOrder);

// Customer
router.get("/user/:userId", authentication, authorize("customer"), getMyOrders);
router.get("/:id", authentication, authorize("customer"), getOrderById);
router.post("/", authentication, authorize("customer"), createOrder);
router.delete("/:id/cancel", authentication, authorize("customer"), cancelOrder);

// Admin
router.delete("/admin/:id", authentication, authorize("admin"), deleteOrder);

module.exports = router;
