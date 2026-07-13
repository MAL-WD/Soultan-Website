import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendTelegramOrderNotification } from '../utils/telegramNotifier.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const {
            shippingAddress,
            paymentMethod,
            items,
            totalAmount,
            paymentProof,
            ccpNumber,
            notes,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items',
            });
        }

        // Handle both structured and simplified shipping addresses
        let structuredAddress = shippingAddress;
        if (typeof shippingAddress === 'string' || (shippingAddress && !shippingAddress.street)) {
            structuredAddress = {
                name: shippingAddress.name || 'Guest',
                phone: shippingAddress.phone || 'N/A',
                street: shippingAddress.address || shippingAddress.street || 'Contact for address',
                city: shippingAddress.city || 'N/A',
                country: 'Algeria'
            };
        }

        const order = new Order({
            user: req.user ? req.user._id : null,
            items,
            shippingAddress: structuredAddress,
            paymentMethod: paymentMethod || 'cash_on_delivery',
            paymentProof,
            ccpNumber,
            totalAmount,
            notes,
            status: paymentMethod === 'baridimob' ? 'pending' : 'processing',
        });

        const createdOrder = await order.save();

        // Send Telegram notification (fire-and-forget — never blocks the response)
        sendTelegramOrderNotification(createdOrder);

        // Clear cart after order creation if user is logged in
        if (req.user) {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [], totalAmount: 0 } }
            );
        }

        res.status(201).json({
            success: true,
            data: createdOrder,
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Check if user is owner or admin
        const isOwner = order.user && req.user && order.user._id.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order',
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;
        if (note) order.adminNotes = note;

        if (['payment_verified', 'processing', 'shipped', 'delivered', 'validated'].includes(status)) {
            if (!order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        } else {
            order.isPaid = false;
        }

        if (status === 'delivered') {
            order.isDelivered = true;
            if (!order.deliveredAt) {
                order.deliveredAt = Date.now();
            }
        } else {
            order.isDelivered = false;
        }

        if (status === 'cancelled') {
            order.cancelledAt = Date.now();
        }

        const updatedOrder = await order.save();

        res.json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
