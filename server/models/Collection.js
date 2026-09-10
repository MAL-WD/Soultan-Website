import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    name_en: {
      type: String,
      required: [true, 'Please provide English collection name'],
      trim: true,
    },
    name_ar: {
      type: String,
      required: [true, 'Please provide Arabic collection name'],
      trim: true,
    },
    name_fr: {
      type: String,
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
    description_fr: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // Cover image URL from Cloudinary
      required: [true, 'Please provide collection image'],
    },
    versions: [
      {
        name_en: {
          type: String,
          required: [true, 'Please provide English version name'],
          trim: true,
        },
        name_ar: {
          type: String,
          required: [true, 'Please provide Arabic version name'],
          trim: true,
        },
        name_fr: {
          type: String,
          trim: true,
        },
        products: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product',
              required: true,
            },
            defaultQuantity: {
              type: Number,
              default: 1,
              min: 1,
            },
          },
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    // Back to School fields
    isBackToSchool: {
      type: Boolean,
      default: false,
    },
    targetGender: {
      type: String,
      enum: ['boy', 'girl', 'any'],
      default: 'any'
    },
    schoolLevel: {
      type: String,
      enum: [
        'preparatory',
        'primary_1', 'primary_2', 'primary_3', 'primary_4', 'primary_5',
        'middle_1', 'middle_2', 'middle_3', 'middle_4',
        'high_1', 'high_2', 'high_3',
        'university', 'teacher',
        '',
      ],
      default: '',
    },
    governmentDocImages: {
      type: [String], // Array of Cloudinary image URLs (official MEN proof documents)
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
