const Order = require("../models/orderModel");
const { HttpStatus } = require("../config/constants");

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "-password")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(HttpStatus.OK).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve orders.",
      error: error.message,
    });
  }
};

// Dashboard orders
exports.getDashboardOrders = async (req, res) => {
  try {
    const { role, sellerId, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (req.user?.role === "seller") {
      const Product = require("../models/productModel");

      const products = await Product.find({
        seller: req.user.id,
      }).select("_id");

      filter["items.product"] = {
        $in: products.map((p) => p._id),
      };
    } else if (role === "seller" && sellerId) {
      const Product = require("../models/productModel");

      const products = await Product.find({
        seller: sellerId,
      }).select("_id");

      filter["items.product"] = {
        $in: products.map((p) => p._id),
      };
    }

    const orders = await Order.find(filter)
      .populate("user", "-password")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(HttpStatus.OK).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Dashboard Orders Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve dashboard orders.",
      error: error.message,
    });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (
      req.user?.role !== "admin" &&
      req.user?.id !== userId
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "You are not allowed to access these orders.",
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("user", "-password")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(HttpStatus.OK).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve your orders.",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "-password")
      .populate("items.product");

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (req.user?.role !== "admin") {
      const orderUserId =
        order.user?._id?.toString() ||
        order.user?.toString();

      if (orderUserId !== req.user?.id) {
        return res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "You are not allowed to access this order.",
        });
      }
    }

    return res.status(HttpStatus.OK).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve the order.",
      error: error.message,
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const user = req.user?.id;

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    if (totalAmount === undefined || totalAmount === null) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Total amount is required.",
      });
    }

    if (!shippingAddress?.trim()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    if (!paymentMethod?.trim()) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    const order = new Order({
      user,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    const savedOrder = await order.save();

    const populatedOrder = await Order.findById(
      savedOrder._id
    )
      .populate("user", "-password")
      .populate("items.product");

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Order created successfully.",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }

    const allowedFields = [
      "status",
      "shippingAddress",
      "paymentMethod",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(
      updatedOrder._id
    )
      .populate("user", "-password")
      .populate("items.product");

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Order updated successfully.",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update order.",
      error: error.message,
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete order.",
      error: error.message,
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Make sure the customer owns this order
    const orderUserId = order.user?.toString();

    if (orderUserId !== req.user?.id) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: "You are not allowed to cancel this order.",
      });
    }

    // Only pending orders can be cancelled
    if (order.status?.toLowerCase() !== "pending") {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Only pending orders can be cancelled.",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Order cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to cancel order.",
      error: error.message,
    });
  }
};