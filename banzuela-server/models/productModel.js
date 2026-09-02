const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },

        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

productSchema.index({ productName: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);