const mongoose = require('mongoose');

const deliveryInfoSchema = new mongoose.Schema({
    deliveryCost: {
        type: Number,
        required: true
    },
    smallOrderSurcharge: {
        type: Number,
        required: true
    },
    estimatedDeliveryTime: {
        type: Number, // in minutes
        required: true
    }
});

const deliveryInfoModel = mongoose.model("deliveryInfo", deliveryInfoSchema);

module.exports = deliveryInfoModel;
