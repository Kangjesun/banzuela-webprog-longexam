const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected
router.post(
  "/",
  authentication,
  authorize("admin", "seller"),
  createProduct
);

router.put(
  "/:id",
  authentication,
  authorize("admin", "seller"),
  updateProduct
);

router.delete(
  "/:id",
  authentication,
  authorize("admin", "seller"),
  deleteProduct
);

module.exports = router;
