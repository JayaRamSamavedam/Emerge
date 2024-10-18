import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, message, Tag } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Request } from '../helpers/axios_helper';

const { Option } = Select;

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'zmtmbe7m'); // Replace with your Cloudinary upload preset
  formData.append('cloud_name', 'dyszone43'); // Replace with your Cloudinary cloud name

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dyszone43/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.response || error.message);
    throw error;
  }
};

const CreateOrEditProduct = ({ product, onSubmit }) => {
  const [form] = Form.useForm();
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState([]);
  const [colornames, setColornames] = useState([]); // Holds selected color names
  const [colors, setColors] = useState([]); // Available colors from backend
  const [sizes, setSizes] = useState([]); // Holds selected sizes
  const [categories, setCategories] = useState([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load product data into the form when editing
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        discount: product.discount,
        colornames: product.colors.map((c) => c.colorname), // Pre-fill colors
        sizes: product.sizes, // Pre-fill sizes
      });

      setCoverImage(product.coverImage);
      setImages(product.images || []);
      setColornames(product.colors.map((color) => color.colorname));
      setSizes(product.sizes || []);
    } else {
      // Reset form and state when no product is provided (Create mode)
      form.resetFields();
      setCoverImage('');
      setImages([]);
      setColornames([]);
      setSizes([]);
    }
  }, [product, form]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await Request('GET', '/prod/getAllCategories');
      setCategories(response.data.categories);
    } catch (error) {
      message.error('Error fetching categories');
    }
  };

  // Fetch colors from backend
  const fetchColors = async () => {
    try {
      const response = await Request('GET', '/colors');
      setColors(response.data); // Assume response.data is an array of { colorname, colorcode }
    } catch (error) {
      message.error('Error fetching colors');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchColors();
  }, []);

  const handleCoverImageUpload = async ({ file }) => {
    setUploadingCover(true);
    try {
      const url = await uploadToCloudinary(file);
      setCoverImage(url);
      message.success('Cover image uploaded successfully');
    } catch (error) {
      message.error('Error uploading cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleImagesUpload = async ({ file }) => {
    setUploadingImages(true);
    try {
      const url = await uploadToCloudinary(file);
      setImages((prev) => [...prev, url]);
      message.success('Image uploaded successfully');
    } catch (error) {
      message.error('Error uploading image');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const productData = {
      ...values,
      coverImage,
      images,
      colors: colornames.map(colorname => {
        const color = colors.find(c => c.colorname === colorname);
        return {
          colorname: color.colorname,
          colorcode: color.colorcode
        };
      }),
      sizes, // Send selected sizes
    };

    try {
      await onSubmit(productData);
      message.success('Product submitted successfully');
    } catch (error) {
      message.error('Error submitting product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'Create Product'}</h2>

      <Form.Item
        name="name"
        label="Product Name"
        rules={[{ required: true, message: 'Please input the product name!' }]}
      >
        <Input />
      </Form.Item>

      {/* Cover Image */}
      <Form.Item label="Cover Image">
        <Upload customRequest={handleCoverImageUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} loading={uploadingCover}>
            {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
          </Button>
        </Upload>
        {coverImage && (
          <div style={{ position: 'relative', marginTop: '10px' }}>
            <img src={coverImage} alt="Cover" style={{ width: '100px' }} />
            <Button
              icon={<CloseOutlined />}
              type="text"
              danger
              onClick={() => setCoverImage('')}
              style={{ position: 'absolute', top: '-10px', right: '-10px' }}
            />
          </div>
        )}
      </Form.Item>

      {/* Multiple Images */}
      <Form.Item label="Images">
        <Upload customRequest={handleImagesUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} loading={uploadingImages}>
            {uploadingImages ? 'Uploading...' : 'Upload Images'}
          </Button>
        </Upload>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
          {images.map((url, index) => (
            <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
              <img src={url} alt={`Product ${index}`} style={{ width: '100px' }} />
              <Button
                icon={<CloseOutlined />}
                type="text"
                danger
                onClick={() => setImages(images.filter((img) => img !== url))}
                style={{ position: 'absolute', top: '-10px', right: '-10px' }}
              />
            </div>
          ))}
        </div>
      </Form.Item>

      {/* Categories */}
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select placeholder="Select a category">
          {categories.map((category) => (
            <Option key={category._id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Colors */}
      <Form.Item
        name="colornames"
        label="Colors"
        rules={[{ required: true, message: 'Please select colors!' }]}
      >
        <Select
          mode="multiple"
          placeholder="Select colors"
          value={colornames} // Pre-fill selected color names
          onChange={(value) => setColornames(value)} // Update selected colors
        >
          {colors.map((color) => (
            <Option key={color.colorname} value={color.colorname}>
              <Tag color={color.colorcode}>{color.colorname}</Tag>
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Sizes */}
      <Form.Item
        name="sizes"
        label="Sizes"
        rules={[{ required: true, message: 'Please select sizes!' }]}
      >
        <Select
          mode="multiple"
          placeholder="Select sizes"
          value={sizes} // Pre-fill selected sizes
          onChange={(value) => setSizes(value)} // Update selected sizes
        >
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please input the price!' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item name="discount" label="Discount">
        <Input type="number" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={submitting}>
        {submitting ? 'Submitting...' : product ? 'Update Product' : 'Create Product'}
      </Button>
    </Form>
  );
};

export default CreateOrEditProduct;
