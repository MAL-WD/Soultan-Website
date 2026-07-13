import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const Product = ({ product, layout = 'grid' }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const productName = isArabic ? product.name_ar : product.name_en;
  const categoryName = isArabic ? product.category?.name_ar : product.category?.name_en;
  const isOnSale = product.comparePrice > 0 && product.comparePrice > product.price;
  const isOutOfStock = product.stock === 0;

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(isArabic ? 'تمت الإضافة إلى السلة' : 'Added to cart');
  };

  const buyNowHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
    navigate('/quick-checkout');
  };

  const isList = layout === 'list';

  if (isList) {
    return (
      <Link to={`/product/${product._id}`} className="contents">
        <Card
          className="flex flex-row gap-4 p-3 relative bg-white rounded-[20px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer w-full items-start"
        >
          <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 aspect-square">
            {/* Image Layer */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-[50%_50%] bg-gray-50 transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${product.images?.[0]?.url || '/placeholder.jpg'})`,
              }}
            />
            
            {/* Overlays (Out of Stock / Sale) */}
            {isOutOfStock && (
              <div className="absolute inset-0 w-full h-full bg-ui-color-ui-08 opacity-50 z-10" />
            )}
            {isOutOfStock && (
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-bold text-white text-xs text-center z-20 whitespace-nowrap">
                {isArabic ? "غير متوفر" : "Out of stock"}
              </div>
            )}

            <div className="flex w-full h-[35px] items-center p-1.5 absolute top-0 left-0 z-20">
              {isOnSale && (
                <Badge className="px-1.5 py-0.5 bg-support-notifications-error rounded text-[10px] sm:text-xs">
                  <span className="text-white font-bold">
                    {isArabic ? "خصم" : "SALE"}
                  </span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-stretch justify-between relative flex-grow min-w-0 py-0.5">
            <div className="flex flex-col items-start justify-center gap-1.5 relative w-full">
              <div className="flex flex-col items-start gap-1 relative w-full overflow-hidden">
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider w-full truncate">
                  <span className="text-brand-color-main truncate">{product.brand || "Soltane"}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  <span className="truncate">{categoryName || "Uncategorized"}</span>
                </div>
                <h3 className={`${isArabic ? 'font-arabic text-right' : 'font-english text-left'} font-extrabold text-font-font-color-head text-sm sm:text-lg leading-tight relative self-stretch group-hover:text-brand-color-main transition-colors line-clamp-2`}>
                  {productName}
                </h3>
              </div>

              <div className="flex items-baseline gap-2 relative w-full">
                <span className="text-base sm:text-xl font-bold text-brand-color-accent tracking-tight">
                  {product.price} DZD
                </span>

                {isOnSale && (
                  <span className="text-xs sm:text-sm opacity-70 text-font-font-color-body line-through whitespace-nowrap">
                    {product.comparePrice} DZD
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 w-full">
              <Button 
                onClick={buyNowHandler}
                disabled={isOutOfStock}
                className="flex h-8 sm:h-9 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-[linear-gradient(134deg,rgba(2,60,18,1)_0%,rgba(2,112,32,1)_100%)] items-center justify-center gap-1 hover:brightness-110 transition-all shadow-sm shrink-0"
              >
                <span className="font-bold text-white text-xs">
                  {isArabic ? "شراء الآن" : "Buy now"}
                </span>
              </Button>

              <Button 
                variant="outline"
                onClick={addToCartHandler}
                disabled={isOutOfStock}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-solid border-brand-color-main hover:bg-brand-color-main hover:text-white transition-colors text-brand-color-main text-xs shrink-0"
              >
                 <span className="whitespace-nowrap">
                  {isArabic ? "أضف للسلة" : "Add to cart"}
                </span>
              </Button>

              <Button 
                variant="outline"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product._id}`); }}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 text-xs shrink-0"
              >
                <span className="whitespace-nowrap">
                  {isArabic ? "التفاصيل" : "Details"}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product._id}`} className="contents">
      <Card
        className="flex flex-col min-w-[275px] items-center gap-6 p-4 relative bg-white rounded-[20px] border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full"
      >
        <CardContent className="p-0 w-full flex flex-col h-full">
          <div className="flex flex-col items-center gap-2 bg-gray-100 rounded-xl overflow-hidden relative self-stretch w-full border border-gray-200 aspect-[1/1.1]">
            {/* Image Layer */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-[50%_50%] bg-gray-50 transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${product.images?.[0]?.url || '/placeholder.jpg'})`,
              }}
            />
            
            {/* Overlays (Out of Stock / Sale) */}
            {isOutOfStock && (
              <div className="absolute inset-0 w-full h-full bg-ui-color-ui-08 opacity-50 z-10" />
            )}
            {isOutOfStock && (
              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-ecommerce-product-current-price font-[number:var(--ecommerce-product-current-price-font-weight)] text-white text-[length:var(--ecommerce-product-current-price-font-size)] text-center tracking-[var(--ecommerce-product-current-price-letter-spacing)] leading-[var(--ecommerce-product-current-price-line-height)] whitespace-nowrap [font-style:var(--ecommerce-product-current-price-font-style)] z-20">
                {isArabic ? "غير متوفر" : "Out of stock"}
              </div>
            )}

            <div className="flex w-full h-[45px] items-center p-2 absolute top-0 left-0 z-20">
              {isOnSale && (
                <Badge className="px-2 py-1 bg-support-notifications-error rounded">
                  <span className="w-fit font-[number:var(--paragraph-body-x-small-bold-font-weight)] text-white text-[length:var(--paragraph-body-x-small-bold-font-size)] text-center leading-[var(--paragraph-body-x-small-bold-line-height)] whitespace-nowrap font-paragraph-body-x-small-bold tracking-[var(--paragraph-body-x-small-bold-letter-spacing)] [font-style:var(--paragraph-body-x-small-bold-font-style)]">
                    {isArabic ? "خصم" : "SALE"}
                  </span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between relative flex-1 self-stretch w-full grow mt-6">
            <div className="flex flex-col items-center justify-center gap-3 relative self-stretch w-full">
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider w-full">
                    <span className="text-brand-color-main truncate">{product.brand || "Soltane"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                    <span className="truncate">{categoryName || "Uncategorized"}</span>
                  </div>
                  <h3 className={`${isArabic ? 'font-arabic' : 'font-english'} font-extrabold text-font-font-color-head text-lg leading-tight relative self-stretch group-hover:text-brand-color-main transition-colors line-clamp-2`}>
                    {productName}
                  </h3>
                </div>
              </div>

              <div className="flex items-baseline gap-2 relative self-stretch w-full">
                <span className="text-xl font-bold text-brand-color-accent tracking-tight">
                  {product.price} DZD
                </span>

                {isOnSale && (
                  <span className="relative w-fit opacity-70 font-ecommerce-product-old-price font-[number:var(--ecommerce-product-old-price-font-weight)] text-font-font-color-body text-[length:var(--ecommerce-product-old-price-font-size)] tracking-[var(--ecommerce-product-old-price-letter-spacing)] leading-[var(--ecommerce-product-old-price-line-height)] line-through whitespace-nowrap [font-style:var(--ecommerce-product-old-price-font-style)]">
                    {product.comparePrice} DZD
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start justify-end gap-3 relative self-stretch w-full mt-6">
              <Button 
                onClick={buyNowHandler}
                disabled={isOutOfStock}
                className="flex min-h-10 px-6 py-[11px] self-stretch w-full rounded-[14px] bg-[linear-gradient(134deg,rgba(2,60,18,1)_0%,rgba(2,112,32,1)_100%)] items-center justify-center gap-2 relative hover:brightness-110 transition-all shadow-md w-full"
              >
                <span className="relative flex items-center justify-center w-fit font-button-button-default font-bold text-white text-[length:var(--button-button-default-font-size)] tracking-[var(--button-button-default-letter-spacing)] leading-[var(--button-button-default-line-height)] whitespace-nowrap [font-style:var(--button-button-default-font-style)]">
                  {isArabic ? "شراء الآن" : "Buy now"}
                </span>
              </Button>

              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline"
                  onClick={addToCartHandler}
                  disabled={isOutOfStock}
                  className="flex-1 min-h-10 items-center justify-center gap-2 px-4 py-[11px] relative rounded-[14px] border border-solid border-brand-color-main hover:bg-brand-color-main hover:text-white transition-colors text-brand-color-main group/cart"
                >
                   <span className="relative flex items-center justify-center w-fit font-button-button-default text-[length:var(--button-button-default-font-size)] whitespace-nowrap">
                    {isArabic ? "أضف للسلة" : "Add to cart"}
                  </span>
                </Button>

                <Button 
                  variant="outline"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/product/${product._id}`); }}
                  className="flex-1 min-h-10 items-center justify-center gap-2 px-4 py-[11px] relative rounded-[14px] border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <span className="relative flex items-center justify-center w-fit font-button-button-default text-[length:var(--button-button-default-font-size)] whitespace-nowrap">
                    {isArabic ? "التفاصيل" : "Details"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Product;
