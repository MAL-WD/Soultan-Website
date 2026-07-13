import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  useGetProductDetailsQuery, 
  useGetProductsQuery
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { toast } from 'react-toastify';

// New Sections
import { BreadcrumbSection } from './ProductDetailScreen/sections/BreadcrumbSection';
import { KeyFeaturesSection } from './ProductDetailScreen/sections/KeyFeaturesSection';
import { RelatedProductsSection } from './ProductDetailScreen/sections/RelatedProductsSection';

const ProductDetailScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);

  const { data: productData, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const product = productData?.data || productData;

  // Get related products (same category, exclude current product)
  const { data: relatedProductsData } = useGetProductsQuery(
    { category: product?.category?._id || product?.category },
    { skip: !product?.category }
  );
  const relatedProducts = (relatedProductsData?.data || []).filter(p => p._id !== productId).slice(0, 4);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    toast.success(isArabic ? 'تمت الإضافة إلى السلة' : 'Added to cart');
  };

  const buyNowHandler = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    navigate('/quick-checkout');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (isLoading) return <Loader />;
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.data?.message || error.error}</AlertDescription>
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {product && <BreadcrumbSection product={product} isArabic={isArabic} />}
      
      {product && (
        <KeyFeaturesSection 
          product={product} 
          isArabic={isArabic} 
          qty={qty} 
          setQty={setQty} 
          addToCartHandler={addToCartHandler}
          buyNowHandler={buyNowHandler}
        />
      )}

      {relatedProducts.length > 0 && (
        <RelatedProductsSection 
          products={relatedProducts} 
          isArabic={isArabic} 
        />
      )}
    </div>
  );
};

export default ProductDetailScreen;

