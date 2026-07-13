import {
  ChevronDownIcon,
  ChevronRightIcon,
  Grid3x3Icon,
  ListIcon,
  SearchIcon,
} from "lucide-react";
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProductsQuery } from "../../../../slices/productsApiSlice";
import { useGetCategoriesQuery } from "../../../../slices/categoriesApiSlice";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import Loader from "../../../../components/Loader";
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";
import Product from "../../../../components/Product";

// Removed mock data - now using API

export const FilterSidebarSection = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // State declarations - must be before useMemo hooks that use them
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "all");
  const [selectedBrand, setSelectedBrand] = useState("All Brand");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [allLoadedProducts, setAllLoadedProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();

  // Fetch categories and products from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Build query params for products
  const productQueryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (categoryFromUrl) {
      // Check if it's an ObjectId or category name
      if (categoryFromUrl.match(/^[0-9a-fA-F]{24}$/)) {
        params.category = categoryFromUrl;
      } else {
        // Find category by name or slug (recursive search)
        let foundCategory = null;
        for (const cat of categories) {
          if (cat.name_en === categoryFromUrl || cat.name_ar === categoryFromUrl || cat.slug === categoryFromUrl) {
            foundCategory = cat;
            break;
          }
          if (cat.subcategories) {
            const sub = cat.subcategories.find(s => s.name_en === categoryFromUrl || s.name_ar === categoryFromUrl || s.slug === categoryFromUrl);
            if (sub) {
              foundCategory = sub;
              break;
            }
          }
        }
        
        if (foundCategory) {
          params.category = foundCategory._id;
        }
      }
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    return params;
  }, [categoryFromUrl, searchQuery, categories, currentPage, itemsPerPage]);

  const { data: productsData, isLoading: productsLoading, isFetching: productsFetching, error: productsError } = useGetProductsQuery(productQueryParams);
  
  // Update products when data is received
  useEffect(() => {
    if (productsData?.data) {
        if (currentPage === 1) {
            setAllLoadedProducts(productsData.data);
        } else {
            setAllLoadedProducts(prev => {
                // Prevent duplicate products
                const existingIds = new Set(prev.map(p => p._id));
                const newProducts = productsData.data.filter(p => !existingIds.has(p._id));
                return [...prev, ...newProducts];
            });
        }
        setHasMore(currentPage < (productsData.pages || 0));
    }
  }, [productsData, currentPage]);


  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
    } else {
        setSelectedCategory("all");
    }
  }, [searchParams]);

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    allLoadedProducts.forEach(product => {
      if (product.brand) brands.add(product.brand);
    });
    return ["All Brand", ...Array.from(brands).sort()];
  }, [allLoadedProducts]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (category) => {
    const isSelected = selectedCategory === category._id || selectedCategory === category.slug;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    if (isSelected) {
      setSelectedCategory("all"); // Deselect
      // Update URL
      searchParams.delete("category");
      window.history.replaceState({}, "", `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
    } else {
      setSelectedCategory(category._id);
      // Update URL
      searchParams.set("category", category._id);
      window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
      
      // Auto-expand if it has children
      if (hasSubcategories && !expandedCategories.includes(category._id)) {
        toggleCategory(category._id);
      }
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allLoadedProducts];

    // Filter by brand
    if (selectedBrand !== "All Brand") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }



    // Filter by search query (client-side for better UX)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const nameEn = (product.name_en || "").toLowerCase();
        const nameAr = (product.name_ar || "").toLowerCase();
        const descEn = (product.description_en || "").toLowerCase();
        const descAr = (product.description_ar || "").toLowerCase();
        return nameEn.includes(query) || nameAr.includes(query) || 
               descEn.includes(query) || descAr.includes(query);
      });
    }

    // Sort products
    return filtered.sort((a, b) => {
      if (sortBy === "price-low-high") {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === "price-high-low") {
        return (b.price || 0) - (a.price || 0);
      } else if (sortBy === "name-a-z") {
        const nameA = isArabic ? (a.name_ar || "") : (a.name_en || "");
        const nameB = isArabic ? (b.name_ar || "") : (b.name_en || "");
        return nameA.localeCompare(nameB);
      } else if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return 0;
    });
  }, [allLoadedProducts, selectedBrand, selectedCategory, searchQuery, sortBy, isArabic]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setAllLoadedProducts([]); // Clear current products to show loading state for new filters
  }, [selectedCategory, searchQuery, selectedBrand, sortBy]);

  // Observer for last element
  const lastProductElementRef = useCallback(node => {
    if (productsLoading || productsFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [productsLoading, productsFetching, hasMore]);

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts;

  const renderCategories = (cats, level = 0) => {
    return cats.map((category) => {
      const isExpanded = expandedCategories.includes(category._id);
      const isActive = selectedCategory === category._id || selectedCategory === category.slug;
      const categoryName = isArabic ? category.name_ar : category.name_en;
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;

      return (
        <div
          key={category._id}
          className="flex flex-col items-start gap-2.5 relative self-stretch w-full"
        >
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center gap-2 px-4 py-3 relative flex-1 rounded-xl transition-colors ${
                isActive
                  ? "bg-brand-color-main-hover-light text-brand-color-main"
                  : "hover:bg-gray-50 text-font-font-color-head"
              }`}
              style={{ paddingInlineStart: `${16 + level * 16}px` }}
            >
               <span
                className={`flex items-center justify-start flex-1 relative font-UI-ui-sidebar ${
                  isActive
                    ? "font-[number:var(--UI-ui-sidebar-sub-font-weight)] text-[length:var(--UI-ui-sidebar-sub-font-size)]"
                    : "font-[number:var(--UI-ui-sidebar-font-weight)] text-[length:var(--UI-ui-sidebar-font-size)]"
                }`}
              >
                {categoryName}
              </span>
            </button>
            {hasSubcategories && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category._id);
                }}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-font-font-color-body" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-font-font-color-body" />
                )}
              </button>
            )}
          </div>
          
          {hasSubcategories && isExpanded && (
            <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-1 duration-200">
              {renderCategories(category.subcategories, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Determine the dynamic page title
  const pageTitle = useMemo(() => {
    if (searchQuery) {
      return isArabic ? `نتائج البحث عن: "${searchQuery}"` : `Results for: "${searchQuery}"`;
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      // Look for category in parent list or subcategories
      let found = null;
      for (const cat of categories) {
        if (cat._id === selectedCategory || cat.slug === selectedCategory) {
          found = cat;
          break;
        }
        if (cat.subcategories) {
          const sub = cat.subcategories.find(s => s._id === selectedCategory || s.slug === selectedCategory);
          if (sub) {
            found = sub;
            break;
          }
        }
      }
      if (found) {
        return isArabic ? found.name_ar : found.name_en;
      }
    }
    
    return isArabic ? "جميع المنتجات" : "All Products";
  }, [selectedCategory, searchQuery, categories, isArabic]);

  return (
    <section className="flex flex-col max-w-[1344px] items-center justify-center gap-14 relative w-full px-6 py-12" dir={isArabic ? "rtl" : "ltr"}>
      <header className="flex flex-col max-w-[1000px] items-center justify-center gap-6 relative w-full">
        <h1 className="self-stretch font-bold text-font-font-color-head text-4xl md:text-5xl lg:text-6xl text-center leading-tight relative tracking-normal">
          {pageTitle}
        </h1>
      </header>

      <div className="flex flex-col lg:items-start lg:flex-row gap-6 relative self-stretch w-full px-4 md:px-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between w-full mb-4">
          <Button 
            variant="outline" 
            onClick={() => setExpandedCategories(prev => prev.length === 0 ? categories.map(c => c._id) : [])}
            className="flex items-center gap-2 border-brand-color-main text-brand-color-main"
          >
            <ChevronRightIcon className={`w-4 h-4 transition-transform ${expandedCategories.length > 0 ? 'rotate-90' : ''}`} />
            {isArabic ? "عرض الفئات" : "Show Categories"}
          </Button>
          <div className="text-sm font-medium text-font-on-surface-variant">
            {totalItems} {isArabic ? "منتج" : "Products"}
          </div>
        </div>

        <aside className={`${expandedCategories.length > 0 || window.innerWidth >= 1024 ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[296px] items-start gap-4 px-4 py-6 relative bg-white rounded-xl border border-gray-200 shadow-sm shrink-0`}>
          <nav className="flex items-start gap-2 relative self-stretch w-full">
            <div className="flex flex-col items-start gap-2 relative flex-1 grow max-h-[600px] overflow-y-auto custom-scrollbar">
             <button
                onClick={() => {
                  setSelectedCategory("all");
                  searchParams.delete("category");
                  window.history.replaceState({}, "", `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
                }}
                className={`flex items-center gap-6 px-4 py-3 relative self-stretch w-full rounded-xl transition-colors ${
                  selectedCategory === "all"
                    ? "bg-brand-color-main-hover-light text-brand-color-main"
                    : "hover:bg-gray-50 text-font-font-color-head"
                }`}
              >
                <span className="flex items-center justify-start flex-1 relative font-UI-ui-sidebar font-bold">
                  {isArabic ? "جميع المنتجات" : "All Products"}
                </span>
              </button>
              {categoriesLoading ? (
                <div className="px-4 py-2 text-sm text-gray-500">{isArabic ? "جاري التحميل..." : "Loading categories..."}</div>
              ) : (
                renderCategories(categories)
              )}
            </div>
          </nav>
        </aside>

        <main className="flex flex-col items-center justify-center gap-6 relative flex-1 grow w-full">
          <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
            <div className="flex items-center gap-2 p-3 self-stretch w-full bg-white rounded border border-solid border-[#dfdfdf] relative shadow-sm">
              <SearchIcon className="w-4 h-4 text-font-font-color-body flex-shrink-0" />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن المنتجات..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none font-form-form-placeholder text-font-font-color-body bg-transparent"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative self-stretch w-full gap-4">
              <div className="flex flex-wrap items-center gap-4 relative w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-3 relative w-full">
                  <span className="relative font-medium text-font-font-color-head text-sm shrink-0">
                    {isArabic ? "تصفية حسب:" : "Filter by:"}
                  </span>

                  {/* Category Filter - Visible on tablets/mobile search bar area but redundant with sidebar on desktop */}
                 <div className="relative flex-1 sm:flex-none min-w-[120px]">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          if (e.target.value === "all") {
                            searchParams.delete("category");
                          } else {
                            searchParams.set("category", e.target.value);
                          }
                          window.history.replaceState({}, "", `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
                        }}
                        className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-font-font-color-head outline-none cursor-pointer transition-colors"
                    >
                        <option value="all">{isArabic ? "جميع الفئات" : "All Categories"}</option>
                        {categories.map(cat => (
                          <React.Fragment key={cat._id}>
                            <option value={cat._id} className="font-bold">{isArabic ? cat.name_ar : cat.name_en}</option>
                            {cat.subcategories?.map(sub => (
                              <option key={sub._id} value={sub._id}>
                                &nbsp;&nbsp;{isArabic ? `└ ${sub.name_ar}` : `└ ${sub.name_en}`}
                              </option>
                            ))}
                          </React.Fragment>
                         ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-font-font-color-body absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>

                  {/* Brand Filter */}
                  <div className="relative flex-1 sm:flex-none min-w-[120px]">
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-font-font-color-head outline-none cursor-pointer transition-colors"
                    >
                        {availableBrands.map(brand => (
                            <option key={brand} value={brand} className="uppercase">
                              {brand === "All Brand" ? brand : brand.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-font-font-color-body absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
                
              <div className="flex flex-wrap items-center gap-4 relative w-full sm:w-auto justify-between sm:justify-end">
                {/* Sort By */}
                <div className="flex items-center gap-2 relative flex-1 sm:flex-none">
                    <span className="relative font-medium text-font-font-color-head text-sm shrink-0">
                        {isArabic ? "ترتيب:" : "Sort:"}
                    </span>
                    <div className="relative flex-1 sm:flex-none min-w-[140px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-font-font-color-head outline-none cursor-pointer transition-colors"
                        >
                            <option value="newest">{isArabic ? "الأحدث" : "Newest"}</option>
                            <option value="oldest">{isArabic ? "الأقدم" : "Oldest"}</option>
                            <option value="price-low-high">{isArabic ? "السعر: منخفض" : "Price: Low"}</option>
                            <option value="price-high-low">{isArabic ? "السعر: مرتفع" : "Price: High"}</option>
                            <option value="name-a-z">{isArabic ? "أ - ي" : "A - Z"}</option>
                        </select>
                         <ChevronDownIcon className="w-4 h-4 text-font-font-color-body absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-2 relative">
                    <div className="inline-flex items-center relative bg-gray-100 rounded-lg p-1">
                      <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`w-9 h-9 rounded-md transition-all ${viewMode === 'grid' ? "bg-white shadow-sm scale-110" : "hover:bg-gray-200"}`}
                              onClick={() => setViewMode("grid")}
                          >
                          <Grid3x3Icon className={`w-4 h-4 ${viewMode === 'grid' ? 'text-brand-color-main' : "text-font-font-color-body"}`} />
                          </Button>

                      <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`w-9 h-9 rounded-md transition-all ${viewMode === 'list' ? "bg-white shadow-sm scale-110" : "hover:bg-gray-200"}`}
                          onClick={() => setViewMode("list")}
                      >
                          <ListIcon className={`w-4 h-4 ${viewMode === 'list' ? 'text-brand-color-main' : "text-font-font-color-body"}`} />
                      </Button>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-10 relative self-stretch w-full">
            <div className="w-full relative self-stretch">
              {productsLoading ? (
                <div className="w-full flex justify-center py-20">
                  <Loader />
                </div>
              ) : productsError ? (
                <Alert variant="destructive" className="w-full">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{productsError?.data?.message || productsError.error || "Failed to load products"}</AlertDescription>
                </Alert>
              ) : paginatedProducts.length > 0 ? (
                viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {paginatedProducts.map((product, index) => {
                          const productName = isArabic ? product.name_ar : product.name_en;
                          const categoryName = isArabic ? product.category?.name_ar : product.category?.name_en;
                          const isOnSale = product.comparePrice > 0 && product.comparePrice > product.price;
                          const isOutOfStock = product.stock === 0;
                          const isLast = index === paginatedProducts.length - 1;
                          
                          return (
                            <motion.div
                              key={product._id}
                              ref={isLast ? lastProductElementRef : null}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                              transition={{ 
                                duration: 0.5, 
                                delay: (index % itemsPerPage) * 0.05,
                                ease: [0.21, 1.11, 0.81, 0.99]
                              }}
                            >
                              <Product product={product} layout="grid" />
                            </motion.div>
                          );
                        })}
                    </div>
                ) : (
                    // ListView Implementation
                    <div className="flex flex-col gap-4 w-full">
                        {paginatedProducts.map((product, index) => {
                          const productName = isArabic ? product.name_ar : product.name_en;
                          const categoryName = isArabic ? product.category?.name_ar : product.category?.name_en;
                          const isLast = index === paginatedProducts.length - 1;
                          
                          return (
                            <motion.div
                              key={product._id}
                              ref={isLast ? lastProductElementRef : null}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                              transition={{ 
                                duration: 0.4, 
                                delay: (index % itemsPerPage) * 0.05 
                              }}
                            >
                               <Product product={product} layout="list" />
                            </motion.div>
                          );
                        })}
                    </div>
                )
            ) : (
                <div className="w-full text-center py-10 text-gray-500">
                  {isArabic ? "لم يتم العثور على منتجات" : "No products found."}
                </div>
              )}
            </div>

            {productsFetching && currentPage > 1 && (
              <div className="w-full flex justify-center py-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader />
                  <p className="text-sm text-gray-400 animate-pulse">
                    {isArabic ? "جاري تحميل المزيد..." : "Loading more products..."}
                  </p>
                </div>
              </div>
            )}

            {!hasMore && paginatedProducts.length > 0 && (
              <div className="w-full text-center py-10">
                <p className="text-gray-400 text-sm">
                  {isArabic ? "لقد شاهدت جميع المنتجات" : "You've seen all products"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};
