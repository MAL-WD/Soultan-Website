import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total Revenue
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Revenue by date (last 30 days)
    const revenueByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Best-selling products
    const bestSellingProducts = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          name_en: '$product.name_en',
          name_ar: '$product.name_ar',
        },
      },
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name_en name_ar stock sku price')
      .limit(10);

    // Total users
    const totalUsers = await User.countDocuments();

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate average order value
    const avgOrderValue = totalRevenueData[0]?.totalRevenue / totalRevenueData[0]?.totalOrders || 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: totalRevenueData[0]?.totalRevenue || 0,
          totalOrders: totalRevenueData[0]?.totalOrders || 0,
          averageOrderValue: avgOrderValue,
          totalUsers,
        },
        revenueByDate,
        bestSellingProducts,
        lowStockProducts,
        ordersByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get order analytics
// @route   GET /api/analytics/orders
// @access  Private/Admin
export const getOrderAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().select('createdAt status totalAmount').limit(100);

    const analytics = {
      totalOrders: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
