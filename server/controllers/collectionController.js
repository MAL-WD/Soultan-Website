import Collection from '../models/Collection.js';

// @desc    Get all collections
// @route   GET /api/collections
// @access  Private/Admin
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate({
        path: 'versions.products.product',
        select: 'name_en name_ar name_fr price images',
      })
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active collections
// @route   GET /api/collections/active
// @access  Public
export const getActiveCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .populate('versions.products.product')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single collection by ID
// @route   GET /api/collections/:id
// @access  Public
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('versions.products.product');

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private/Admin
export const createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('versions.products.product');

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active back-to-school collection for a specific school level
// @route   GET /api/collections/school/:level
// @access  Public
export const getCollectionBySchoolLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const { gender } = req.query;
    
    let query = { isBackToSchool: true, schoolLevel: level, isActive: true };
    
    let collection = null;
    if (gender) {
      collection = await Collection.findOne({ ...query, targetGender: gender })
        .populate({
          path: 'versions.products.product',
          select: 'name_en name_ar name_fr price images',
        });
    }
    
    // Fallback to unisex if specific gender kit not found
    if (!collection) {
      collection = await Collection.findOne({ ...query, targetGender: 'any' })
        .populate({
          path: 'versions.products.product',
          select: 'name_en name_ar name_fr price images',
        });
    }

    if (!collection) {
      return res.status(404).json({ success: false, message: 'No active back to school collection found for this level' });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

    const collection = await Collection.findOne({
      isBackToSchool: true,
      schoolLevel: level,
      isActive: true,
    }).populate('versions.products.product');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: `No active school collection found for level: ${level}`,
      });
    }

    res.json({ success: true, data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
