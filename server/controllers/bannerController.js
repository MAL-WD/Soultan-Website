import Banner from '../models/Banner.js';

// Helper to check if banner is currently active (date-wise)
const isDateActive = (banner) => {
  const now = new Date();
  if (banner.start_date && now < banner.start_date) return false;
  if (banner.end_date && now > banner.end_date) return false;
  return true;
};

// @desc  Get all banners (admin)
// @route GET /api/banners
// @access Private/Admin
export const getBanners = async (req, res) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type) query.type = type;
    const banners = await Banner.find(query).sort({ sort_order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get active banners for public display
// @route GET /api/banners/active
// @access Public
export const getActiveBanners = async (req, res) => {
  try {
    const { type, placement } = req.query;
    const query = { is_active: true };
    if (type) query.type = type;
    if (placement) query.placement = { $in: [placement, 'both'] };
    const now = new Date();
    query.$and = [
      { $or: [{ start_date: null }, { start_date: { $lte: now } }] },
      { $or: [{ end_date: null }, { end_date: { $gte: now } }] },
    ];
    const banners = await Banner.find(query).sort({ sort_order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Create banner
// @route POST /api/banners
// @access Private/Admin
export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update banner
// @route PUT /api/banners/:id
// @access Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete banner
// @route DELETE /api/banners/:id
// @access Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
