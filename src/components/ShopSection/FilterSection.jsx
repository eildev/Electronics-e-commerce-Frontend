
import React from 'react';
import ReactSlider from 'react-slider';
import toast from 'react-hot-toast';

const FilterSection = ({
  active,
  sidebarController,
  categoryApi,
  brandData,
  selectedCategories,
  selectedBrands,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  toggleCategory,
  toggleBrand,
  removeFilter,
  handleResetFilters,
  searchQuery, // Added searchQuery prop
}) => {
  return (
    <div className="col-lg-3">
      <div className={`shop-sidebar ${active ? 'active' : ''}`}>
        <button
          onClick={sidebarController}
          type="button"
          className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
        >
          <i className="ph ph-x" />
        </button>

        {/* Filter Controls */}
        <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
          <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
            Filters
          </h6>
          <div className="flex-between flex-wrap-reverse gap-8 mb-24">
            <button
              type="button"
              className="btn btn-main h-40 flex-align"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
          {/* Selected Filters */}
          {(selectedCategories.length > 0 ||
            selectedBrands.length > 0 ||
            priceRange[0] !== minPrice ||
            priceRange[1] !== maxPrice ||
            searchQuery) && (
            <div className="selected-filters mb-24">
              <h6 className="text-md mb-12">Selected Filters:</h6>
              <div className="flex flex-wrap gap-8">
                {selectedCategories.map((catId) => {
                  const category = categoryApi?.categories?.find(
                    (c) => c.id === catId
                  );
                  return (
                    <span
                      key={`cat-${catId}`}
                      className="badge btn btn-main text-white px-8 py-8 me-4 mb-2 shadow-sm d-inline-flex align-items-center gap-1"
                    >
                      {category?.categoryName}
                      <i
                        className="ph ph-x ms-1 fw-bold text-white hover:text-primary cursor-pointer"
                        onClick={() => removeFilter('category', catId)}
                      />
                    </span>
                  );
                })}
                {selectedBrands.map((brandId) => {
                  const brand = brandData?.Brands?.find((b) => b.id === brandId);
                  return (
                    <span
                      key={`brand-${brandId}`}
                      className="badge btn btn-main text-white px-8 py-8 me-4 mb-2 shadow-sm d-inline-flex align-items-center gap-1"
                    >
                      {brand?.BrandName}
                      <i
                        className="ph ph-x ms-1 fw-bold text-white hover:text-primary cursor-pointer"
                        onClick={() => removeFilter('brand', brandId)}
                      />
                    </span>
                  );
                })}
                {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                  <span className="badge btn btn-main text-white px-8 py-8 me-4 mb-2 shadow-sm d-inline-flex align-items-center gap-1">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                    <i
                      className="ph ph-x ms-1 fw-bold text-white hover:text-primary cursor-pointer"
                      onClick={() => removeFilter('price')}
                    />
                  </span>
                )}
                {searchQuery && (
                  <span className="badge btn btn-main text-white px-8 py-8 me-4 mb-2 shadow-sm d-inline-flex align-items-center gap-1">
                    Search: {searchQuery}
                    <i
                      className="ph ph-x ms-1 fw-bold text-white hover:text-primary cursor-pointer"
                      onClick={() => removeFilter('search')}
                    />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Category */}
        <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
          <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
            Product Category
          </h6>
          <ul className="max-h-540 overflow-y-auto scroll-sm">
            {categoryApi?.categories?.slice(0, 10).map((category) => (
              <li className="mb-24" key={category.id}>
                <div className="form-check common-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <label
                    className="form-check-label cursor-pointer"
                    htmlFor={`category-${category.id}`}
                  >
                    {category.categoryName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Filter by Price */}
        <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
          <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
            Filter by Price
          </h6>
          <div className="custom--range">
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="example-thumb"
              trackClassName="example-track"
              value={priceRange}
              onChange={setPriceRange}
              ariaLabel={['Lower thumb', 'Upper thumb']}
              ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
              renderThumb={(props, state) => {
                const { key, ...restProps } = props;
                return (
                  <div {...restProps} key={state.index}>
                    {state.valueNow}
                  </div>
                );
              }}
              pearling
              minDistance={150}
              min={minPrice}
              max={maxPrice}
            />
            <div className="" style={{ minHeight: '30px' }}>
              {/* Price Range: ${priceRange[0]} - ${priceRange[1]} */}
              
            </div>
          </div>
        </div>

        {/* Filter by Brand */}
        <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
          <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
            Filter by Brand
          </h6>
          <ul className="max-h-540 overflow-y-auto scroll-sm">
            {brandData?.Brands?.map((brand) => (
              <li className="mb-24" key={brand.id}>
                <div className="form-check common-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                  />
                  <label
                    className="form-check-label cursor-pointer"
                    htmlFor={`brand-${brand.id}`}
                  >
                    {brand.BrandName}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Advertisement */}
        <div className="shop-sidebar__box rounded-8">
          <img src="assets/images/thumbs/advertise-img1.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
