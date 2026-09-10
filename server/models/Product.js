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
    name_fr: {
      type: String,
      default: 'Nouveau Produit',
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
    description_fr: {
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
    availableSizes: {
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

// Full-text index for search functionality
productSchema.index({ 
  name_en: 'text', 
  name_ar: 'text', 
  name_fr: 'text',
  description_en: 'text', 
  description_ar: 'text',
  description_fr: 'text'
});

// Compound indexes for common query patterns in getProducts controller.
// These eliminate full collection scans and make the homepage load fast.
productSchema.index({ isActive: 1, createdAt: -1 }); // default homepage query
productSchema.index({ isActive: 1, category: 1, createdAt: -1 }); // category filter
productSchema.index({ isActive: 1, featured: 1, createdAt: -1 }); // featured filter
productSchema.index({ isActive: 1, price: 1 }); // price_asc sort
productSchema.index({ isActive: 1, price: -1 }); // price_desc sort

const Product = mongoose.model('Product', productSchema);

export default Product;
