const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Optional: Add a compound index to prevent a user from reviewing the same restaurant twice
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

const reviewModel = mongoose.model("reviews", reviewSchema);

module.exports = reviewModel;
