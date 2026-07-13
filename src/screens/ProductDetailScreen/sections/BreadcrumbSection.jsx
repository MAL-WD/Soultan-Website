import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";

export const BreadcrumbSection = ({ product, isArabic }) => {
  const breadcrumbItems = [
    { label: isArabic ? "جميع المنتجات" : "All products", link: "/products" },
    { label: isArabic ? product.category?.name_ar : product.category?.name_en, link: `/products?category=${product.category?._id || ""}` },
    { label: isArabic ? product.name_ar : product.name_en, isActive: true },
  ];

  return (
    <section className="flex flex-col items-start justify-center gap-[15px] px-6 lg:px-12 py-4 w-full border-b border-[#dfdfdf]">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-2 lg:gap-4">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.isActive ? (
                  <BreadcrumbPage className="font-paragraph-body-small-bold font-[number:var(--paragraph-body-small-bold-font-weight)] text-font-font-color-head text-[length:var(--paragraph-body-small-bold-font-size)] tracking-[var(--paragraph-body-small-bold-letter-spacing)] leading-[var(--paragraph-body-small-bold-line-height)] [font-style:var(--paragraph-body-small-bold-font-style)]">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="font-paragraph-body-small font-[number:var(--paragraph-body-small-font-weight)] text-font-font-color-body text-[length:var(--paragraph-body-small-font-size)] tracking-[var(--paragraph-body-small-letter-spacing)] leading-[var(--paragraph-body-small-line-height)] [font-style:var(--paragraph-body-small-font-style)]">
                    <Link to={item.link}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className={`w-3 h-3 text-ui-color-ui-05 ${isArabic ? 'rotate-180' : ''}`} />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  );
};
