const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../models/orderModel');
const User = require('../../models/userModel');
const Cart = require('../../models/cartModel');
const sendMail = require('../../helpers/mailHelper');

const createCheckoutSession = async (req, res) => {
  const { paymentMethodId, restaurantId, deliveryAddress, deliveryMethod, subtotal, deliveryFee, taxAmount, discountAmount } = req.body;
  const userId = req.user.userId;

  try {
    // 1. Get user's cart from the database
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty.',
      });
    }

    // 2. Calculate the total amount on the server-side
    const amount = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.selling_price;
    }, 0);

    // 3. Create a PaymentIntent with the calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:5173/checkout-success',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    // 4. If payment is successful, create an order
    if (paymentIntent.status === 'succeeded') {
      const order = new Order({
        userId: userId,
        restaurant: restaurantId,
        items: cart.items.map(item => ({
          productId: item.productId._id,
          name: item.productId.name,
          quantity: item.quantity,
          price: item.productId.selling_price,
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        totalAmount: amount,
        deliveryAddress: deliveryAddress,
        deliveryMethod: deliveryMethod,
        paymentTransactionId: paymentMethodId,
        paymentStatus: 'paid',
        status: 'pending',
      });

      await order.save();

      // 5. Clear the user's cart
      await Cart.findOneAndDelete({ userId: userId });

      // 6. Send order confirmation email
      const user = await User.findById(userId);
      if (user && user.email) {
        const emailHtml = `<h1>Thank you for your order!</h1><p>Your order with ID ${order._id} has been placed successfully.</p>`;
        await sendMail(user.email, 'Order Confirmation', emailHtml);
      }

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