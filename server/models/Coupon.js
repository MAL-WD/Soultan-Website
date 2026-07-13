import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide coupon code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description_en: {
      type: String,
      trim: true,
    },
    description_ar: {
      type: String,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: [true, 'Please provide discount value'],
      min: 0,
    },
    maxDiscount: {
      type: Number, // For percentage discounts, set max discount amount
      min: 0,
    },
    minOrderAmount: {
      type: Number, // Minimum order amount to apply coupon
      default: 0,
      min: 0,
    },
    maxUsageCount: {
      type: Number, // Total times coupon can be used
      default: null,
    },
    maxUsagePerUser: {
      type: Number, // Max times per user
      default: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date'],
    },
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (!this.maxUsageCount || this.usageCount < this.maxUsageCount)
  );
};

// Calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (this.discountType === 'percentage') {
    const discount = (orderAmount * this.discountValue) / 100;
    return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
  }
  return this.discountValue;
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
