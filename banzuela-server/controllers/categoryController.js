const Category = require('../models/categoryModel');
const { HttpStatus } = require('../config/constants');

// GET all categories
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find();

       res.status(HttpStatus.OK).json(category);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// GET category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'Category not found'
            });
        }

        res.status(HttpStatus.OK).json(category);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

// CREATE category
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(HttpStatus.CREATED).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: error.message
        });
    }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'Category not found'
            });
        }

        res.status(HttpStatus.OK).json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: error.message
        });
    }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(HttpStatus.NOT_FOUND).json({
                message: 'Category not found'
            });
        }

        res.status(HttpStatus.OK).json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};