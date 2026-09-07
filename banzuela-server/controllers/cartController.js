const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");

const isOwnerOrAdmin = (req, userId) =>
    req.user?.role === "admin" ||
    req.user?.id === userId.toString();

// Get all carts
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate("user")
            .populate("items.product");

        res.status(HttpStatus.OK).json({
            success: true,
            carts,
        });
    } catch (error) {
        console.error("GET CARTS ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

// Get cart by ID
exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id)
            .populate("user")
            .populate("items.product");

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Cart not found",
            });
        }

        if (!isOwnerOrAdmin(req, cart.user._id)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to access this cart.",
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("GET CART BY ID ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// Get cart by user
exports.getCartByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isOwnerOrAdmin(req, userId)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to access this cart.",
            });
        }

        const cart = await Cart.findOne({ user: userId })
            .populate("user")
            .populate("items.product");

        if (!cart) {
            return res.status(HttpStatus.OK).json({
                success: true,
                cart: {
                    user: userId,
                    items: [],
                    totalPrice: 0,
                },
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("GET CART BY USER ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// Add product to cart
exports.createCart = async (req, res) => {
    try {
        const {
            userId,
            productId,
            quantity = 1,
        } = req.body;

        if (!userId || !productId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "userId and productId are required",
            });
        }

        if (!isOwnerOrAdmin(req, userId)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to modify this cart.",
            });
        }

        const numericQuantity = Number(quantity);

        if (
            !Number.isInteger(numericQuantity) ||
            numericQuantity < 1
        ) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock < numericQuantity) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0,
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId.toString()
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + numericQuantity;

            if (newQuantity > product.stock) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Not enough stock available",
                });
            }

            existingItem.quantity = newQuantity;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                product: product._id,
                quantity: numericQuantity,
                price: product.price,
            });
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("user")
            .populate("items.product");

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (!isOwnerOrAdmin(req, userId)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to modify this cart.",
            });
        }

        if (quantity === undefined || Number(quantity) < 1) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const numericQuantity = Number(quantity);

        if (!Number.isInteger(numericQuantity)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Quantity must be a whole number",
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() === productId.toString()
        );

        if (!item) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product is not in the cart",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product not found",
            });
        }

        if (numericQuantity > product.stock) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        item.quantity = numericQuantity;
        item.price = product.price;

        cart.totalPrice = cart.items.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("user")
            .populate("items.product");

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Cart updated successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("UPDATE CART ITEM ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// Remove product from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!isOwnerOrAdmin(req, userId)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to modify this cart.",
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Cart not found",
            });
        }

        const originalLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId.toString()
        );

        if (cart.items.length === originalLength) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Product is not in the cart",
            });
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("user")
            .populate("items.product");

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Product removed from cart",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("REMOVE CART ITEM ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

// Update cart
exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Cart not found",
            });
        }

        if (!isOwnerOrAdmin(req, cart.user)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to modify this cart.",
            });
        }

        if (req.body.items !== undefined) {
            cart.items = req.body.items;
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("user")
            .populate("items.product");

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Cart updated successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("UPDATE CART ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to clear this cart.",
      });
    }

    const cart = await Cart.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      cart,
    });
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
};

// Delete cart
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Cart not found",
            });
        }

        if (!isOwnerOrAdmin(req, cart.user)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: "You are not allowed to delete this cart.",
            });
        }

        await Cart.findByIdAndDelete(req.params.id);

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Cart deleted successfully",
        });
    } catch (error) {
        console.error("DELETE CART ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};
