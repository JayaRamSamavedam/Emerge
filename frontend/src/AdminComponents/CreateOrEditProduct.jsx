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

  const [categories, setCategories] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  // Load product data into the form when editing
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
       
        category: product.category,
       
      });
    } else {
      // Reset form and state when no product is provided (Create mode)
      form.resetFields();
      
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
  

  useEffect(() => {
    fetchCategories();
  
  }, []);



  const handleSubmit = async (values) => {
    setSubmitting(true);
    const productData = {
      ...values,
      // Send selected sizes
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



      <Button type="primary" htmlType="submit" loading={submitting}>
        {submitting ? 'Submitting...' : product ? 'Update Product' : 'Create Product'}
      </Button>
    </Form>
  );
};

export default CreateOrEditProduct;
