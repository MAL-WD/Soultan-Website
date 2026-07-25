import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['announcement', 'promo_image'],
      required: true,
    },
    // ── Announcement fields ──
    text_en: { type: String, trim: true, default: '' },
    text_ar: { type: String, trim: true, default: '' },
    text_fr: { type: String, trim: true, default: '' },
    link_url: { type: String, trim: true, default: '' },
    link_text_en: { type: String, trim: true, default: '' },
    link_text_ar: { type: String, trim: true, default: '' },
    link_text_fr: { type: String, trim: true, default: '' },
    bg_color: { type: String, default: '#023c12' },
    text_color: { type: String, default: '#ffffff' },
    // ── Promo image fields ──
    image_url: { type: String, default: '' },
    alt_en: { type: String, default: '' },
    alt_ar: { type: String, default: '' },
    link_target_url: { type: String, default: '' }, // clickable promo image link
    placement: {
      type: String,
      enum: ['products_top', 'homepage', 'both'],
      default: 'products_top',
    },
    // ── Common ──
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
