const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a page title"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Please provide page content"]
    },
    slug: {
        type: String,
        required: [true, "Please provide a unique slug for the page"],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['About', 'Contact', 'Privacy', 'Terms', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'draft'
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

const pageModel = mongoose.model("pages", pageSchema);

module.exports = pageModel;
