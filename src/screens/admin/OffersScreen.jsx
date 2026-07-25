import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Tag,
  Ticket,
  Percent,
  Megaphone,
  Image as ImageIcon,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  Upload,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  Calendar,
  Link as LinkIcon,
  Palette,
  AlignLeft,
  Globe,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from '../../slices/couponsApiSlice';
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from '../../slices/bannersApiSlice';
import {
  useBulkDiscountMutation,
  useUploadProductImageMutation,
  useGetProductsQuery,
} from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'coupons', label: 'Coupons', labelAr: 'الكوبونات', icon: Ticket },
  { id: 'discounts', label: 'Product Discounts', labelAr: 'تخفيضات المنتجات', icon: Percent },
  { id: 'banners', label: 'Announcement Banners', labelAr: 'شريط الإعلانات', icon: Megaphone },
  { id: 'ads', label: 'Promo Images', labelAr: 'صور الإعلانات', icon: ImageIcon },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '—');

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
      active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
    {active ? 'Active' : 'Inactive'}
  </span>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-base font-bold text-[#023c12]">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ─── Form field helpers ───────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/30 focus:border-[#023c12] transition-all bg-gray-50 ${props.className || ''}`}
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/30 focus:border-[#023c12] transition-all bg-gray-50 appearance-none cursor-pointer"
  >
    {children}
  </select>
);

const ProductSelect = ({ products, value, onChange, isArabic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedProduct = products.find((p) => p._id === value);

  const filtered = useMemo(() => {
    if (!search) return products;
    const lower = search.toLowerCase();
    return products.filter((p) => {
      const nameEn = (p.name_en || p.name || '').toLowerCase();
      const nameAr = (p.name_ar || p.name || '').toLowerCase();
      return nameEn.includes(lower) || nameAr.includes(lower) || (p.sku && p.sku.toLowerCase().includes(lower));
    });
  }, [products, search]);

  return (
    <div className="relative" ref={ref}>
      <div
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 cursor-pointer flex items-center justify-between hover:border-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedProduct ? (
          <div className="flex items-center gap-3 overflow-hidden">
            {selectedProduct.images?.[0]?.url ? (
              <img src={selectedProduct.images[0].url} className="w-6 h-6 rounded object-cover border border-gray-100 flex-shrink-0" alt="" />
            ) : (
              <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0" />
            )}
            <span className="truncate font-medium text-gray-900">
              {isArabic ? selectedProduct.name_ar || selectedProduct.name_en || selectedProduct.name : selectedProduct.name_en || selectedProduct.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">{isArabic ? 'لا شيء (استخدم التصنيف/الكل)' : 'None (Use Category/All)'}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 bg-gray-50/50">
              <input
                type="text"
                placeholder={isArabic ? 'ابحث عن منتج...' : 'Search product...'}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#023c12] transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-auto py-1 overscroll-contain">
              <div
                className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-600 transition-colors"
                onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
              >
                {isArabic ? 'لا شيء (استخدم التصنيف/الكل)' : 'None (Use Category/All)'}
              </div>
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">
                  {isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}
                </div>
              ) : (
                filtered.map((p) => {
                  const name = isArabic ? p.name_ar || p.name_en || p.name : p.name_en || p.name;
                  const isSelected = value === p._id;
                  return (
                    <div
                      key={p._id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer border-t border-gray-50 transition-colors ${isSelected ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-gray-50'}`}
                      onClick={() => { onChange(p._id); setIsOpen(false); setSearch(''); }}
                    >
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} className="w-9 h-9 rounded-lg object-cover border border-gray-200 shadow-sm" alt="" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className={`text-sm font-semibold truncate ${isSelected ? 'text-[#023c12]' : 'text-gray-900'}`}>{name}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium text-emerald-600">{p.price} DZD</span>
                          {p.sku ? <span className="opacity-60">• SKU: {p.sku}</span> : <span className="opacity-60">• ID: ...{p._id.slice(-4)}</span>}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#023c12] flex-shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#023c12]' : 'bg-gray-300'}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — COUPONS
// ══════════════════════════════════════════════════════════════════════════════
const COUPON_TEMPLATES = [
  { label: '10% Off', code: 'SAVE10', type: 'percentage', value: 10 },
  { label: '20% Off', code: 'SAVE20', type: 'percentage', value: 20 },
  { label: '50 DZD', code: 'FLAT50', type: 'fixed', value: 50 },
  { label: 'Free Ship', code: 'FREESHIP', type: 'fixed', value: 500 },
];

const defaultCoupon = () => ({
  code: '',
  description_en: '',
  description_ar: '',
  discountType: 'percentage',
  discountValue: 10,
  minOrderAmount: 0,
  maxUsageCount: '',
  isActive: true,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
});

const CouponsTab = ({ isArabic }) => {
  const { data, isLoading, refetch } = useGetCouponsQuery();
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultCoupon());
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const coupons = data?.data || [];

  const openCreate = () => { setEditItem(null); setForm(defaultCoupon()); setModalOpen(true); };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({
      ...c,
      startDate: c.startDate ? c.startDate.slice(0, 10) : '',
      endDate: c.endDate ? c.endDate.slice(0, 10) : '',
      maxUsageCount: c.maxUsageCount ?? '',
    });
    setModalOpen(true);
  };

  const applyTemplate = (t) => setForm((f) => ({ ...f, code: t.code, discountType: t.type, discountValue: t.value }));

  const handleSave = async () => {
    if (!form.code || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error('Please fill required fields'); return;
    }
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxUsageCount: form.maxUsageCount === '' ? null : Number(form.maxUsageCount),
      };
      if (editItem) {
        await updateCoupon({ id: editItem._id, ...payload }).unwrap();
        toast.success('Coupon updated');
      } else {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created');
      }
      setModalOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success('Coupon deleted');
      setDeleteConfirm(null);
    } catch (e) {
      toast.error(e?.data?.message || 'Error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Coupons</h3>
          <p className="text-sm text-gray-500">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading…</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No coupons yet. Create your first one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Valid Until', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-[#023c12] text-xs">{c.code}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">{c.discountType}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `${c.discountValue} DZD`}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.minOrderAmount > 0 ? `${c.minOrderAmount} DZD` : '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.usageCount}{c.maxUsageCount ? `/${c.maxUsageCount}` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{fmtDate(c.endDate)}</td>
                  <td className="px-4 py-3"><StatusBadge active={c.isActive} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#023c12]">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Coupon' : 'Create Coupon'}>
        {/* Templates */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {COUPON_TEMPLATES.map((t) => (
              <button
                key={t.code}
                onClick={() => applyTemplate(t)}
                className="px-3 py-1.5 rounded-lg bg-[#023c12]/8 text-[#023c12] text-xs font-semibold hover:bg-[#023c12]/15 transition-colors border border-[#023c12]/10"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Field label="Code" required>
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER25" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discount Type" required>
            <Select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (DZD)</option>
            </Select>
          </Field>
          <Field label="Value" required>
            <Input type="number" min={0} value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Min Order (DZD)">
            <Input type="number" min={0} value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
          </Field>
          <Field label="Max Uses (blank = unlimited)">
            <Input type="number" min={1} value={form.maxUsageCount} onChange={(e) => setForm({ ...form, maxUsageCount: e.target.value })} placeholder="unlimited" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date" required>
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="End Date" required>
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
        </div>
        <Field label="Description (EN)">
          <Input value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="e.g., Summer sale coupon" />
        </Field>
        <Field label="Description (AR)">
          <Input dir="rtl" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} placeholder="مثال: كوبون العروض الصيفية" />
        </Field>
        <div className="mb-6">
          <Toggle checked={form.isActive} onChange={() => setForm({ ...form, isActive: !form.isActive })} label="Active" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={creating || updating}
            className="flex-1 py-2.5 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] transition-colors disabled:opacity-60"
          >
            {creating || updating ? 'Saving…' : editItem ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Coupon">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this coupon? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — PRODUCT DISCOUNTS
// ══════════════════════════════════════════════════════════════════════════════
const DiscountsTab = ({ isArabic }) => {
  const [bulkDiscount, { isLoading }] = useBulkDiscountMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 1000 });
  const categories = categoriesData?.data || [];

  const [form, setForm] = useState({
    productId: '',
    category: '',
    discountType: 'percentage',
    discountValue: '',
    reset: false,
  });
  const [lastResult, setLastResult] = useState(null);

  const handleApply = async () => {
    if (!form.reset && !form.discountValue) { toast.error('Enter a discount value'); return; }
    try {
      const payload = {
        ...(form.productId ? { productId: form.productId } : {}),
        ...(form.category && !form.productId ? { category: form.category } : {}),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        reset: form.reset,
      };
      const res = await bulkDiscount(payload).unwrap();
      setLastResult(res);
      toast.success(res.message);
    } catch (e) {
      toast.error(e?.data?.message || 'Error applying discount');
    }
  };

  const DISCOUNT_TEMPLATES = [
    { label: '10% Off', labelAr: 'خصم 10%', type: 'percentage', value: 10 },
    { label: '20% Off', labelAr: 'خصم 20%', type: 'percentage', value: 20 },
    { label: '30% Off', labelAr: 'خصم 30%', type: 'percentage', value: 30 },
    { label: '50% Off', labelAr: 'خصم 50%', type: 'percentage', value: 50 },
    { label: '100 DZD off', labelAr: 'خصم 100 د.ج', type: 'fixed', value: 100 },
    { label: '200 DZD off', labelAr: 'خصم 200 د.ج', type: 'fixed', value: 200 },
  ];

  return (
    <div className="max-w-xl">
      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 mb-1">{isArabic ? 'عملية مجمعة' : 'Bulk Operation'}</p>
          <p className="text-xs text-amber-700">
            {isArabic
              ? 'هذا يحدّث السعر وسعر المقارنة لجميع المنتجات المطابقة في قاعدة البيانات. يتم حفظ السعر الأصلي كسعر مقارنة بحيث يمكن إعادة تعيينه. استخدم "إعادة تعيين" لاستعادة الأسعار الأصلية.'
              : 'This updates price and comparePrice on all matching products in the database. The original price is saved as comparePrice so it can be reset. Use "Reset" to restore original prices.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Percent className="w-4 h-4 text-[#023c12]" />
          {isArabic ? 'تطبيق خصم مجمع' : 'Apply Bulk Discount'}
        </h4>

        {/* Templates */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">{isArabic ? 'قوالب سريعة' : 'Quick Templates'}</p>
          <div className="flex flex-wrap gap-2">
            {DISCOUNT_TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => setForm((f) => ({ ...f, discountType: t.type, discountValue: t.value, reset: false }))}
                className="px-3 py-1.5 rounded-lg bg-[#023c12]/8 text-[#023c12] text-xs font-semibold hover:bg-[#023c12]/15 transition-colors border border-[#023c12]/10"
              >
                {isArabic ? t.labelAr : t.label}
              </button>
            ))}
          </div>
        </div>

        <Field label={isArabic ? 'تطبيق على منتج معين (يتخطى التصنيف)' : 'Apply to Specific Product (Overrides Category)'}>
          <ProductSelect
            products={productsData?.data || []}
            value={form.productId}
            onChange={(val) => setForm({ ...form, productId: val, reset: false })}
            isArabic={isArabic}
          />
        </Field>

        <Field label={isArabic ? 'تطبيق على تصنيف (فارغ = جميع المنتجات، يتم تجاهله إذا تم تحديد منتج معين)' : 'Apply to Category (blank = ALL products, ignored if specific product selected)'}>
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={!!form.productId}>
            <option value="">{isArabic ? 'جميع المنتجات' : 'All Products'}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{isArabic ? c.name_ar : c.name_en}</option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={isArabic ? 'نوع الخصم' : 'Discount Type'}>
            <Select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="percentage">{isArabic ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
              <option value="fixed">{isArabic ? 'مبلغ ثابت (د.ج)' : 'Fixed Amount (DZD)'}</option>
            </Select>
          </Field>
          <Field label={isArabic ? 'القيمة' : 'Value'}>
            <Input
              type="number"
              min={0}
              max={form.discountType === 'percentage' ? 100 : undefined}
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value, reset: false })}
              placeholder={form.discountType === 'percentage' ? '0–100' : (isArabic ? 'المبلغ' : 'Amount')}
            />
          </Field>
        </div>

        {lastResult && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
            ✓ {lastResult.message}
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={() => { setForm((f) => ({ ...f, reset: false })); handleApply(); }}
            disabled={isLoading || form.reset}
            className="flex-1 py-2.5 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isLoading ? (isArabic ? 'جاري التطبيق...' : 'Applying…') : (isArabic ? 'تطبيق الخصم' : 'Apply Discount')}
          </button>
          <button
            onClick={() => {
              setForm((f) => ({ ...f, reset: true }));
              // Call with reset flag
              bulkDiscount({
                ...(form.productId ? { productId: form.productId } : {}),
                ...(form.category && !form.productId ? { category: form.category } : {}),
                reset: true,
              }).unwrap()
                .then((res) => { setLastResult(res); toast.success(res.message); })
                .catch((e) => toast.error(e?.data?.message || 'Error'));
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            {isArabic ? 'إعادة تعيين' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — ANNOUNCEMENT BANNERS
// ══════════════════════════════════════════════════════════════════════════════
const BANNER_TEMPLATES = [
  { icon: '🚚', text_en: 'Free shipping on orders over 2000 DA', text_ar: 'شحن مجاني للطلبات فوق 2000 دج', text_fr: 'Livraison gratuite pour les commandes +2000 DA' },
  { icon: '🔥', text_en: 'Limited time offer — Shop now!', text_ar: 'عرض لفترة محدودة — تسوق الآن!', text_fr: 'Offre à durée limitée — Achetez maintenant !' },
  { icon: '🎉', text_en: 'New arrivals just dropped!', text_ar: 'وصلت مجموعة جديدة!', text_fr: 'Nouvelles arrivées disponibles !' },
  { icon: '⭐', text_en: 'Quality stationery, delivered fast', text_ar: 'قرطاسية عالية الجودة، توصيل سريع', text_fr: 'Papeterie de qualité, livraison rapide' },
];

const defaultAnnouncement = () => ({
  type: 'announcement',
  text_en: '',
  text_ar: '',
  text_fr: '',
  link_url: '',
  link_text_en: '',
  link_text_ar: '',
  link_text_fr: '',
  bg_color: '#023c12',
  text_color: '#ffffff',
  is_active: true,
  sort_order: 0,
  start_date: '',
  end_date: '',
});

const AnnouncementBannersTab = ({ isArabic }) => {
  const { data, isLoading } = useGetBannersQuery({ type: 'announcement' });
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultAnnouncement());
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const banners = data?.data || [];

  const openCreate = () => { setEditItem(null); setForm(defaultAnnouncement()); setModalOpen(true); };
  const openEdit = (b) => {
    setEditItem(b);
    setForm({
      ...b,
      start_date: b.start_date ? b.start_date.slice(0, 10) : '',
      end_date: b.end_date ? b.end_date.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const applyTemplate = (t) => setForm((f) => ({ ...f, text_en: t.text_en, text_ar: t.text_ar, text_fr: t.text_fr }));

  const handleSave = async () => {
    if (!form.text_en && !form.text_ar && !form.text_fr) { toast.error('At least one language text is required'); return; }
    try {
      const payload = { ...form, type: 'announcement' };
      if (!payload.start_date) delete payload.start_date;
      if (!payload.end_date) delete payload.end_date;
      if (editItem) {
        await updateBanner({ id: editItem._id, ...payload }).unwrap();
        toast.success('Banner updated');
      } else {
        await createBanner(payload).unwrap();
        toast.success('Banner created');
      }
      setModalOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    try { await deleteBanner(id).unwrap(); toast.success('Banner deleted'); setDeleteConfirm(null); }
    catch (e) { toast.error(e?.data?.message || 'Error'); }
  };

  const toggleActive = async (b) => {
    try {
      await updateBanner({ id: b._id, is_active: !b.is_active }).unwrap();
    } catch (e) { toast.error('Error'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Announcement Banners</h3>
          <p className="text-sm text-gray-500">Rotating bar above the header</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading…</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No announcement banners yet. Add your first slide!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Preview stripe */}
              <div
                className="px-6 py-3 text-sm font-medium flex items-center gap-3"
                style={{ backgroundColor: b.bg_color || '#023c12', color: b.text_color || '#ffffff' }}
              >
                <Megaphone className="w-4 h-4 opacity-70 flex-shrink-0" />
                <span className="flex-1 truncate">{b.text_en || b.text_ar || b.text_fr || '(no text)'}</span>
                {b.link_url && <LinkIcon className="w-3.5 h-3.5 opacity-70" />}
              </div>
              <div className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <StatusBadge active={b.is_active} />
                  {(b.start_date || b.end_date) && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {fmtDate(b.start_date)} – {fmtDate(b.end_date)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">Sort: {b.sort_order}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleActive(b)} className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${b.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {b.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#023c12]">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(b._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Announcement Banner' : 'New Announcement Banner'}>
        {/* Templates */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {BANNER_TEMPLATES.map((t) => (
              <button
                key={t.text_en}
                onClick={() => applyTemplate(t)}
                className="px-3 py-1.5 rounded-lg bg-[#023c12]/8 text-[#023c12] text-xs font-semibold hover:bg-[#023c12]/15 transition-colors border border-[#023c12]/10"
              >
                {t.icon} {t.text_en.slice(0, 22)}…
              </button>
            ))}
          </div>
        </div>

        <Field label="Text (English)">
          <Input value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} placeholder="e.g., Free shipping on orders over 2000 DA" />
        </Field>
        <Field label="Text (Arabic)">
          <Input dir="rtl" value={form.text_ar} onChange={(e) => setForm({ ...form, text_ar: e.target.value })} placeholder="مثال: شحن مجاني للطلبات فوق 2000 دج" />
        </Field>
        <Field label="Text (French)">
          <Input value={form.text_fr} onChange={(e) => setForm({ ...form, text_fr: e.target.value })} placeholder="e.g., Livraison gratuite +2000 DA" />
        </Field>

        <div className="h-px bg-gray-100 my-4" />

        <Field label="Link URL (optional)">
          <Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." />
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label="Link Text (EN)">
            <Input value={form.link_text_en} onChange={(e) => setForm({ ...form, link_text_en: e.target.value })} placeholder="Shop now" />
          </Field>
          <Field label="Link Text (AR)">
            <Input dir="rtl" value={form.link_text_ar} onChange={(e) => setForm({ ...form, link_text_ar: e.target.value })} placeholder="تسوق الآن" />
          </Field>
          <Field label="Link Text (FR)">
            <Input value={form.link_text_fr} onChange={(e) => setForm({ ...form, link_text_fr: e.target.value })} placeholder="Acheter" />
          </Field>
        </div>

        <div className="h-px bg-gray-100 my-4" />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Background Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="w-10 h-8 rounded-lg border border-gray-200 cursor-pointer bg-transparent p-0.5" />
              <Input value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="flex-1" placeholder="#023c12" />
            </div>
          </Field>
          <Field label="Text Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} className="w-10 h-8 rounded-lg border border-gray-200 cursor-pointer bg-transparent p-0.5" />
              <Input value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} className="flex-1" placeholder="#ffffff" />
            </div>
          </Field>
        </div>

        {/* Live Preview */}
        {(form.text_en || form.text_ar) && (
          <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
            <div
              className="px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-3"
              style={{ backgroundColor: form.bg_color, color: form.text_color }}
            >
              <span>{form.text_en || form.text_ar}</span>
              {form.link_url && (
                <span className="underline text-xs opacity-80">{form.link_text_en || 'Learn more'}</span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date">
            <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </Field>
          <Field label="End Date">
            <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </Field>
        </div>
        <Field label="Sort Order (lower = first)">
          <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </Field>
        <div className="mb-6">
          <Toggle checked={form.is_active} onChange={() => setForm({ ...form, is_active: !form.is_active })} label="Active" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={creating || updating} className="flex-1 py-2.5 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] disabled:opacity-60">
            {creating || updating ? 'Saving…' : editItem ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Banner">
        <p className="text-gray-600 mb-6">Delete this banner slide? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// TAB 4 — PROMO AD IMAGES
// ══════════════════════════════════════════════════════════════════════════════
const defaultPromo = () => ({
  type: 'promo_image',
  image_url: '',
  alt_en: '',
  alt_ar: '',
  link_target_url: '',
  placement: 'products_top',
  is_active: true,
  sort_order: 0,
  start_date: '',
  end_date: '',
});

const PromoImagesTab = ({ isArabic }) => {
  const { data, isLoading } = useGetBannersQuery({ type: 'promo_image' });
  const [createBanner, { isLoading: creating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultPromo());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef();

  const banners = data?.data || [];

  const openCreate = () => { setEditItem(null); setForm(defaultPromo()); setModalOpen(true); };
  const openEdit = (b) => {
    setEditItem(b);
    setForm({
      ...b,
      start_date: b.start_date ? b.start_date.slice(0, 10) : '',
      end_date: b.end_date ? b.end_date.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      setForm((f) => ({ ...f, image_url: res.filePath || res.imageUrl || res.url || res.image || '' }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const handleSave = async () => {
    if (!form.image_url) { toast.error('Please upload an image'); return; }
    try {
      const payload = { ...form, type: 'promo_image' };
      if (!payload.start_date) delete payload.start_date;
      if (!payload.end_date) delete payload.end_date;
      if (editItem) {
        await updateBanner({ id: editItem._id, ...payload }).unwrap();
        toast.success('Promo image updated');
      } else {
        await createBanner(payload).unwrap();
        toast.success('Promo image added');
      }
      setModalOpen(false);
    } catch (e) {
      toast.error(e?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    try { await deleteBanner(id).unwrap(); toast.success('Deleted'); setDeleteConfirm(null); }
    catch (e) { toast.error(e?.data?.message || 'Error'); }
  };

  const toggleActive = async (b) => {
    try { await updateBanner({ id: b._id, is_active: !b.is_active }).unwrap(); }
    catch (e) { toast.error('Error'); }
  };

  const placementLabel = (p) => p === 'products_top' ? 'Products Page' : p === 'homepage' ? 'Homepage' : 'Both';

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Promo Ad Images</h3>
          <p className="text-sm text-gray-500">Banners shown on the products page and homepage</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-gray-400">Loading…</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No promo images yet. Upload your first banner!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative aspect-[3/1] bg-gray-100">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.alt_en || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8 opacity-30" />
                  </div>
                )}
                {/* Placement tag */}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-semibold rounded-lg">
                  {placementLabel(b.placement)}
                </span>
                {!b.is_active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">Hidden</span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <StatusBadge active={b.is_active} />
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(b)} className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${b.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {b.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#023c12]">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(b._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-500 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo Image Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Promo Image' : 'Add Promo Image'}>
        {/* Upload Area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="mb-4 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#023c12]/40 hover:bg-[#023c12]/3 transition-all group"
        >
          {form.image_url ? (
            <div className="relative">
              <img src={form.image_url} alt="" className="max-h-32 mx-auto rounded-lg object-contain" />
              <p className="text-xs text-gray-500 mt-2">Click to replace</p>
            </div>
          ) : (
            <div className="py-4">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:text-[#023c12]/40 transition-colors" />
              <p className="text-sm text-gray-500 font-medium">{uploading ? 'Uploading…' : 'Click to upload image'}</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP recommended</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

        <Field label="Alt Text (EN)">
          <Input value={form.alt_en} onChange={(e) => setForm({ ...form, alt_en: e.target.value })} placeholder="Describe the image" />
        </Field>
        <Field label="Alt Text (AR)">
          <Input dir="rtl" value={form.alt_ar} onChange={(e) => setForm({ ...form, alt_ar: e.target.value })} placeholder="وصف الصورة" />
        </Field>
        <Field label="Link URL (clicking image goes here)">
          <Input value={form.link_target_url} onChange={(e) => setForm({ ...form, link_target_url: e.target.value })} placeholder="https://..." />
        </Field>
        <Field label="Placement">
          <Select value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}>
            <option value="products_top">Products Page (top)</option>
            <option value="homepage">Homepage</option>
            <option value="both">Both Pages</option>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date">
            <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          </Field>
          <Field label="End Date">
            <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </Field>
        </div>
        <Field label="Sort Order">
          <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </Field>
        <div className="mb-6">
          <Toggle checked={form.is_active} onChange={() => setForm({ ...form, is_active: !form.is_active })} label="Active" />
        </div>

        <div className="flex gap-3">
          <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={creating || updating || uploading} className="flex-1 py-2.5 bg-[#023c12] text-white rounded-xl text-sm font-semibold hover:bg-[#034d17] disabled:opacity-60">
            {creating || updating ? 'Saving…' : editItem ? 'Update' : 'Add Image'}
          </button>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Promo Image">
        <p className="text-gray-600 mb-6">Delete this promo image? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN OFFERS SCREEN
// ══════════════════════════════════════════════════════════════════════════════
const OffersScreen = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState('coupons');

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

  return (
    <AdminLayout title={isArabic ? 'العروض والخصومات' : 'Offers & Discounts'}>
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#023c12] via-[#034d17] to-[#0a5c1f] text-white p-8 mb-8 shadow-xl"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#D4AF37]/10" />
        <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-[#D4AF37]/5" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-widest">Offers Manager</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">{isArabic ? 'العروض والخصومات' : 'Offers & Discounts'}</h2>
          <p className="text-white/60 text-sm max-w-md">
            {isArabic
              ? 'أدر الكوبونات وتخفيضات المنتجات والبنرات الإعلانية وصور العروض الترويجية.'
              : 'Manage coupons, product discounts, announcement banners, and promotional ad images.'}
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                isActive
                  ? 'bg-[#023c12] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#023c12] hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{isArabic ? tab.labelAr : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'coupons' && <CouponsTab isArabic={isArabic} />}
            {activeTab === 'discounts' && <DiscountsTab isArabic={isArabic} />}
            {activeTab === 'banners' && <AnnouncementBannersTab isArabic={isArabic} />}
            {activeTab === 'ads' && <PromoImagesTab isArabic={isArabic} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default OffersScreen;
