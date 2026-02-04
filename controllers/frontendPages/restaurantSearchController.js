const Restaurant = require('../../models/restaurantModel');

exports.searchRestaurants = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Case-insensitive search by restaurant name
        const restaurants = await Restaurant.find({
            name: { $regex: query, $options: 'i' }
        }).select('_id name description address imageUrl cuisine'); // Select relevant fields

        res.status(200).json({ restaurants });

    } catch (error) {
        console.error('Error searching restaurants:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
