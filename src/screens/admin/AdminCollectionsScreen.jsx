import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Search,
  Package,
  GripVertical,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from '../../slices/collectionsApiSlice';
import {
  useGetProductsQuery,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

// ─── Status Badge ─────────────────────────────────────────────────────────────
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] flex flex-col">
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

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminCollectionsScreen = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data: collectionsData, isLoading, refetch } = useGetCollectionsQuery();
  const collections = collectionsData?.data || [];

  const [createCollection, { isLoading: creating }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: updating }] = useUpdateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descFr, setDescFr] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  
  // Versions state
  const defaultVersion = { name_en: 'Standard', name_ar: 'الأساسية', name_fr: '', products: [] };
  const [versions, setVersions] = useState([defaultVersion]);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);

  // Product search
  const [productSearch, setProductSearch] = useState('');
  const { data: productsData } = useGetProductsQuery({ search: productSearch || undefined, limit: 20 });
  const availableProducts = productsData?.data || [];

  const resetForm = () => {
    setNameEn(''); setNameAr(''); setNameFr('');
    setDescEn(''); setDescAr(''); setDescFr('');
    setImage(''); setIsActive(true); setOrder(0);
    setVersions([defaultVersion]); 
    setActiveVersionIndex(0);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (col) => {
    setEditingId(col._id);
    setNameEn(col.name_en || '');
    setNameAr(col.name_ar || '');
    setNameFr(col.name_fr || '');
    setDescEn(col.description_en || '');
    setDescAr(col.description_ar || '');
    setDescFr(col.description_fr || '');
    setImage(col.image || '');
    setIsActive(col.isActive);
    setOrder(col.order || 0);
    
    if (col.versions && col.versions.length > 0) {
      setVersions(col.versions.map(v => ({
        ...v,
        products: (v.products || []).map(p => ({
          product: p.product?._id || p.product,
          name: p.product?.name_en || 'Product',
          defaultQuantity: p.defaultQuantity || 1,
        }))
      })));
    } else {
      setVersions([defaultVersion]);
    }
    setActiveVersionIndex(0);
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadImage(formData).unwrap();
      setImage(res.filePath);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    }
  };

  // ─── Version Handlers ───
  const addVersion = () => {
    setVersions([...versions, { name_en: 'New Version', name_ar: 'نسخة جديدة', name_fr: '', products: [] }]);
    setActiveVersionIndex(versions.length);
  };

  const removeVersion = (index) => {
    if (versions.length === 1) return toast.error('Collection must have at least one version');
    const newVersions = versions.filter((_, i) => i !== index);
    setVersions(newVersions);
    setActiveVersionIndex(Math.max(0, activeVersionIndex - 1));
  };

  const updateVersionName = (field, value) => {
    const newVersions = [...versions];
    newVersions[activeVersionIndex][field] = value;
    setVersions(newVersions);
  };

  // ─── Product Handlers (for active version) ───
  const activeVersion = versions[activeVersionIndex] || defaultVersion;
  const selectedProducts = activeVersion.products;

  const addProduct = (product) => {
    if (selectedProducts.find((p) => p.product === product._id)) {
      toast.info('Product already added to this version');
      return;
    }
    const newVersions = [...versions];
    newVersions[activeVersionIndex].products.push({
      product: product._id, name: product.name_en, defaultQuantity: 1
    });
    setVersions(newVersions);
  };

  const removeProduct = (productId) => {
    const newVersions = [...versions];
    newVersions[activeVersionIndex].products = newVersions[activeVersionIndex].products.filter(p => p.product !== productId);
    setVersions(newVersions);
  };

  const updateProductQty = (productId, qty) => {
    const newVersions = [...versions];
    const pIndex = newVersions[activeVersionIndex].products.findIndex(p => p.product === productId);
    if (pIndex > -1) {
      newVersions[activeVersionIndex].products[pIndex].defaultQuantity = Math.max(1, qty);
    }
    setVersions(newVersions);
  };

  const handleSubmit = async () => {
    if (!nameEn || !nameAr || !image) {
      toast.error('Name (EN, AR) and image are required');
      return;
    }

    // Validate versions
    for (let i = 0; i < versions.length; i++) {
      if (!versions[i].name_en || !versions[i].name_ar) {
        toast.error(`Version ${i+1} is missing English or Arabic names`);
        return;
      }
    }

    const payload = {
      name_en: nameEn,
      name_ar: nameAr,
      name_fr: nameFr,
      description_en: descEn,
      description_ar: descAr,
      description_fr: descFr,
      image,
      isActive,
      order,
      versions: versions.map(v => ({
        name_en: v.name_en,
        name_ar: v.name_ar,
        name_fr: v.name_fr,
        products: v.products.map(p => ({
          product: p.product,
          defaultQuantity: p.defaultQuantity,
        })),
      }))
    };

    try {
      if (editingId) {
        await updateCollection({ id: editingId, ...payload }).unwrap();
        toast.success('Collection updated');
      } else {
        await createCollection(payload).unwrap();
        toast.success('Collection created');
      }
      setModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await deleteCollection(id).unwrap();
        toast.success('Collection deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <AdminLayout title={isArabic ? 'المجموعات' : 'Collections'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{collections.length} collections total</p>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#023c12] text-white text-sm font-semibold hover:bg-[#023c12]/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isArabic ? 'إنشاء مجموعة' : 'Create Collection'}</span>
        </button>
      </div>

      {/* Collections List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#023c12]/20 border-t-[#023c12] rounded-full animate-spin" />
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No collections yet</p>
          <p className="text-gray-300 text-sm mt-1">Create your first collection to group products together.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map((col) => (
            <motion.div
              key={col._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {col.image ? (
                  <img src={col.image} alt={col.name_en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">{col.name_en}</h3>
                <p className="text-xs text-gray-400 truncate">{col.name_ar}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    <Package className="w-3 h-3 inline mr-1" />
                    {col.versions?.[0]?.products?.length || 0} products
                  </span>
                  <StatusBadge active={col.isActive} />
                  {col.versions?.length > 1 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                      {col.versions.length} versions
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(col)}
                  className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(col._id)}
                  className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); resetForm(); }}
        title={editingId ? (isArabic ? 'تعديل المجموعة' : 'Edit Collection') : (isArabic ? 'إنشاء مجموعة' : 'Create Collection')}
      >
        <div className="space-y-5">
          {/* Base Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Name (EN) <span className="text-red-400">*</span></label>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12]" placeholder="Back to School" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Name (AR) <span className="text-red-400">*</span></label>
              <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} dir="rtl" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12]" placeholder="العودة إلى المدرسة" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Name (FR)</label>
              <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12]" placeholder="Rentrée scolaire" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description (EN)</label>
              <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description (AR)</label>
              <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={2} dir="rtl" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Description (FR)</label>
              <textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] resize-none" />
            </div>
          </div>

          {/* Image & Settings */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Cover Image <span className="text-red-400">*</span></label>
              <div className="flex items-center gap-3">
                {image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={image} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-[#023c12] hover:text-[#023c12] transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? '...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active</label>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isActive ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#023c12]/20"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Versions Manager */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-800">Versions / Tiers</h4>
              <button 
                onClick={addVersion}
                className="text-xs font-semibold text-[#023c12] bg-[#023c12]/10 px-2 py-1 rounded-lg hover:bg-[#023c12]/20 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Version
              </button>
            </div>

            {/* Version Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2 mb-3">
              {versions.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setActiveVersionIndex(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                    activeVersionIndex === i 
                      ? 'bg-[#023c12] text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {v.name_en || `Version ${i+1}`}
                </button>
              ))}
            </div>

            {/* Active Version Editor */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
              {versions.length > 1 && (
                <button 
                  onClick={() => removeVersion(activeVersionIndex)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pr-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Version Name (EN)</label>
                  <input 
                    value={activeVersion.name_en} 
                    onChange={(e) => updateVersionName('name_en', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-[#023c12]/20" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Version Name (AR)</label>
                  <input 
                    value={activeVersion.name_ar} 
                    onChange={(e) => updateVersionName('name_ar', e.target.value)}
                    dir="rtl"
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-1 focus:ring-[#023c12]/20" 
                  />
                </div>
              </div>

              {/* Product Selector for Active Version */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Products in this version</label>
                
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products to add..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12]"
                  />
                </div>

                {/* Search Results */}
                {productSearch && availableProducts.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl mb-3 divide-y divide-gray-50 bg-white shadow-lg relative z-10">
                    {availableProducts.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => addProduct(product)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 m-2 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name_en}</p>
                          <p className="text-[10px] text-gray-400">{product.price} DA</p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Products */}
                {selectedProducts.length > 0 ? (
                  <div className="space-y-2">
                    {selectedProducts.map((sp) => (
                      <div
                        key={sp.product}
                        className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-gray-100"
                      >
                        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{sp.name}</span>
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-gray-400 mr-1">Qty:</label>
                          <input
                            type="number"
                            min={1}
                            value={sp.defaultQuantity}
                            onChange={(e) => updateProductQty(sp.product, parseInt(e.target.value) || 1)}
                            className="w-14 px-2 py-1 rounded-lg border border-gray-200 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#023c12]/20"
                          />
                        </div>
                        <button
                          onClick={() => removeProduct(sp.product)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">No products added to this version yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={creating || updating}
            className="w-full py-3 rounded-xl bg-[#023c12] text-white font-semibold text-sm hover:bg-[#023c12]/90 disabled:opacity-50 transition-all"
          >
            {creating || updating ? 'Saving...' : editingId ? 'Update Collection' : 'Create Collection'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCollectionsScreen;
