const express = require("express");

const {
  getAllReviews,
  getReviewsByProduct,
  getProductsToReview,
  getReviewsByUser,
  getReviewsBySeller,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authentication = require("../middleware/authentication");
const authorize = require("../middleware/authorization");

const router = express.Router();

// Protected
router.get(
  "/",
  authentication,
  authorize("admin"),
  getAllReviews
);

router.get(
  "/product/:productId",
  authentication,
  getReviewsByProduct
);

router.get(
  "/to-review/:userId",
  authentication,
  authorize("customer"),
  getProductsToReview
);

router.get(
  "/user/:userId",
  authentication,
  authorize("customer"),
  getReviewsByUser
);

router.get(
  "/seller/:sellerId",
  authentication,
  authorize("admin", "seller"),
  getReviewsBySeller
);

router.post(
  "/:productId",
  authentication,
  authorize("customer"),
  createReview
);

router.put(
  "/:id",
  authentication,
  authorize("customer"),
  updateReview
);

router.delete(
  "/:id",
  authentication,
  authorize("customer"),
  deleteReview
);

module.exports = router;
