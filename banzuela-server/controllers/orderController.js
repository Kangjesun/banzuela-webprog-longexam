const Order = require("../models/orderModel");
const { HttpStatus } = require("../config/constants");

// GET ALL ORDERS
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.product")
            .sort({ orderDate: -1 });

        res.status(HttpStatus.OK).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("GET ALL ORDERS ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// GET DASHBOARD ORDERS
exports.getDashboardOrders = async (req, res) => {
    try {
        const { role, sellerId, status } = req.query;

        let filter = {};

        // Seller filtering can be added when Order has seller information
        if (role === "seller" && sellerId) {
            // filter.seller = sellerId;
        }

        if (
            status &&
            status !== "all" &&
            status !== "All"
        ) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate("user")
            .populate("items.product")
            .sort({ orderDate: -1 });

        const totalOrders = orders.length;

        const pendingOrders = orders.filter(
            (order) => order.status === "Pending"
        ).length;

        const processingOrders = orders.filter(
            (order) => order.status === "Processing"
        ).length;

        const shippedOrders = orders.filter(
            (order) => order.status === "Shipped"
        ).length;

        const deliveredOrders = orders.filter(
            (order) => order.status === "Delivered"
        ).length;

        const cancelledOrders = orders.filter(
            (order) => order.status === "Cancelled"
        ).length;

        const totalSales = orders
            .filter((order) => order.status !== "Cancelled")
            .reduce(
                (total, order) =>
                    total + Number(order.totalAmount || 0),
                0
            );

        res.status(HttpStatus.OK).json({
            success: true,
            orders,
            summary: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalSales
            }
        });
    } catch (error) {
        console.error("GET DASHBOARD ORDERS ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// GET ORDERS BY USER
exports.getMyOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({
            user: userId
        })
            .populate("items.product")
            .sort({ orderDate: -1 });

        res.status(HttpStatus.OK).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("GET USER ORDERS ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user")
            .populate("items.product");

        if (!order) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("GET ORDER BY ID ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        console.log("CREATE ORDER BODY:", req.body);

        const {
            user,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "User is required."
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Order must contain at least one item."
            });
        }

        if (totalAmount === undefined || totalAmount === null) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Total amount is required."
            });
        }

        if (!shippingAddress) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Shipping address is required."
            });
        }

        if (!paymentMethod) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Payment method is required."
            });
        }

        const order = await Order.create({
            user,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        const createdOrder = await Order.findById(order._id)
            .populate("user")
            .populate("items.product");

        console.log("ORDER CREATED:", createdOrder._id);

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: "Order created successfully",
            order: createdOrder
        });
    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE ORDER
exports.updateOrder = async (req, res) => {
    try {
        console.log(
            "UPDATE ORDER:",
            req.params.id,
            req.body
        );

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("user")
            .populate("items.product");

        if (!order) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Order updated successfully",
            order
        });
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error);

        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE / CANCEL ORDER
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
