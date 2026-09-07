const express = require("express");

const {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Protected
router.get("/", authentication, authorize("admin"), getCarts);
router.get("/user/:userId", authentication, authorize("customer"), getCartByUser);
router.delete("/user/:userId", authentication, authorize("customer"), clearCart);
router.patch("/user/:userId/item/:productId", authentication, authorize("customer"), updateCartItem);
router.delete("/user/:userId/item/:productId", authentication, authorize("customer"), removeCartItem);
router.post("/", authentication, authorize("customer"), createCart);
router.put("/:id", authentication, authorize("customer"), updateCart);
router.delete("/:id", authentication, authorize("customer"), deleteCart);
router.get("/:id", authentication, authorize("customer"), getCartById);

module.exports = router;
