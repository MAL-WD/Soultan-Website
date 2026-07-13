import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: [true, 'Please provide English category name'],
      trim: true,
    },
    name_ar: {
      type: String,
      required: [true, 'Please provide Arabic category name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description_en: {
      type: String,
      trim: true,
    },
    description_ar: {
      type: String,
      trim: true,
    },
    icon: {
      type: String, // URL or icon name
    },
    image: {
      type: String, // Category image URL
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0, // For sorting categories
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null means it's a top-level category
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
