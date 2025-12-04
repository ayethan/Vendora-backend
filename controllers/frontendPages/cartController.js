const Cart = require('../../models/cartModel');
const { getPopulatedCart } = require('../../helpers/cartHelpers');

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required', success: false });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(userId);
    return res.status(200).json({ message: 'Product added to cart', success: true, cart: populatedCart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to cart', success: false });
  }
}

async function getCart(req, res) {
  try {
    const userId = req.user.userId;
    const cart = await getPopulatedCart(userId);
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json({
      cart: cart,
      success: true,
      error: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting cart', success: false });
  }
}

async function updateCartItem(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1', success: false });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found', success: false });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await getPopulatedCart(userId);
      res.status(200).json({ message: 'Cart updated', success: true, cart: populatedCart });
    } else {
      res.status(404).json({ message: 'Item not in cart', success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart', success: false });
  }
}

async function removeCartItem(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found', success: false });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    const populatedCart = await getPopulatedCart(userId);
    res.status(200).json({ message: 'Item removed from cart', success: true, cart: populatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item from cart', success: false });
  }
}

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
};
