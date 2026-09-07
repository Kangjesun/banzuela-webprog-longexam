const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");

// GET ALL REVIEWS
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET ALL REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET REVIEWS BY PRODUCT
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS BY PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET REVIEWS BY USER
exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({
      user: userId,
    })
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS BY USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCTS TO REVIEW
exports.getProductsToReview = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviewedProducts = await Review.find({
      user: userId,
    }).select("product");

    const reviewedProductIds = reviewedProducts
      .filter((review) => review.product)
      .map((review) => review.product.toString());

    const orders = await Order.find({
      user: userId,
      $or: [
        { status: "Delivered" },
        { status: "delivered" },
        { orderStatus: "Delivered" },
        { orderStatus: "delivered" },
      ],
    }).populate("items.product");

    const products = [];

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) {
        return;
      }

      order.items.forEach((item) => {
        if (!item.product) {
          return;
        }

        const productId = item.product._id.toString();

        if (reviewedProductIds.includes(productId)) {
          return;
        }

        const alreadyAdded = products.some(
          (existing) =>
            existing.product._id.toString() === productId
        );

        if (!alreadyAdded) {
          products.push({
            product: item.product,
            quantity: item.quantity,
            orderId: order._id,
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS TO REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE REVIEW
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const { rating, comment } = req.body;

    if (
      rating === undefined ||
      rating === null ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required.",
      });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const createdReview = await Review.findById(review._id)
      .populate("user")
      .populate("product");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: createdReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE REVIEW
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5.",
        });
      }

      review.rating = numericRating;
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment is required.",
        });
      }

      review.comment = comment.trim();
    }

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user")
      .populate("product");

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET REVIEWS BY SELLER
exports.getReviewsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const Product = require("../models/productModel");

    const sellerProducts = await Product.find({
      seller: sellerId,
    }).select("_id");

    const productIds = sellerProducts.map(
      (product) => product._id
    );

    const reviews = await Review.find({
      product: {
        $in: productIds,
      },
    })
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS BY SELLER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};