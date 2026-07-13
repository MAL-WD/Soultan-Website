import React from 'react';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Product from '../components/Product';
import Loader from '../components/Loader';
import { ProductGridSkeleton } from '../components/Skeletons';
import { StaggerContainer, StaggerItem } from '../components/Animations';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const ProductListScreen = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetProductsQuery({});

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-[#02110c]"
      >
        {t('latest')}
      </motion.h1>
      
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.data?.message || error.error}</AlertDescription>
        </Alert>
      ) : (
        <StaggerContainer staggerDelay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.data.map((product) => (
              <StaggerItem key={product._id}>
                <Product product={product} />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </div>
  );
};

export default ProductListScreen;
