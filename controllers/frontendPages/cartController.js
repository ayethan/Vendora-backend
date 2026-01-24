const Cart = require('../../models/cartModel');
const { getPopulatedCart } = require('../../helpers/cartHelpers');

async function addToCart(req, res) {
  try {
    const { productId, quantity, restaurantId } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity || !restaurantId) {
      return res.status(400).json({ message: 'Product ID, quantity, and restaurant ID are required', success: false });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart exists, create a new one with the provided restaurantId
      cart = await Cart.create({ userId, restaurantId, items: [] });
    } else {
      // If a cart exists, check if the restaurantId matches
      if (cart?.restaurantId?.toString() !== restaurantId) {
        return res.status(400).json({ message: 'Cannot add items from a different restaurant. Please clear your current cart first.', success: false });
      }
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
    if(cart.items.length === 0){
      await Cart.findOneAndDelete({ userId });
    }
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
