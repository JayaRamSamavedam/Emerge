import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Slider, Row, Col, Form, Pagination, Modal, Carousel, Popconfirm, Tag, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { RequestParams, Request } from '../helpers/axios_helper';
import CreateOrEditProduct from './CreateOrEditProduct';

const { Option } = Select;

const Filter = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [showFilters, setShowFilters] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('view');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    colors: [],
    sizes: [],
    minDiscount: 0,
    maxDiscount: 100,
    sortBy: '',
    order: 'asc',
  });

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Request("GET", "/prod/getAllCategories");
        setCategories(response.data.categories || []);
      } catch (error) {
        message.error('Error fetching categories');
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchProducts = async (page = 1, pageSize = 6, customFilters = filters) => {
    setLoading(true);
    const response = await RequestParams("GET", "/prod/filter", {
      ...customFilters,
      page,
      limit: pageSize,
    });
    setProducts(response.data.products || []);
    console.log(response.data.products)
    setTotalProducts(response.data.total);
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    console.log(productId)
    try {
      await Request("DELETE", `/admin/prod/delete/${productId}`);
      message.success('Product deleted successfully');
      fetchProducts(currentPage);
    } catch (error) {
      message.error('Error deleting product');
    }
  };

  const updateQueryParams = (updatedFilters) => {
    const queryParams = {
      search: updatedFilters.search || undefined,
      category: updatedFilters.category || undefined,
      minPrice: updatedFilters.minPrice !== 0 ? updatedFilters.minPrice : undefined,
      maxPrice: updatedFilters.maxPrice !== 10000 ? updatedFilters.maxPrice : undefined,
      colors: updatedFilters.colors.length ? updatedFilters.colors.join(',') : undefined,
      sizes: updatedFilters.sizes.length ? updatedFilters.sizes.join(',') : undefined,
      sortBy: updatedFilters.sortBy || undefined,
      order: updatedFilters.order || undefined,
    };
    const queryStringified = queryString.stringify(queryParams, { skipNull: true, skipEmptyString: true });
    navigate(`?${queryStringified}`);
  };

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters);
  };

  const handlePriceChange = (value) => {
    const updatedFilters = { ...filters, minPrice: value[0], maxPrice: value[1] };
    setFilters(updatedFilters);
    updateQueryParams(updatedFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page, pageSize, filters);
  };

  const openModal = (mode, product) => {
    setViewMode(mode);
    setCurrentProduct(product || null);
    setIsModalVisible(true);
  };

  const renderModalContent = () => {
    if (viewMode === 'view' && currentProduct) {
      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{currentProduct.name}</h3>
          <p className="mb-1"><strong>Category:</strong> {currentProduct.category}</p>
          <p className="mb-1"><strong>Description:</strong> {currentProduct.description}</p>
          <p className="mb-1"><strong>Price:</strong> ₹{currentProduct.price}</p>
          <p className="mb-1"><strong>Discounted Price:</strong> ₹{currentProduct.discountedPrice}</p>
          <p className="mb-1"><strong>Colors:</strong> {currentProduct.colors.map(c => (
            <Tag key={c.name} color={c.name}>
              {c.name}
            </Tag>
          ))}</p>
          <p className="mb-1"><strong>Sizes:</strong> {currentProduct.sizes.join(', ')}</p>
          <p className="mb-1"><strong>Rating:</strong> {currentProduct.rating}</p>
          <p className="mb-1"><strong>Views:</strong> {currentProduct.views}</p>
          <p className="mb-1"><strong>Purchases:</strong> {currentProduct.purchases}</p>

          {/* Carousel for product images */}
          {currentProduct.images && currentProduct.images.length > 0 && (
            <Carousel autoplay className="rounded-lg">
              {currentProduct.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      );
    } else if (viewMode === 'edit' || viewMode === 'create') {
      return (
        <CreateOrEditProduct
          product={currentProduct} 
          onSubmit={async (productData) => {
            try {
              if (viewMode === 'create') {
                await Request("POST", "/admin/prod/create", productData);
                message.success('Product created successfully');
              } else if (viewMode === 'edit') {
                await Request("PUT", `/admin/prod/edit/${currentProduct.id}`, productData);
                message.success('Product updated successfully');
              }
              fetchProducts(currentPage);
              setIsModalVisible(false);
            } catch (error) {
              message.error('Error saving product');
            }
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Product List</h2>
        <div className="flex gap-2">
          <Button type="primary" onClick={() => openModal('create', null)}>
            Create Product
          </Button>
          <Button type="primary" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Close Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 mb-6 shadow-md rounded-md">
          <Form layout="vertical" form={form}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Search by name" name="search">
                  <Input
                    placeholder="Search by name"
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Select Category" name="category">
                  <Select
                    placeholder="Select Category"
                    onChange={(value) => handleFilterChange('category', value)}
                    style={{ width: '100%' }}
                    className="rounded-md"
                  >
                    {categories.map((category) => (
                      <Option key={category._id} value={category.name}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Price Range" name="priceRange">
                  <Slider
                    range
                    value={[filters.minPrice, filters.maxPrice]}
                    max={10000}
                    onChange={handlePriceChange}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Form.Item label="Discount Range" name="discountRange">
                  <Slider
                    range
                    value={[filters.minDiscount, filters.maxDiscount]}
                    max={100}
                    onChange={(value) => handleFilterChange('minDiscount', value)}
                    className="rounded-md"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <Card
            key={product._id}
            hoverable
            cover={<img alt={product.name} src={product.thumbnail_url} className="h-48 w-full object-cover rounded-md" />}
            className="shadow-md rounded-md"
          >
            <Card.Meta title={product.name} description={`Price: ₹${product.price}`} />
            <div className="mt-2">
              <Button onClick={() => openModal('view', product)} className="mr-2">View</Button>
              <Button onClick={() => openModal('edit', product)} className="mr-2">Edit</Button>
              <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(product.productId)}>
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-6">
        <Pagination
          current={currentPage}
          total={totalProducts}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>

      <Modal
        title={viewMode === 'view' ? 'View Product' : 'Edit Product'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Filter;
