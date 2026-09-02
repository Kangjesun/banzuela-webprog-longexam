const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllReviews,
  getReviewsByUser,
  getProductsToReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewsBySeller,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", authMiddleware, getAllReviews);

router.get(
  "/to-review/:userId",
  authMiddleware,
  getProductsToReview
);

router.get(
  "/user/:userId",
  authMiddleware,
  getReviewsByUser
);

router.get(
  "/seller/:sellerId",
  authMiddleware,
  getReviewsBySeller
);

router.post(
  "/:productId",
  authMiddleware,
  createReview
);

router.put(
  "/:id",
  authMiddleware,
  updateReview
);

router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

module.exports = router;