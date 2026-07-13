import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Sliders, Grid3x3, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import Product from '../components/Product';
import BreadcrumbSection from '../components/BreadcrumbSection';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/Animations';

const SearchResultsScreen = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  const { products } = useSelector((state) => state.products) || { products: [] };
  const { categories } = useSelector((state) => state.categories) || { categories: [] };

  useEffect(() => {
    let filtered = products || [];

    // Filter by search query
    if (query) {
      filtered = filtered.filter((product) => {
        const name = (isArabic ? product.name_ar : product.name_en).toLowerCase();
        const description = (isArabic ? product.description_ar : product.description_en).toLowerCase();
        return name.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
      });
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((product) => product.category?._id === category || product.category === category);
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  }, [products, query, category, priceRange, sortBy, isArabic]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handlePriceChange = (type, value) => {
    const newRange = [...priceRange];
    if (type === 'min') {
      newRange[0] = Math.min(Number(value), priceRange[1]);
    } else {
      newRange[1] = Math.max(Number(value), priceRange[0]);
    }
    setPriceRange(newRange);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <BreadcrumbSection
        title={query ? `Search Results for "${query}"` : 'Products'}
        subtitle="Find your perfect products"
      />

      <PageTransition>
        <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-[#f2c161] hover:bg-[#f2c161]/90 text-[#02110c] font-bold"
            >
              Search
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? 'block' : 'hidden'
            } lg:block bg-white p-6 rounded-lg shadow-md h-fit`}
          >
            <h3 className="text-lg font-bold mb-4 text-[#02110c]">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm text-gray-700">Category</h4>
              <select
                value={category}
                onChange={(e) =>
                  navigate(
                    e.target.value
                      ? `/search?q=${query}&category=${e.target.value}`
                      : `/search?q=${query}`
                  )
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#f2c161]"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {isArabic ? cat.name_ar : cat.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm text-gray-700">Price Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Min: {priceRange[0]} DZD</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full accent-[#f2c161]"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max: {priceRange[1]} DZD</label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full accent-[#f2c161]"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                setPriceRange([0, 10000]);
                navigate('/search');
              }}
              variant="outline"
              className="w-full text-sm"
            >
              Reset Filters
            </Button>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </Button>
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} results
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 border rounded p-1">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 ${
                      viewType === 'grid' ? 'bg-[#f2c161]' : 'bg-transparent'
                    } rounded`}
                    title="Grid View"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 ${
                      viewType === 'list' ? 'bg-[#f2c161]' : 'bg-transparent'
                    } rounded`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewType === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <Product key={product._id} product={product} viewType={viewType} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-xl text-gray-500 mb-4">No products found</p>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                <Button className="bg-[#02110c] text-white">Browse All Products</Button>
              </div>
            )}
          </div>
        </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default SearchResultsScreen;
