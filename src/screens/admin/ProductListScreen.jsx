import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  Plus,
  Package,
  Search,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import AdminLayout from '../../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ProductListScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        const res = await createProduct().unwrap();
        const productId = res.data?._id || res._id;
        toast.success('Product created successfully');
        setTimeout(() => navigate(`/admin/product/${productId}/edit`), 100);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filtered = data?.data?.filter(
    (p) =>
      !search ||
      p.name_en?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      {(loadingCreate || loadingDelete) && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">{data?.data?.length || 0} products total</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#023c12]/20 focus:border-[#023c12] bg-white w-48"
            />
          </div>
          <button
            onClick={createProductHandler}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#023c12] text-white text-sm font-semibold hover:bg-[#023c12]/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Product</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-24"><Loader /></div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-[#023c12]/3">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered?.map((product, idx) => {
                  const mainImage = product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;
                  const inStock = (product.stock || 0) > 0;
                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[#023c12]/2 transition-colors"
                    >
                      <td className="px-5 py-3">
                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={product.name_en}
                            className="w-10 h-10 object-cover rounded-xl border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-gray-900 truncate max-w-[180px]">{product.name_en}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{product._id.slice(-8)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-bold text-[#023c12]">{product.price?.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1">DZD</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 font-medium">
                          <Tag className="w-3 h-3" />
                          {product.category?.name_en || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{product.brand || '—'}</td>
                      <td className="px-5 py-3">
                        {inStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                            <XCircle className="w-3.5 h-3.5" />
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/product/${product._id}/edit`}>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#023c12]/8 text-[#023c12] hover:bg-[#023c12] hover:text-white transition-all">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            {filtered?.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">No products found</div>
            )}
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default ProductListScreen;
