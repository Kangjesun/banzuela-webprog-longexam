const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'category'
    }

);
    categorySchema.index({ description: 1 });

module.exports = mongoose.model('Category', categorySchema);