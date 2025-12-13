const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['bicycle', 'scooter', 'car'],
        required: true
    },
    licensePlate: {
        type: String
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number] // Format: [longitude, latitude]
        }
    },
    availabilityStatus: {
        type: String,
        enum: ['online', 'offline', 'on_delivery'],
        default: 'offline'
    },
    currentOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }
}, {
    timestamps: true
});

driverSchema.index({ currentLocation: '2dsphere' });

const driverModel = mongoose.model("drivers", driverSchema);

module.exports = driverModel;
