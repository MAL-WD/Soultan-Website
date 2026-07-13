import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      default: 'New Product',
      trim: true,
    },
    name_ar: {
      type: String,
      default: 'منتج جديد',
      trim: true,
    },
    description_en: {
      type: String,
      default: '',
    },
    description_ar: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    comparePrice: {
      type: Number, // Original price for showing discounts
      min: 0,
    },
    images: [
      {
        url: String,
        alt_en: String,
        alt_ar: String,
        isMain: { type: Boolean, default: false },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    brand: {
      type: String,
      trim: true,
      lowercase: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    specifications: {
      type: Map,
      of: String, // Flexible key-value pairs for product specs
    },
    availableColors: {
      type: [String],
      default: [],
    },
    reference: {
      type: String,
      trim: true,
    },
    productOptions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating when reviews change
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

// Index for search
productSchema.index({ name_en: 'text', name_ar: 'text', description_en: 'text', description_ar: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
