const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../models/orderModel');
const User = require('../../models/userModel');
const Cart = require('../../models/cartModel');

const createCheckoutSession = async (req, res) => {
  const { amount, currency, paymentMethodId, userId, items } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:5173/checkout-success',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status === 'succeeded') {
      const order = new Order({
        userId: userId,
        items: items,
        amount: amount,
        paymentMethodId: paymentMethodId,
        status: 'paid',
      });

      await order.save();

      // Clear the user's cart after successful order
      await Cart.findOneAndDelete({ userId: userId });

      res.status(200).json({
        success: true,
        message: 'Payment successful and order placed!',
        orderId: order._id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed or not succeeded.',
        paymentIntentStatus: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCheckoutSession,
};