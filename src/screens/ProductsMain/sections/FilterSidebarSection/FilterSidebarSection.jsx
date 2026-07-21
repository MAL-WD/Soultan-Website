import {
  ChevronDownIcon,
  ChevronRightIcon,
  Grid3x3Icon,
  ListIcon,
  SearchIcon,
  ArrowRightIcon,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
import { useTheme } from "../../../../context/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// CategoryProductSection
// Renders a section for one top-level category: header + up to 6 products in
// a 2-col × 3-row grid. Hidden completely when the category has 0 products.
// ─────────────────────────────────────────────────────────────────────────────
const CategoryProductSection = ({ category, isArabic, isDark }) => {
  const navigate = useNavigate();
  const categoryName = isArabic ? category.name_ar : category.name_en;
  const PAGE_SIZE = 6;

  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem(`cat_page_${category._id}`);
    return saved ? parseInt(saved, 10) : 1;
  });
  const [allProducts, setAllProducts] = useState(() => {
    const saved = sessionStorage.getItem(`cat_products_${category._id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(`cat_page_${category._id}`, page);
  }, [page, category._id]);

  useEffect(() => {
    if (allProducts.length > 0) {
      sessionStorage.setItem(`cat_products_${category._id}`, JSON.stringify(allProducts));
    }
  }, [allProducts, category._id]);

  const { data, isLoading, isFetching } = useGetProductsQuery({
    category: category._id,
    page,
    limit: PAGE_SIZE,
  });

  const totalProducts = data?.total || 0;
  const totalPages = data?.pages || 1;
  const hasMore = page < totalPages;

  // Accumulate products as pages load
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllProducts(data.data);
      } else {
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newOnes = data.data.filter((p) => !existingIds.has(p._id));
          return [...prev, ...newOnes];
        });
      }
    }
  }, [data, page]);

  // Hide section entirely if no products and not loading
  if (!isLoading && allProducts.length === 0 && !isFetching) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.5, ease: [0.21, 1.11, 0.81, 0.99] }}
      className="flex flex-col gap-4 w-full"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-emerald-100' : 'text-font-font-color-head'}`}>
          {categoryName}
          {totalProducts > 0 && (
            <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${isDark ? 'bg-emerald-900/50 text-emerald-400/70' : 'bg-gray-100 text-gray-400'}`}>
              {totalProducts}
            </span>
          )}
        </h2>
        <button
          onClick={() => navigate(`/products?category=${category._id}`)}
          className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
        >
          {isArabic ? "عرض الكل" : "See All"}
          <ArrowRightIcon
            className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isArabic ? "rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0" : ""}`}
          />
        </button>
      </div>

      {/* Product Grid */}
      {isLoading && allProducts.length === 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div
              key={i}
              className={`aspect-[3/4] rounded-2xl animate-pulse ${isDark ? 'bg-[#1a3620]' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
          {allProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: (index % PAGE_SIZE) * 0.04,
                ease: [0.21, 1.11, 0.81, 0.99],
              }}
            >
              <Product product={product} layout="grid" />
            </motion.div>
          ))}
          {/* Skeleton placeholders while fetching next page */}
          {isFetching && page > 1 &&
            [...Array(PAGE_SIZE)].map((_, i) => (
              <div
                key={`skel-${i}`}
                className={`aspect-[3/4] rounded-2xl animate-pulse ${isDark ? 'bg-[#1a3620]' : 'bg-gray-200'}`}
              />
            ))
          }
        </div>
      )}

      {/* Load More / All Shown */}
      {!isLoading && (
        hasMore ? (
          <div className="w-full flex justify-center pt-2 pb-1">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isFetching}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#061409] hover:from-amber-400 hover:to-amber-300 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-brand-color-main to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-emerald-500/20'
              }`}
            >
              {isFetching ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {isArabic ? "جاري التحميل..." : "Loading..."}
                </>
              ) : (
                <>
                  {isArabic ? "عرض المزيد" : "Load More"}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        ) : allProducts.length > PAGE_SIZE ? (
          <div className="w-full text-center pb-1">
            <span className={`inline-flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full ${isDark ? 'bg-emerald-900/30 text-emerald-600/60' : 'bg-gray-100 text-gray-400'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isArabic ? "تم عرض جميع المنتجات" : "All products shown"}
            </span>
          </div>
        ) : null
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-800/50 to-transparent mt-2" />
    </motion.section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FilterSidebarSection
// ─────────────────────────────────────────────────────────────────────────────
export const FilterSidebarSection = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isArabic = i18n.language === "ar";
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // State declarations - must be before useMemo hooks that use them
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "all");
  const [selectedBrand, setSelectedBrand] = useState("All Brand");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedCategories, setExpandedCategories] = useState([]);
  
  const [viewMode, setViewMode] = useState(() => {
    return sessionStorage.getItem('products_viewMode') || "grid";
  });
  useEffect(() => {
    sessionStorage.setItem('products_viewMode', viewMode);
  }, [viewMode]);

  const filterKey = `${selectedCategory}_${searchQuery}_${selectedBrand}_${sortBy}`;
  const prevFilterKey = React.useRef(filterKey);

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem(`flat_page_${filterKey}`);
    return saved ? parseInt(saved, 10) : 1;
  });
  const [itemsPerPage] = useState(12);
  const [allLoadedProducts, setAllLoadedProducts] = useState(() => {
    const saved = sessionStorage.getItem(`flat_products_${filterKey}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    sessionStorage.setItem(`flat_page_${filterKey}`, currentPage);
  }, [currentPage, filterKey]);

  useEffect(() => {
    if (allLoadedProducts.length > 0) {
      sessionStorage.setItem(`flat_products_${filterKey}`, JSON.stringify(allLoadedProducts));
    }
  }, [allLoadedProducts, filterKey]);

  // Fetch categories and products from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  // First, find the active category object if one is selected
  const activeCategoryObj = useMemo(() => {
    if (!categoryFromUrl) return null;
    let found = null;
    for (const cat of categories) {
      if (cat._id === categoryFromUrl || cat.slug === categoryFromUrl) {
        found = cat;
        break;
      }
      if (cat.subcategories) {
        const sub = cat.subcategories.find(
          (s) => s._id === categoryFromUrl || s.slug === categoryFromUrl
        );
        if (sub) {
          found = sub;
          break;
        }
      }
    }
    return found;
  }, [categoryFromUrl, categories]);

  // Check if active category is a top-level category with subcategories
  const isTopLevelCategoryWithSubs = useMemo(() => {
    if (!activeCategoryObj) return false;
    const isTopLevel = categories.some((c) => c._id === activeCategoryObj._id);
    return isTopLevel && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0;
  }, [activeCategoryObj, categories]);

  // Determine if we should show a grouped view (sections by category)
  // This happens when:
  // 1. "All Products" (no category, no search) -> map over top-level categories
  // 2. A top-level category with subs is selected, and no search -> map over its subcategories
  const isGroupedView = !searchQuery && (!categoryFromUrl || isTopLevelCategoryWithSubs);

  // Build query params for flat-list mode (used when a category or search is active)
  const productQueryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };
    if (categoryFromUrl) {
      if (categoryFromUrl.match(/^[0-9a-fA-F]{24}$/)) {
        params.category = categoryFromUrl;
      } else {
        let foundCategory = null;
        for (const cat of categories) {
          if (
            cat.name_en === categoryFromUrl ||
            cat.name_ar === categoryFromUrl ||
            cat.slug === categoryFromUrl
          ) {
            foundCategory = cat;
            break;
          }
          if (cat.subcategories) {
            const sub = cat.subcategories.find(
              (s) =>
                s.name_en === categoryFromUrl ||
                s.name_ar === categoryFromUrl ||
                s.slug === categoryFromUrl
            );
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

  // Only run the flat-list query when NOT in grouped view
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError,
  } = useGetProductsQuery(productQueryParams, { skip: isGroupedView });

  // Accumulate products for infinite scroll (flat-list mode)
  useEffect(() => {
    if (productsData?.data) {
      if (currentPage === 1) {
        setAllLoadedProducts(productsData.data);
      } else {
        setAllLoadedProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newProducts = productsData.data.filter((p) => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      }
      setHasMore(currentPage < (productsData.pages || 0));
    }
  }, [productsData, currentPage]);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Extract unique brands from loaded products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    allLoadedProducts.forEach((product) => {
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
    const isSelected =
      selectedCategory === category._id || selectedCategory === category.slug;
    const hasSubcategories =
      category.subcategories && category.subcategories.length > 0;

    if (isSelected) {
      setSelectedCategory("all");
      searchParams.delete("category");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      );
    } else {
      setSelectedCategory(category._id);
      searchParams.set("category", category._id);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${searchParams.toString()}`
      );
      if (hasSubcategories && !expandedCategories.includes(category._id)) {
        toggleCategory(category._id);
      }
    }
  };

  // Filter and sort products (flat-list mode)
  const filteredProducts = useMemo(() => {
    let filtered = [...allLoadedProducts];

    if (selectedBrand !== "All Brand") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const nameEn = (product.name_en || "").toLowerCase();
        const nameAr = (product.name_ar || "").toLowerCase();
        const descEn = (product.description_en || "").toLowerCase();
        const descAr = (product.description_ar || "").toLowerCase();
        return (
          nameEn.includes(query) ||
          nameAr.includes(query) ||
          descEn.includes(query) ||
          descAr.includes(query)
        );
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === "price-low-high") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high-low") return (b.price || 0) - (a.price || 0);
      if (sortBy === "name-a-z") {
        const nameA = isArabic ? a.name_ar || "" : a.name_en || "";
        const nameB = isArabic ? b.name_ar || "" : b.name_en || "";
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "newest")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return 0;
    });
  }, [allLoadedProducts, selectedBrand, searchQuery, sortBy, isArabic]);

  // Reset pagination when filters change
  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      setCurrentPage(1);
      setAllLoadedProducts([]);
      prevFilterKey.current = filterKey;
    }
  }, [filterKey]);

  // Load more handler (button-based pagination)
  const handleLoadMore = () => {
    if (!productsFetching && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts;

  const renderCategories = (cats, level = 0) => {
    return cats.map((category) => {
      const isExpanded = expandedCategories.includes(category._id);
      const isActive =
        selectedCategory === category._id ||
        selectedCategory === category.slug;
      const categoryName = isArabic ? category.name_ar : category.name_en;
      const hasSubcategories =
        category.subcategories && category.subcategories.length > 0;

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
                  ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-brand-color-main/10 text-brand-color-main")
                  : (isDark ? "hover:bg-emerald-900/50 text-emerald-100" : "hover:bg-gray-100 text-font-font-color-body")
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
                className="p-2 hover:bg-emerald-900/50 rounded transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <ChevronDownIcon className={`w-4 h-4 ${isDark ? 'text-emerald-400/70' : 'text-font-font-color-body'}`} />
                ) : (
                  <ChevronRightIcon className={`w-4 h-4 ${isDark ? 'text-emerald-400/70' : 'text-font-font-color-body'}`} />
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

  // Dynamic page title
  const pageTitle = useMemo(() => {
    if (searchQuery) {
      return isArabic
        ? `نتائج البحث عن: "${searchQuery}"`
        : `Results for: "${searchQuery}"`;
    }
    if (selectedCategory && selectedCategory !== "all") {
      let found = null;
      for (const cat of categories) {
        if (cat._id === selectedCategory || cat.slug === selectedCategory) {
          found = cat;
          break;
        }
        if (cat.subcategories) {
          const sub = cat.subcategories.find(
            (s) => s._id === selectedCategory || s.slug === selectedCategory
          );
          if (sub) {
            found = sub;
            break;
          }
        }
      }
      if (found) return isArabic ? found.name_ar : found.name_en;
    }
    return isArabic ? "جميع المنتجات" : "All Products";
  }, [selectedCategory, searchQuery, categories, isArabic]);

  return (
    <section
      className="flex flex-col max-w-[1344px] items-center justify-center gap-14 relative w-full px-6 py-12"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="flex flex-col max-w-[1000px] items-center justify-center gap-6 relative w-full">
        <h1 className={`self-stretch font-bold text-4xl md:text-5xl lg:text-6xl text-center leading-tight relative tracking-normal ${isDark ? 'text-white' : 'text-font-font-color-head'}`}>
          {pageTitle}
        </h1>
      </header>

      <div className="flex flex-col lg:items-start lg:flex-row gap-6 relative self-stretch w-full px-4 md:px-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between w-full mb-4">
          <Button
            variant="outline"
            onClick={() =>
              setExpandedCategories((prev) =>
                prev.length === 0 ? categories.map((c) => c._id) : []
              )
            }
            className={`flex items-center gap-2 bg-transparent ${isDark ? 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/40' : 'border-[#dfdfdf] text-font-font-color-head hover:bg-gray-100'}`}
          >
            <ChevronRightIcon
              className={`w-4 h-4 transition-transform ${expandedCategories.length > 0 ? "rotate-90" : ""}`}
            />
            {isArabic ? "عرض الفئات" : "Show Categories"}
          </Button>
          <div className={`text-sm font-medium ${isDark ? 'text-emerald-300/70' : 'text-font-font-color-body'}`}>
            {isArabic ? "المنتجات" : "Products"}
          </div>
        </div>

        <aside
          className={`${
            expandedCategories.length > 0 || window.innerWidth >= 1024
              ? "flex"
              : "hidden"
          } lg:flex flex-col w-full lg:w-[296px] items-start gap-4 px-4 py-6 relative rounded-xl border shadow-lg shrink-0 ${isDark ? 'bg-[#0f2814] border-emerald-800/50' : 'bg-white border-[#dfdfdf]'}`}
        >
          <nav className="flex items-start gap-2 relative self-stretch w-full">
            <div className="flex flex-col items-start gap-2 relative flex-1 grow max-h-[600px] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  searchParams.delete("category");
                  window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
                  );
                }}
                className={`flex items-center gap-6 px-4 py-3 relative self-stretch w-full rounded-xl transition-colors ${
                  selectedCategory === "all"
                    ? (isDark ? "bg-amber-500/20 text-amber-400" : "bg-brand-color-main/10 text-brand-color-main")
                    : (isDark ? "hover:bg-emerald-900/50 text-emerald-100" : "hover:bg-gray-100 text-font-font-color-body")
                }`}
              >
                <span className="flex items-center justify-start flex-1 relative font-UI-ui-sidebar font-bold">
                  {isArabic ? "جميع المنتجات" : "All Products"}
                </span>
              </button>
              {categoriesLoading ? (
                <div className="px-4 py-2 text-sm text-emerald-400/70">
                  {isArabic ? "جاري التحميل..." : "Loading categories..."}
                </div>
              ) : (
                renderCategories(categories)
              )}
            </div>
          </nav>
        </aside>

        <main className="flex flex-col items-center justify-center gap-6 relative flex-1 grow w-full">
          <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
            {/* Search Bar */}
            <div className={`flex items-center gap-2 p-3 self-stretch w-full rounded-xl border relative shadow-md ${isDark ? 'bg-[#0f2814] border-emerald-800/50' : 'bg-white border-[#dfdfdf]'}`}>
              <SearchIcon className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-font-font-color-body'}`} />
              <input
                type="text"
                placeholder={isArabic ? "ابحث عن المنتجات..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 outline-none font-form-form-placeholder bg-transparent ${isDark ? 'text-emerald-100 placeholder:text-emerald-600/60' : 'text-font-font-color-head placeholder:text-font-font-color-body'}`}
              />
            </div>

            {/* Filters & Sort Bar — hidden in grouped view */}
            {!isGroupedView && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative self-stretch w-full gap-4">
                <div className="flex flex-wrap items-center gap-4 relative w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-3 relative w-full">
                    <span className={`relative font-medium text-sm shrink-0 ${isDark ? 'text-emerald-200' : 'text-font-font-color-body'}`}>
                      {isArabic ? "تصفية حسب:" : "Filter by:"}
                    </span>

                    {/* Category Filter */}
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
                          window.history.replaceState(
                            {},
                            "",
                            `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
                          );
                        }}
                        className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-colors ${isDark ? 'bg-[#122816] hover:bg-[#1a3620] border border-emerald-800/40 text-emerald-100' : 'bg-white hover:bg-gray-50 border border-[#dfdfdf] text-font-font-color-head'}`}
                      >
                        <option value="all">
                          {isArabic ? "جميع الفئات" : "All Categories"}
                        </option>
                        {categories.map((cat) => (
                          <React.Fragment key={cat._id}>
                            <option value={cat._id} className="font-bold">
                              {isArabic ? cat.name_ar : cat.name_en}
                            </option>
                            {cat.subcategories?.map((sub) => (
                              <option key={sub._id} value={sub._id}>
                                &nbsp;&nbsp;
                                {isArabic ? `└ ${sub.name_ar}` : `└ ${sub.name_en}`}
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
                        className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-colors ${isDark ? 'bg-[#122816] hover:bg-[#1a3620] border border-emerald-800/40 text-emerald-100' : 'bg-white hover:bg-gray-50 border border-[#dfdfdf] text-font-font-color-head'}`}
                      >
                        {availableBrands.map((brand) => (
                          <option key={brand} value={brand} className={`uppercase ${isDark ? 'bg-[#0f2814]' : 'bg-white'}`}>
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
                    <span className={`relative font-medium text-sm shrink-0 ${isDark ? 'text-emerald-200' : 'text-font-font-color-body'}`}>
                      {isArabic ? "ترتيب:" : "Sort:"}
                    </span>
                    <div className="relative flex-1 sm:flex-none min-w-[140px]">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-colors ${isDark ? 'bg-[#122816] hover:bg-[#1a3620] border border-emerald-800/40 text-emerald-100' : 'bg-white hover:bg-gray-50 border border-[#dfdfdf] text-font-font-color-head'}`}
                      >
                        <option value="newest">
                          {isArabic ? "الأحدث" : "Newest"}
                        </option>
                        <option value="oldest">
                          {isArabic ? "الأقدم" : "Oldest"}
                        </option>
                        <option value="price-low-high">
                          {isArabic ? "السعر: منخفض" : "Price: Low"}
                        </option>
                        <option value="price-high-low">
                          {isArabic ? "السعر: مرتفع" : "Price: High"}
                        </option>
                        <option value="name-a-z">
                          {isArabic ? "أ - ي" : "A - Z"}
                        </option>
                      </select>
                      <ChevronDownIcon className="w-4 h-4 text-emerald-500/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 relative">
                    <div className={`inline-flex items-center relative rounded-lg p-1 ${isDark ? 'bg-[#122816]' : 'bg-gray-100'}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-9 h-9 rounded-md transition-all ${
                          viewMode === "grid"
                            ? (isDark ? "bg-emerald-800/60 shadow-sm scale-110" : "bg-white shadow-sm scale-110")
                            : (isDark ? "hover:bg-emerald-900/50" : "hover:bg-gray-200")
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3x3Icon
                          className={`w-4 h-4 ${
                            viewMode === "grid"
                              ? (isDark ? "text-amber-400" : "text-brand-color-main")
                              : (isDark ? "text-emerald-500/60" : "text-font-font-color-body")
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`w-9 h-9 rounded-md transition-all ${
                          viewMode === "list"
                            ? (isDark ? "bg-emerald-800/60 shadow-sm scale-110" : "bg-white shadow-sm scale-110")
                            : (isDark ? "hover:bg-emerald-900/50" : "hover:bg-gray-200")
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <ListIcon
                          className={`w-4 h-4 ${
                            viewMode === "list"
                              ? (isDark ? "text-amber-400" : "text-brand-color-main")
                              : (isDark ? "text-emerald-500/60" : "text-font-font-color-body")
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────── */}
          {/* GROUPED VIEW — All Products or Top-Level Category      */}
          {/* ─────────────────────────────────────────────────────── */}
          {isGroupedView ? (
            <div className="flex flex-col gap-10 relative self-stretch w-full">
              {categoriesLoading ? (
                <div className="w-full flex justify-center py-20">
                  <Loader />
                </div>
              ) : (
                (!categoryFromUrl || !isTopLevelCategoryWithSubs || !activeCategoryObj) ? (
                  categories.map((category) => (
                    <CategoryProductSection
                      key={category._id}
                      category={category}
                      isArabic={isArabic}
                      isDark={isDark}
                    />
                  ))
                ) : (
                  activeCategoryObj.subcategories.map((subCategory) => (
                    <CategoryProductSection
                      key={subCategory._id}
                      category={subCategory}
                      isArabic={isArabic}
                      isDark={isDark}
                    />
                  ))
                )
              )}
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────── */
            /* FLAT LIST — Category selected or search active         */
            /* ─────────────────────────────────────────────────────── */
            <div className="flex flex-col items-center sm:items-end gap-10 relative self-stretch w-full">
              <div className="w-full relative self-stretch">
                {productsLoading ? (
                  <div className="w-full flex justify-center py-20">
                    <Loader />
                  </div>
                ) : productsError ? (
                  <Alert variant="destructive" className="w-full">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {productsError?.data?.message ||
                        productsError.error ||
                        "Failed to load products"}
                    </AlertDescription>
                  </Alert>
                ) : paginatedProducts.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full">
                      {paginatedProducts.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: (index % itemsPerPage) * 0.04,
                            ease: [0.21, 1.11, 0.81, 0.99],
                          }}
                        >
                          <Product product={product} layout="grid" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // List view
                    <div className="flex flex-col gap-4 w-full">
                      {paginatedProducts.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: (index % itemsPerPage) * 0.04,
                          }}
                        >
                          <Product product={product} layout="list" />
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="w-full text-center py-10 text-emerald-500/70">
                    {isArabic ? "لم يتم العثور على منتجات" : "No products found."}
                  </div>
                )}
              </div>

              {/* Load More Button */}
              {hasMore && paginatedProducts.length > 0 && (
                <div className="w-full flex justify-center pt-4 pb-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={productsFetching}
                    className={`relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-[#061409] hover:from-amber-400 hover:to-amber-300 shadow-amber-500/20'
                        : 'bg-gradient-to-r from-brand-color-main to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-500 shadow-emerald-500/20'
                    }`}
                  >
                    {productsFetching ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        {isArabic ? "جاري التحميل..." : "Loading..."}
                      </>
                    ) : (
                      <>
                        {isArabic ? "عرض المزيد" : "Load More"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}

              {!hasMore && paginatedProducts.length > 0 && (
                <div className="w-full text-center py-8">
                  <div className={`inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full ${
                    isDark ? 'bg-emerald-900/30 text-emerald-600/70' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isArabic ? "لقد شاهدت جميع المنتجات" : "You've seen all products"}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};
