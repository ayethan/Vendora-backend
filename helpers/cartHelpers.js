const Cart = require('../models/cartModel');

async function getPopulatedCart(userId) {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  return cart;
}

module.exports = {
  getPopulatedCart,
};
