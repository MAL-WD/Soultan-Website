import Coupon from '../models/Coupon.js';

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, startDate, endDate } = req.body;

    if (!code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields',
      });
    }

    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('applicableCategories')
      .populate('applicableProducts')
      .populate('excludedProducts');

    res.json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get coupon by code
// @route   GET /api/coupons/code/:code
// @access  Public
export const getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
      .populate('applicableCategories')
      .populate('applicableProducts')
      .populate('excludedProducts');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not valid or has expired',
      });
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, userId, items } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and order amount',
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
      .populate('applicableCategories')
      .populate('applicableProducts')
      .populate('excludedProducts');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not valid or has expired',
      });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ${coupon.minOrderAmount} DZD required`,
      });
    }

    // Check if items are eligible for coupon
    if (coupon.applicableProducts.length > 0 || coupon.excludedProducts.length > 0) {
      let isEligible = false;

      for (const item of items) {
        const productId = item.product || item._id;
        const isExcluded = coupon.excludedProducts.some(
          (p) => p._id.toString() === productId.toString()
        );
        const isApplicable =
          coupon.applicableProducts.length === 0 ||
          coupon.applicableProducts.some(
            (p) => p._id.toString() === productId.toString()
          );

        if (!isExcluded && isApplicable) {
          isEligible = true;
          break;
        }
      }

      if (!isEligible) {
        return res.status(400).json({
          success: false,
          message: 'Coupon is not applicable to items in your cart',
        });
      }
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(orderAmount);

    res.json({
      success: true,
      data: {
        coupon,
        discount,
        finalAmount: orderAmount - discount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Apply coupon to order (increment usage count)
// @route   POST /api/coupons/:id/apply
// @access  Private/Admin
export const applyCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    coupon.usageCount += 1;
    await coupon.save();

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
