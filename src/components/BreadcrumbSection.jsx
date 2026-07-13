import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const BreadcrumbSection = ({ product }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const breadcrumbItems = [
    { 
      label: isArabic ? "الرئيسية" : "Home", 
      path: "/", 
      isActive: false 
    },
    { 
      label: isArabic ? "المنتجات" : "Products", 
      path: "/products", 
      isActive: false 
    },
    ...(product?.category ? [{
      label: isArabic ? product.category.name_ar : product.category.name_en,
      path: `/products?category=${product.category._id}`,
      isActive: false
    }] : []),
    { 
      label: isArabic ? product?.name_ar : product?.name_en || product?.name || "", 
      path: null, 
      isActive: true 
    },
  ].filter(item => item.label); // Remove empty items

  return (
    <section className="flex flex-col items-start justify-center gap-[15px] px-4 sm:px-6 lg:px-12 py-4 w-full border-b border-[#dfdfdf] bg-white">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-4">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isActive ? (
                  <BreadcrumbPage className="font-medium text-font-font-color-head">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={item.path || "#"} 
                      className="text-gray-600 hover:text-brand-color-main transition-colors"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  );
};

export default BreadcrumbSection;


