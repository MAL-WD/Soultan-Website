import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filtering, search, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      let categoryId;
      // Check if it's an ObjectId or a slug
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryId = req.query.category;
      } else {
        // It's a slug, find the category first
        const categoryDoc = await Category.findOne({ slug: req.query.category });
        if (categoryDoc) {
          categoryId = categoryDoc._id;
        } else {
          // Category not found, return empty result immediately
          return res.json({
            success: true,
            count: 0,
            total: 0,
            page,
            pages: 0,
            data: [],
          });
        }
      }
      
      // Find all subcategories to include products from them as well
      const subcategories = await Category.find({ parent: categoryId });
      const categoryIds = [categoryId, ...subcategories.map(c => c._id)];
      query.category = { $in: categoryIds };
    }

    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name_en name_ar slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    let product;
    // Check if valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id)
        .populate('category', 'name_en name_ar slug')
        .populate('reviews.user', 'name');
    } else {
      // Log for debugging
      console.log('Searching product by:', req.params.id);

      // Decode URL-encoded name and handle spaces/special characters
      let searchTerm = decodeURIComponent(req.params.id);
      // Replace URL-encoded spaces (%20) and plus signs with actual spaces
      searchTerm = searchTerm.replace(/%20/g, ' ').replace(/\+/g, ' ');

      // Use case-insensitive regex for partial matching
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

      product = await Product.findOne({
        $or: [
          { name_en: { $regex: regex } },
          { name_ar: { $regex: regex } }
          // Removed slug since it is not in schema based on inspection
        ]
      })
        .populate('category', 'name_en name_ar slug')
        .populate('reviews.user', 'name');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    // Create a new product - model has defaults for all required fields
    const product = await Product.create(req.body || {});

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed',
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.calculateAverageRating();

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
