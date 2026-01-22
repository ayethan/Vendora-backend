const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

async function getPopulatedCart(userId) {
  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (cart && cart.items.length > 0) {
    let total = 0;
    cart.items.forEach(item => {
      console.log('item product', item.productId)
      if (item.productId) {
        const itemPrice = item.productId.selling_price || item.productId.price;
        total += item.quantity * itemPrice;
      }
    });
    cart.total = total;
  } else if (cart) {
    cart.total = 0;
  }

  return cart;
}

module.exports = {
  getPopulatedCart,
};
