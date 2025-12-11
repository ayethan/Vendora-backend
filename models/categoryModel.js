const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a category name"],
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
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;
