import React from "react";
import Product from "../../../components/Product";

export const RelatedProductsSection = ({ products, isArabic, isDark }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className={`flex flex-col items-center gap-10 px-6 lg:px-12 py-20 w-full ${isDark ? 'bg-transparent' : 'bg-gray-50/50'}`}>
      <div className="flex flex-col max-w-[1344px] items-center gap-10 w-full">
        <h2 className={`self-stretch mt-[-1.00px] font-heading-heading-5 font-bold text-2xl lg:text-3xl tracking-tight leading-tight ${isDark ? 'text-emerald-100' : 'text-font-font-color-head'}`}>
          {isArabic ? "قد يعجبك أيضا" : "You may also like"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
