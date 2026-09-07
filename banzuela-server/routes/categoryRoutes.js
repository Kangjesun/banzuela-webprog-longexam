const express = require("express");

const {
  getCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Public
router.get("/", getCategory);
router.get("/:id", getCategoryById);

// Protected
router.post(
  "/",
  authentication,
  authorize("admin", "seller"),
  createCategory
);

router.put(
  "/:id",
  authentication,
  authorize("admin", "seller"),
  updateCategory
);

router.delete(
  "/:id",
  authentication,
  authorize("admin", "seller"),
  deleteCategory
);

module.exports = router;
