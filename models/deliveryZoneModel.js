const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a delivery zone name"],
        unique: true,
        trim: true
    },
    polygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers for GeoJSON Polygon
            required: true
        }
    },
    baseFee: {
        type: Number,
        required: [true, "Please provide a base delivery fee"],
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    surgePricingFactor: {
        type: Number,
        default: 1,
        min: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create a 2dsphere index on the polygon field for efficient geospatial queries
deliveryZoneSchema.index({ polygon: '2dsphere' });

const deliveryZoneModel = mongoose.model("deliveryZones", deliveryZoneSchema);

module.exports = deliveryZoneModel;
