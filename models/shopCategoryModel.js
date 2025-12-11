const mongoose = require('mongoose');

const shopCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a shop category name"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const shopCategoryModel = mongoose.model("shopCategories", shopCategorySchema);

module.exports = shopCategoryModel;
