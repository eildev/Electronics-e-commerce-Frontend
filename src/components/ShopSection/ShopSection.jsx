import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import FilterSection from './FilterSection';
import ProductSection from './ProductSection';
import { useGetVariantApiQuery } from '../../redux/features/api/variantApi';
import { useGetCategoryApiQuery } from '../../redux/features/api/categoryApi';
import { useGetBrandQuery } from '../../redux/features/api/brandApi';
import { addBrand, addCategoryWithName, clearAllFilters, removeBrand, removeCategoryByName, setFilteredSearchQuery } from '../../redux/features/slice/filterSlice';

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ShopSection = () => {
  const { data, isLoading } = useGetVariantApiQuery();
  const { data: categoryApi } = useGetCategoryApiQuery();
  const { data: brandData } = useGetBrandQuery();
  const dispatch = useDispatch();
  const location = useLocation();

  // Calculate dynamic price range limits
  const prices = useMemo(
    () => data?.variant?.map(item => item?.regular_price).filter(price => price !== undefined && price !== null) || [],
    [data]
  );
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices) - 100) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices) + 100) : 1000;

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Initialize with fallback values
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isPriceRangeReady, setIsPriceRangeReady] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // UI states
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);

  // Update priceRange when minPrice and maxPrice are computed
  useEffect(() => {
    if (prices.length > 0) {
      setPriceRange([minPrice, maxPrice]);
      setIsPriceRangeReady(true);
    }
  }, [minPrice, maxPrice]);

  // Handle location state for category, brand, or search query
  useEffect(() => {
    const { category, brand, searchQuery } = location.state || {};
    
    if (category && categoryApi?.categories) {
      const categoryObj = categoryApi.categories.find(
        (cat) => cat.categoryName.toLowerCase() === category.toLowerCase()
      );
      if (categoryObj) {
        dispatch(addCategoryWithName({ id: categoryObj.id, name: categoryObj.categoryName }));
        setSelectedCategories((prev) => 
          prev.includes(categoryObj.id) ? prev : [...prev, categoryObj.id]
        );
      }
    }

    if (brand && brandData?.Brands) {
      const brandObj = brandData.Brands.find(
        (b) => b.BrandName.toLowerCase() === brand.toLowerCase()
      );
      if (brandObj) {
        dispatch(addBrand({ id: brandObj.id, name: brandObj.BrandName }));
        setSelectedBrands((prev) => 
          prev.includes(brandObj.id) ? prev : [...prev, brandObj.id]
        );
      }
    }

    if (searchQuery) {
      dispatch(setFilteredSearchQuery(searchQuery));
    }
  }, [location.state, categoryApi, brandData, dispatch]);

  // Sidebar toggle
  const sidebarController = () => {
    setActive(!active);
  };

  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle brand selection
  const toggleBrand = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Remove filter
  const removeFilter = (type, value) => {
    if (type === 'category') {
      setSelectedCategories((prev) => prev.filter((id) => id !== value));
      dispatch(removeCategoryByName(
        categoryApi?.categories?.find((c) => c.id === value)?.categoryName
      ));
    } else if (type === 'brand') {
      setSelectedBrands((prev) => prev.filter((id) => id !== value));
      dispatch(removeBrand(
        brandData?.Brands?.find((b) => b.id === value)?.BrandName
      ));
    } else if (type === 'price') {
      setPriceRange([minPrice, maxPrice]);
    } else if (type === 'search') {
      dispatch(setFilteredSearchQuery(''));
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([minPrice, maxPrice]);
    setCurrentPage(1);
    dispatch(clearAllFilters());
    toast.success('Filters reset');
  };

  // Debounced filter function
  const applyFilters = useMemo(() => debounce((products, categories, brands, priceRange) => {
    let filtered = products;

    // Apply category filter
    if (categories.length > 0) {
      filtered = filtered.filter((item) =>
        categories.includes(item.product?.category_id) ||
        categories.includes(item.product?.subcategory_id)
      );
    }

    // Apply brand filter
    if (brands.length > 0) {
      filtered = filtered.filter((item) =>
        brands.includes(item.product?.brand_id)
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (item) =>
        item.regular_price >= priceRange[0] &&
        item.regular_price <= priceRange[1]
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, 300), []);

  // Filter products
  useEffect(() => {
    if (data?.variant && isPriceRangeReady) {
      applyFilters(data.variant, selectedCategories, selectedBrands, priceRange);
    }
  }, [data, selectedCategories, selectedBrands, priceRange, isPriceRangeReady, applyFilters]);

  // Paginate filtered products
  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <section className="shop py-80">
      <div className={`side-overlay ${active && 'show'}`}></div>
      <div className="container container-lg">
        <div className="row">
          <FilterSection
            active={active}
            sidebarController={sidebarController}
            categoryApi={categoryApi}
            brandData={brandData}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            toggleCategory={toggleCategory}
            toggleBrand={toggleBrand}
            removeFilter={removeFilter}
            handleResetFilters={handleResetFilters}
            searchQuery={location.state?.searchQuery || ''}
            isPriceRangeReady={isPriceRangeReady}
          />
          <ProductSection
            isLoading={isLoading}
            paginatedData={paginatedData}
            filteredProducts={filteredProducts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            grid={grid}
            setGrid={setGrid}
            sidebarController={sidebarController}
          />
        </div>
      </div>
    </section>
  );
};

export default ShopSection;