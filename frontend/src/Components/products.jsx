import React,{useState,useEffect, useRef} from "react";
import { motion ,AnimatePresence } from "framer-motion";

import SearchModal from "./ui/searchnew";
import { Pagination } from 'antd'; 
import queryString from 'query-string';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RequestParams,Request } from "../helpers/axios_helper";
import Search from "antd/es/transfer/search";
import { faL } from "@fortawesome/free-solid-svg-icons";
export default function Products() {
    const navigate = useNavigate(); // Use useNavigate for navigation
    const location = useLocation(); // Get current location
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
     const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
     const [categories, setCategories] = useState([]);
     const [products, setProducts] = useState([]);
     const [loading, setLoading] = useState(false);
     const [totalProducts, setTotalProducts] = useState(0);
     const [currentPage, setCurrentPage] = useState(1);
     const [pageSize] = useState(6);
     const [colors,setColors] = useState([]);
     const [sizes,setSizes] = useState(['S','M','L','XL','XXL']);
     const [searchTerm, setSearchTerm] = useState('');
     const [filters, setFilters] = useState({
        category: [],
        colors: [],
        sizes: [],
        sortBy: '',
        order: 'asc',
      });
    
    //  const [search,setsearchterm] = useState('');
   

    useEffect(() => {
        const parsedQuery = queryString.parse(location.search);
        applyQueryParamsToFilters(parsedQuery);
    }, [location.search]);
    
    const applyQueryParamsToFilters = (params) => {
        const updatedFilters = { ...filters };
    
        if (params.search && params.search.trim()) {
            console.log(searchTerm);  // Before setting
            console.log(params.search.trim());  // Parsed search term
    
            setSearchTerm(params.search.trim());  // Set searchTerm separately
        }
        
        if (params.category && params.category.trim()) {
            updatedFilters.category = [params.category.trim()];
        }
    
        setFilters(updatedFilters);
    };
    const firstRenderRef = useRef(true);

    useEffect(() => {
        // This effect runs after searchTerm or filters are updated
         if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
    }

    // This effect runs after searchTerm or filters are updated
    if (searchTerm || filters.category.length) {
        fetchProducts(1, filters);
    }
    }, [searchTerm,filters]);
    
    
 const fetchCategories = async () => {
    try {
      const response = await Request("GET", "/prod/getAllCategories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await Request("GET", "/colors");
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };


  const fetchProducts = async (page = 1, customFilters = filters) => {
    const response = await RequestParams("GET", "/prod/filter", {
        ...customFilters,
        search: searchTerm,
        page,
        limit: pageSize,
    });
    setProducts(response.data.products || []);
    setTotalProducts(response.data.total);
};

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchColors();
  }, []);
   // Handle pagination using Antd Pagination component
   const handlePagination = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  const handleFilterChange = (name, value) => {
    
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    fetchProducts(1);
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      colors: [],
      sizes: [],
      sortBy: '',
      order: 'asc',
    });
    // setCurrentPage(1);
    fetchProducts(1);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  
  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  

  return (
    <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-24 bg-[#F2EFE4]">

    <section class=" bg-[#F2EFE4] antialiased dark:bg-black md:py-12">
  <div class="mx-auto max-w-screen-xl px-2 2xl:px-0">
    <div class="">
    <motion.section
        className=" bg-white dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6 lg:max-w-7xl lg:px-8 sm:justify-center sm:text-center justify-center">
          <motion.div class="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8 sm:text-center" variants={fadeIn}>
          <div className="">
  <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-left sm:text-center">
    Shop
  </h2>
</div>

    
      <div class="flex items-center space-x-4 ">
        
        <button onClick={toggleFilterModal}  type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
          <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
          </svg>
          Filters
          <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>
        <div className="relative inline-block text-left">
      {/* Sort Button */}
      <button
        id="sortDropdownButton1"
        onClick={toggleSortDropdown}
        type="button"
        className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
      >
        <svg
          className="-ms-0.5 me-2 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"
          />
        </svg>
        Sort
        <svg
          className={`-me-0.5 ms-2 h-4 w-4 transition-transform ${
            isSortDropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {/* Sort Dropdown */}
      {isSortDropdownOpen && (
  <div
    id="dropdownSort1"
    className="absolute right-0 mt-2 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg dark:bg-gray-700 z-50"
  >
    <ul className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
      <li>
        <a
          href="#"
          onClick={() => handleFilterChange('sortBy', 'popularity')}
          className={`group inline-flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ${
            filters.sortBy === 'popularity' ? 'font-bold text-gray-900 dark:text-white' : ''
          }`}
        >
          The most popular
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => handleFilterChange('sortBy', 'newest')}
          className={`group inline-flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ${
            filters.sortBy === 'newest' ? 'font-bold text-gray-900 dark:text-white' : ''
          }`}
        >
          Newest
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => handleFilterChange('sortBy', 'priceAsc')}
          className={`group inline-flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ${
            filters.sortBy === 'priceAsc' ? 'font-bold text-gray-900 dark:text-white' : ''
          }`}
        >
          Increasing price
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => handleFilterChange('sortBy', 'priceDesc')}
          className={`group inline-flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ${
            filters.sortBy === 'priceDesc' ? 'font-bold text-gray-900 dark:text-white' : ''
          }`}
        >
          Decreasing price
        </a>
      </li>
      <li>
        <a
          href="#"
          onClick={() => handleFilterChange('sortBy', 'discount')}
          className={`group inline-flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white ${
            filters.sortBy === 'discount' ? 'font-bold text-gray-900 dark:text-white' : ''
          }`}
        >
          Discount %
        </a>
      </li>
    </ul>
  </div>
)}

    </div>
      </div>
      
    </motion.div>
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
  <AnimatePresence>
    {products.length > 0 ? (
      products.map((product) => (
        <motion.div
          key={product._id}
          className="group relative"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
        >
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-white dark:bg-gray-700 lg:h-80">
            <img
              src={product.coverImage}
              alt={product.coverImage}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700 dark:text-gray-300">
                <Link to={`/productInfo/${product.productId}`}>
                  <span aria-hidden="true" className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.price}
            </p>
          </div>
        </motion.div>
      ))
    ) : (
      <p>No products available.</p>
    )}
  </AnimatePresence>
</div>

        </div>
      </motion.section>
                                            
                                            
    </div>
    {/* <div class="w-full justify-center  items-center text-center p-5">
    <Pagination className="text-center"
          current={currentPage}
          pageSize={pageSize}
          total={totalProducts}
          onChange={handlePagination}
        />
      {/* <button type="button" class=" rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Show more</button> */}
    {/* </div> */} 
    <div className="w-full flex justify-center items-center text-center p-5">
  <Pagination
    className="pagination-custom"
    current={currentPage}
    pageSize={pageSize}
    total={totalProducts}
    onChange={handlePagination}
    itemRender={(page, type, originalElement) => {
      if (type === 'prev') {
        return <a className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary-700">Previous</a>;
      }
      if (type === 'next') {
        return <a className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 hover:text-primary-700">Next</a>;
      }
      return originalElement;
    }}
  />
</div>

  </div>
  {/* <!-- Filter modal --> */}
  {isFilterModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4"
    onClick={toggleFilterModal} // To close modal when clicking outside
  >
    <form
      action="#"
      method="get"
      id="filterModal"
      tabIndex="-1"
      className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:max-w-md lg:max-w-xl"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
    >
      {/* Modal Header */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Filters
        </h3>
        <button
          type="button"
          onClick={toggleFilterModal}
          className="ml-auto inline-flex items-center rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M18 18L6 6"
            />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="py-4">
        {/* Sizes */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Sizes
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {sizes.map((size) => (
              <label className="inline-flex items-center" key={size}>
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  checked={filters.sizes.includes(size)}
                  onChange={(e) =>
                    handleFilterChange(
                      'sizes',
                      e.target.checked
                        ? [...filters.sizes, size]
                        : filters.sizes.filter((s) => s !== size)
                    )
                  }
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Colors
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <label className="inline-flex items-center" key={color._id}>
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  checked={filters.colors.includes(color.colorname)}
                  onChange={(e) =>
                    handleFilterChange(
                      'colors',
                      e.target.checked
                        ? [...filters.colors, color.colorname]
                        : filters.colors.filter((c) => c !== color.colorname)
                    )
                  }
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {color.colorname} {/* Render the color name */}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-black dark:text-white">
            Categories
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label className="inline-flex items-center" key={category._id}>
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  checked={filters.category.includes(category.name)}
                  onChange={(e) =>
                    handleFilterChange(
                      'category',
                      e.target.checked
                        ? [...filters.category, category.name]
                        : filters.category.filter((cat) => cat !== category.name)
                    )
                  }
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {category.name} {/* Render the category name */}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-3">
        <button
          type="submit"
          className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-black hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
          onClick={() => fetchProducts(1)}
        >
          Apply Filters
        </button>
        <button
          type="reset"
          className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
    </form>
  </div>
)}


</section>

</div>
  );
}
