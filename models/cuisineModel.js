const mongoose = require('mongoose');

const cuisineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a cuisine name"],
        unique: true,
        trim: true
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

const cuisineModel = mongoose.model("cuisines", cuisineSchema);

module.exports = cuisineModel;
