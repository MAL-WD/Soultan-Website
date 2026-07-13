import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name_en: String,
        name_ar: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        image: String,
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      postalCode: String,
      country: { type: String, default: 'Algeria' },
    },
    paymentMethod: {
      type: String,
      enum: ['baridimob', 'cash_on_delivery', 'dahabia'],
      default: 'baridimob',
    },
    paymentProof: {
      type: String, // URL to uploaded payment proof image
    },
    ccpNumber: {
      type: String, // Customer's CCP number for verification
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'payment_verified', 'processing', 'shipped', 'delivered', 'cancelled', 'validated', 'no_response', 'returned'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    statusHistory: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Add status to history when status changes
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
