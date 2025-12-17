const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Please provide a promo code"],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed', 'free_delivery'],
        required: [true, "Please provide a promo type"]
    },
    value: {
        type: Number,
        required: [true, "Please provide a promo value"],
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    validFrom: {
        type: Date,
        required: [true, "Please provide a valid from date"]
    },
    validUntil: {
        type: Date,
        required: [true, "Please provide a valid until date"]
    },
    usageLimit: {
        type: Number,
        default: -1
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    }
}, {
    timestamps: true
});

const promoModel = mongoose.model("promos", promoSchema);

module.exports = promoModel;
