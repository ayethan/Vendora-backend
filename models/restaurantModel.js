const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a restaurant name"],
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
    openingHours: {
        type: String,
        required: [true, "Please provide opening hours"]
    },
    image: {
        type: String,
        default: ""
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
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