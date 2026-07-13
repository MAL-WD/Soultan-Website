import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0' },
  transition: { repeat: Infinity, duration: 2, ease: 'linear' },
};

export const ProductSkeleton = () => (
  <motion.div
    {...shimmer}
    style={{
      backgroundImage:
        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
    }}
    className="rounded-lg overflow-hidden"
  >
    <div className="bg-gray-200 w-full h-48 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="pt-2 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-full"></div>
        <div className="h-8 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  </motion.div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export const CartItemSkeleton = () => (
  <motion.div
    {...shimmer}
    style={{
      backgroundImage:
        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
    }}
    className="bg-gray-200 h-24 rounded-lg mb-4"
  />
);

export const CartSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
    <div className="lg:col-span-1">
      <motion.div
        {...shimmer}
        style={{
          backgroundImage:
            'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
        }}
        className="bg-gray-200 h-40 rounded-lg"
      />
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <motion.div
      {...shimmer}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
      }}
      className="lg:col-span-2 bg-gray-200 h-96 rounded-lg"
    />
    <motion.div
      {...shimmer}
      style={{
        backgroundImage:
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
      }}
      className="bg-gray-200 h-64 rounded-lg"
    />
  </div>
);

export const SkeletonFade = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);
