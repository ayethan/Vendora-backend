const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

async function getPopulatedCart(userId) {
  const cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    populate: {
      path: 'restaurant',
      select: 'deliveryCharge'
    }
  });

  if (cart && cart.items.length > 0) {
    let total = 0;
    cart.items.forEach(item => {
      if (item.productId) {
        const itemPrice = item.productId.selling_price || item.productId.price;
        let addonsTotalPrice = 0;
        if (item.addons && item.addons.length > 0) {
          addonsTotalPrice = item.addons.reduce((acc, addon) => acc + addon.price, 0);
        }
        total += item.quantity * (itemPrice + addonsTotalPrice);
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
