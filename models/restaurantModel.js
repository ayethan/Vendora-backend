const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a restaurant name"],
        trim: true
    },
    slug: {
        type: String,
        required: [true, "Please provide a unique slug for the restaurant"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide a description"]
    },
    address: {
        type: String,
        required: [true, "Please provide an address"]
    },
    city: {
        type: String,
        required: [true, "Please provide a city"]
    },
    country: {
        type: String,
        required: [true, "Please provide a country"]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // Format: [longitude, latitude]
            required: true
        }
    },
    type: {
        type: String,
        enum: ['Restaurant', 'Shop', 'Home Chef'],
        required: [true, "Please provide the business type"]
    },
    shopCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shopCategories'
    },
    cuisine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cuisines',
        required: [true, "Please provide a cuisine type"]
    },
    openingTimes: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        open: {
            type: String,
            required: true
        },
        close: {
            type: String,
            required: true
        }
    }],
    deliveryInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'deliveryInfo'
    },
    image: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

// Create a 2dsphere index on the location field for efficient geospatial queries
restaurantSchema.index({ location: '2dsphere' });

const restaurantModel = mongoose.model("restaurant", restaurantSchema);

module.exports = restaurantModel;