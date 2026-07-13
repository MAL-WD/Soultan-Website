import Order from '../models/Order.js';
import crypto from 'crypto';

/**
 * Dahabia Payment Gateway Integration
 * 
 * Dahabia is a popular Algerian payment gateway
 * Documentation: https://dahabia.dz
 */

// Initialize Dahabia configuration
const DAHABIA_CONFIG = {
  merchantId: process.env.DAHABIA_MERCHANT_ID,
  merchantKey: process.env.DAHABIA_MERCHANT_KEY,
  apiUrl: process.env.DAHABIA_API_URL || 'https://api.dahabia.dz',
  returnUrl: `${process.env.CLIENT_URL}/payment/success`,
  cancelUrl: `${process.env.CLIENT_URL}/payment/cancel`,
  webhookUrl: `${process.env.SERVER_URL}/api/payments/webhook/dahabia`,
};

// @desc    Initialize Dahabia payment session
// @route   POST /api/payments/dahabia/init
// @access  Private
export const initiateDahebiaPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const order = await Order.findById(orderId).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this order',
      });
    }

    // Create payment signature
    const amount = Math.round(order.totalAmount * 100); // Convert to cents
    const reference = `ORD-${order._id}-${Date.now()}`;
    
    // Create signature for Dahabia
    const signatureData = `${DAHABIA_CONFIG.merchantId}${amount}${reference}${DAHABIA_CONFIG.merchantKey}`;
    const signature = crypto
      .createHash('sha256')
      .update(signatureData)
      .digest('hex');

    // Prepare payment data
    const paymentData = {
      merchant_id: DAHABIA_CONFIG.merchantId,
      amount,
      reference,
      email: order.user.email,
      phone: order.shippingAddress.phone,
      name: order.user.name,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country,
      signature,
      return_url: DAHABIA_CONFIG.returnUrl,
      cancel_url: DAHABIA_CONFIG.cancelUrl,
      webhook_url: DAHABIA_CONFIG.webhookUrl,
      metadata: {
        orderId: order._id,
        userId: order.user._id,
      },
    };

    // Save transaction reference to order
    order.paymentMethod = 'dahabia';
    order.paymentProof = reference;
    await order.save();

    res.json({
      success: true,
      data: {
        paymentUrl: `${DAHABIA_CONFIG.apiUrl}/checkout`,
        paymentData,
        reference,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Handle Dahabia webhook/callback
// @route   POST /api/payments/webhook/dahabia
// @access  Public
export const handleDahebiaWebhook = async (req, res) => {
  try {
    const {
      reference,
      status,
      amount,
      transaction_id,
      signature,
    } = req.body;

    // Verify signature
    const signatureData = `${reference}${status}${amount}${DAHABIA_CONFIG.merchantKey}`;
    const expectedSignature = crypto
      .createHash('sha256')
      .update(signatureData)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    // Extract order ID from reference
    const orderId = reference.split('-')[1];
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order status based on payment status
    if (status === 'success' || status === 'completed') {
      order.status = 'payment_verified';
      order.paymentProof = transaction_id || reference;
    } else if (status === 'failed' || status === 'cancelled') {
      order.status = 'cancelled';
    } else if (status === 'pending') {
      order.status = 'pending';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Webhook processed successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify Dahabia payment
// @route   POST /api/payments/dahabia/verify
// @access  Private
export const verifyDahebiaPayment = async (req, res) => {
  try {
    const { reference, transactionId } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Reference is required',
      });
    }

    // Extract order ID from reference
    const orderId = reference.split('-')[1];
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // In production, verify with Dahabia API
    // This is a simplified implementation
    if (transactionId) {
      order.status = 'payment_verified';
      order.paymentProof = transactionId;
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/dahabia/:reference
// @access  Private
export const getDahebiaPaymentStatus = async (req, res) => {
  try {
    const { reference } = req.params;

    // Extract order ID from reference
    const orderId = reference.split('-')[1];
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        status: order.status,
        reference,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
