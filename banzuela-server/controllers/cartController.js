const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { HttpStatus } = require('../config/constants');

// GET ALL CARTS
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate('user')
            .populate('items.product');

        res.status(HttpStatus.OK).json(carts);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// GET CART BY ID
exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id)
            .populate('user')
            .populate('items.product');

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// GET CART BY USER
exports.getCartByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId })
            .populate('user')
            .populate('items.product');

        if (!cart) {
            return res.status(HttpStatus.OK).json({
                success: true,
                cart: {
                    user: userId,
                    items: [],
                    totalPrice: 0
                }
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// ADD PRODUCT TO CART
exports.createCart = async (req, res) => {
    try {
        const {
            userId,
            productId,
            quantity = 1
        } = req.body;

        if (!userId || !productId) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'userId and productId are required'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId.toString()
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Not enough stock available'
                });
            }

            existingItem.quantity = newQuantity;
            existingItem.price = product.price;
        } else {
            cart.items.push({
                product: product._id,
                quantity: Number(quantity),
                price: product.price
            });
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('user')
            .populate('items.product');

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'Product added to cart successfully',
            cart: populatedCart
        });
    } catch (error) {
        console.error('ADD TO CART ERROR:', error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CART ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || Number(quantity) < 1) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId.toString()
        );

        if (!item) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product is not in the cart'
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (Number(quantity) > product.stock) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        item.quantity = Number(quantity);
        item.price = product.price;

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('user')
            .populate('items.product');

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Cart updated successfully',
            cart: populatedCart
        });
    } catch (error) {
        console.error('UPDATE CART ITEM ERROR:', error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// REMOVE PRODUCT FROM CART
exports.removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const originalLength = cart.items.length;

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId.toString()
        );

        if (cart.items.length === originalLength) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product is not in the cart'
            });
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate('user')
            .populate('items.product');

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Product removed from cart',
            cart: populatedCart
        });
    } catch (error) {
        console.error('REMOVE CART ITEM ERROR:', error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE ENTIRE CART
exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('user')
            .populate('items.product');

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE ENTIRE CART
exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);

        if (!cart) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Cart deleted successfully'
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
