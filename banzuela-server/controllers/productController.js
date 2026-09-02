const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { HttpStatus } = require('../config/constants');

// Get all products 
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        // Filter by category name
        if (req.query.category) {
            const category = await Category.findOne({
                categoryName: req.query.category
            });

            if (!category) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            filter.category = category._id;
        }

        // Keyword search
        if (req.query.search) {
            filter.$or = [
                {
                    productName: {
                        $regex: req.query.search,
                        $options: 'i'
                    }
                },
                {
                    description: {
                        $regex: req.query.search,
                        $options: 'i'
                    }
                }
            ];
        }

        // Sorting
        let sort = {};

        if (req.query.sort) {
            const sortField = req.query.sort.startsWith('-')
                ? req.query.sort.substring(1)
                : req.query.sort;

            const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;

            sort[sortField] = sortOrder;
        }

        const products = await Product.find(filter)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);

        res.status(HttpStatus.OK).json({
            success: true,
            count: products.length,
            totalProducts,
            page,
            limit,
            products
        });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category');

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            product
        });
    } 
    
    catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        const createdProduct = await Product.findById(product._id)
            .populate('category');

        res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'Product created successfully',
            product: createdProduct
        });
    } 
    
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {

        console.log("UPDATE PRODUCT");
        console.log("Product ID:", req.params.id);
        console.log("Request Body:", req.body);
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('category');

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } 
    
    catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};