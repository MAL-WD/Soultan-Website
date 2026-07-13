import Category from '../models/Category.js';

// @desc    Get all categories with subcategories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    // Get all categories
    const allCategories = await Category.find({ isActive: true }).sort({ order: 1 });

    // Separate parent categories and subcategories
    const parentCategories = allCategories.filter(cat => !cat.parent);
    const subcategories = allCategories.filter(cat => cat.parent);

    // Attach subcategories to their parent categories
    const categoriesWithSubs = parentCategories.map(parent => {
      const parentObj = parent.toObject();
      parentObj.subcategories = subcategories
        .filter(sub => sub.parent.toString() === parent._id.toString())
        .map(sub => sub.toObject());
      return parentObj;
    });

    res.json({
      success: true,
      count: categoriesWithSubs.length,
      data: categoriesWithSubs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
