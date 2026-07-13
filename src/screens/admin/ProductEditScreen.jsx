import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Image as ImageIcon,
  Star,
  Save,
  Package,
  DollarSign,
  Tag,
  Palette,
  FileText,
  Link2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import Loader from '../../components/Loader';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/AdminLayout';

// Section wrapper for form sections
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
      <div className="w-8 h-8 rounded-xl bg-[#023c12]/8 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#023c12]" />
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Styled input with floating label support
const FieldInput = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
      {hint && <span className="normal-case tracking-normal font-normal text-gray-400 ml-1">({hint})</span>}
    </label>
    {children}
  </div>
);

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isEditMode = !!productId;

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [price, setPrice] = useState(0);
  const [comparePrice, setComparePrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [isInStock, setIsInStock] = useState(true);
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [availableColors, setAvailableColors] = useState('');
  const [reference, setReference] = useState('');
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [productOptions, setProductOptions] = useState('');
  const [parentCategory, setParentCategory] = useState('');

  const { data: productData, isLoading, refetch, error } = useGetProductDetailsQuery(productId, {
    skip: !isEditMode,
  });
  const { data: categoriesData, isLoading: loadingCategories } = useGetCategoriesQuery();
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (isEditMode && productData && categoriesData) {
      const product = productData.data;
      if (!product) return;

      setNameEn(product.name_en || '');
      setNameAr(product.name_ar || '');
      setPrice(product.price || 0);
      setComparePrice(product.comparePrice || 0);
      setBrand(product.brand || '');
      setIsInStock((product.stock || 0) > 0);
      setDescriptionEn(product.description_en || '');
      setDescriptionAr(product.description_ar || '');
      setAvailableColors(product.availableColors ? product.availableColors.join(', ') : '');
      setProductOptions(product.productOptions ? product.productOptions.join(', ') : '');
      setReference(product.reference || '');
      setImages(product.images || []);

      const initialCategoryId = product.category?._id || product.category;
      if (initialCategoryId) {
        const isTopLevel = categoriesData.data.find((c) => c._id === initialCategoryId);
        if (isTopLevel) {
          setParentCategory(initialCategoryId);
          setCategory(initialCategoryId);
        } else {
          const parentOfSub = categoriesData.data.find((parent) =>
            parent.subcategories?.some((sub) => sub._id === initialCategoryId)
          );
          if (parentOfSub) {
            setParentCategory(parentOfSub._id);
            setCategory(initialCategoryId);
          } else {
            setCategory(initialCategoryId);
          }
        }
      }
    }
  }, [productData, categoriesData, isEditMode]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    try {
      const colorsArray = availableColors.split(',').map((c) => c.trim()).filter(Boolean);
      const optionsArray = productOptions.split(',').map((o) => o.trim()).filter(Boolean);
      const payload = {
        name_en: nameEn,
        name_ar: nameAr,
        price,
        comparePrice: comparePrice || 0,
        brand,
        category,
        description_en: descriptionEn,
        description_ar: descriptionAr,
        stock: isInStock ? 100 : 0,
        availableColors: colorsArray,
        productOptions: optionsArray,
        reference,
        images,
      };

      if (isEditMode) {
        await updateProduct({ productId, ...payload }).unwrap();
        toast.success('Product updated');
      } else {
        if (window.confirm('Are you sure you want to create this product?')) {
          await createProduct(payload).unwrap();
          toast.success('Product created successfully');
        } else return;
      }
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      const newImage = { url: res.filePath, isMain: images.length === 0 };
      setImages([...images, newImage]);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addImageByUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { url: newImageUrl, isMain: images.length === 0 }]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

  const setMainImage = (index) =>
    setImages(images.map((img, i) => ({ ...img, isMain: i === index })));

  const isBusy = loadingUpdate || loadingCreate;

  return (
    <AdminLayout title={isEditMode ? 'Edit Product' : 'Create Product'}>
      {/* Back */}
      <Link
        to="/admin/productlist"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#023c12] transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {isBusy && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {isEditMode && isLoading ? (
        <div className="flex justify-center py-24"><Loader /></div>
      ) : (
        <form onSubmit={submitHandler} className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* LEFT COLUMN — main form */}
            <div className="xl:col-span-2 space-y-5">
              {/* Basic Info */}
              <Section title="Basic Information" icon={Package}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldInput label="Name (English)" required>
                    <Input
                      placeholder="Enter English name"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </FieldInput>
                  <FieldInput label="Name (Arabic)" required>
                    <Input
                      placeholder="أدخل الاسم بالعربية"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      dir="rtl"
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20 text-right"
                    />
                  </FieldInput>
                  <FieldInput label="Reference / SKU">
                    <Input
                      placeholder="e.g., SLT-001"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </FieldInput>
                  <FieldInput label="Brand">
                    <Input
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </FieldInput>
                </div>
              </Section>

              {/* Pricing & Stock */}
              <Section title="Pricing & Stock" icon={DollarSign}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <FieldInput label="Current Price (DZD)" required>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20 font-bold text-[#023c12]"
                    />
                  </FieldInput>
                  <FieldInput label="Original Price (DZD)" hint="optional">
                    <Input
                      type="number"
                      placeholder="Leave empty if no discount"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20 text-gray-400"
                    />
                  </FieldInput>
                  <FieldInput label="Stock Status">
                    <button
                      type="button"
                      onClick={() => setIsInStock(!isInStock)}
                      className={`w-full h-11 px-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isInStock
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isInStock ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-semibold">
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isInStock ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isInStock ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </FieldInput>
                </div>
              </Section>

              {/* Descriptions */}
              <Section title="Descriptions" icon={FileText}>
                <div className="space-y-5">
                  <FieldInput label="Description (English)">
                    <Textarea
                      rows={5}
                      placeholder="Enter detailed English description..."
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20 resize-none"
                    />
                  </FieldInput>
                  <FieldInput label="Description (Arabic)">
                    <Textarea
                      rows={5}
                      placeholder="أدخل وصف المنتج بالتفصيل..."
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      dir="rtl"
                      className="rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20 resize-none text-right"
                    />
                  </FieldInput>
                </div>
              </Section>
            </div>

            {/* RIGHT COLUMN — images, category, attributes */}
            <div className="space-y-5">
              {/* Product Images */}
              <Section title="Product Images" icon={ImageIcon}>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                        img.isMain ? 'border-[#D4AF37] shadow-md' : 'border-gray-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-20 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setMainImage(index)}
                          title="Set as Main"
                          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                            img.isMain ? 'bg-[#D4AF37] text-[#023c12]' : 'bg-white text-gray-700 hover:bg-[#D4AF37] hover:text-[#023c12]'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {img.isMain && (
                        <span className="absolute top-1 left-1 text-[9px] font-bold bg-[#D4AF37] text-[#023c12] px-1.5 py-0.5 rounded shadow-sm uppercase">
                          Main
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Upload Tile */}
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl h-20 flex flex-col items-center justify-center text-gray-400 hover:border-[#023c12] hover:text-[#023c12] transition-colors cursor-pointer">
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={uploadFileHandler}
                      accept="image/*"
                    />
                    {loadingUpload ? (
                      <div className="w-4 h-4 border-2 border-[#023c12] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] mt-0.5 font-medium">Upload</span>
                      </>
                    )}
                  </div>
                </div>

                {/* URL Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                      placeholder="Or paste image URL..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageByUrl())}
                      className="pl-8 h-9 rounded-xl text-sm border-gray-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addImageByUrl}
                    className="px-3 h-9 rounded-xl bg-[#023c12]/8 text-[#023c12] text-xs font-semibold hover:bg-[#023c12] hover:text-white transition-all whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              </Section>

              {/* Category */}
              <Section title="Category" icon={Tag}>
                <div className="space-y-4">
                  <FieldInput label="Main Category" required>
                    {loadingCategories ? (
                      <div className="h-11 flex items-center"><Loader /></div>
                    ) : (
                      <select
                        className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] bg-white text-gray-700"
                        value={parentCategory}
                        onChange={(e) => {
                          const parentId = e.target.value;
                          setParentCategory(parentId);
                          const sel = categoriesData?.data?.find((c) => c._id === parentId);
                          if (!sel?.subcategories?.length && parentId) {
                            setCategory(parentId);
                          } else {
                            setCategory('');
                          }
                        }}
                      >
                        <option value="">Select main category</option>
                        {categoriesData?.data?.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name_en} / {cat.name_ar}
                          </option>
                        ))}
                      </select>
                    )}
                  </FieldInput>

                  <FieldInput label="Sub Category">
                    <select
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] bg-white text-gray-700 disabled:opacity-40"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={
                        !parentCategory ||
                        !(categoriesData?.data?.find((c) => c._id === parentCategory)?.subcategories?.length > 0)
                      }
                    >
                      <option value="">Select sub category</option>
                      {parentCategory &&
                        categoriesData?.data
                          ?.find((c) => c._id === parentCategory)
                          ?.subcategories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name_en} / {cat.name_ar}
                            </option>
                          ))}
                    </select>
                  </FieldInput>
                </div>
              </Section>

              {/* Attributes */}
              <Section title="Attributes" icon={Palette}>
                <div className="space-y-4">
                  <FieldInput label="Available Options" hint="comma separated">
                    <Input
                      placeholder="96 pages, Pack of 12..."
                      value={productOptions}
                      onChange={(e) => setProductOptions(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </FieldInput>
                  <FieldInput label="Available Colors" hint="comma separated">
                    <Input
                      placeholder="Gold, Green, Silver..."
                      value={availableColors}
                      onChange={(e) => setAvailableColors(e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-[#023c12] focus:ring-[#023c12]/20"
                    />
                  </FieldInput>
                </div>
              </Section>

              {/* Save Button */}
              <motion.button
                type="submit"
                disabled={isBusy}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl bg-[#023c12] text-white font-bold text-sm shadow-lg shadow-[#023c12]/20 hover:bg-[#023c12]/90 transition-colors disabled:opacity-60 py-4"
              >
                <Save className="w-5 h-5" />
                {isEditMode ? 'Save Changes' : 'Create Product'}
              </motion.button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default ProductEditScreen;
