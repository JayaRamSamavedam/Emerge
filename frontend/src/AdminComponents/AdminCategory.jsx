import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Modal } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Request } from '../helpers/axios_helper';
import axios from 'axios'; // Ensure axios is imported
import { useNavigate } from 'react-router-dom';

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

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [proImage, setProImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await Request("GET", "/prod/getAllCategories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async ({ file }) => {
    setLoading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProImage(url);
      message.success('Cover image uploaded successfully');
    } catch (error) {
      message.error('Error uploading cover image');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue({
      name: category.name,
      discount: category.discount,
    });
    setProImage(category.proImage);
    setIsModalVisible(true);
  };

  const handleDelete = async (category) => {
    try {
      const res = await Request("DELETE", "/admin/prod/deleteCategory", { category: category.name });
      if (res.status === 200) {
        message.success('Category deleted successfully');
        setCategories(categories.filter(cat => cat.name !== category.name));
      } else {
        message.error(res.data.error || 'Error deleting category');
      }
    } catch (error) {
      message.error('Error deleting category');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (currentCategory) {
        // Edit existing category
        await Request("PUT", "/admin/prod/editcat", {
          category: currentCategory.name,
          newcategory: values.name,
          proImage,
          discount: values.discount,
        });
        message.success('Category edited successfully');
      } else {
        // Create new category
        await Request("POST", "/admin/prod/cat", {
          name: values.name,
          proImage,
          discount: values.discount,
        });
        message.success('Category created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setProImage('');
      fetchCategories();
    } catch (error) {
      message.error('Error submitting category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Category
        </Button>
      </div>

      <div className="flex flex-row flex-wrap -mx-2">
        {categories.map((cat) => (
          <div key={cat.name} className="w-full sm:w-1/2 md:w-1/3 mb-4 px-2">
            <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
              <a className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
                <img className="object-cover" src={cat.proImage} alt="product image" />
                <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                  {cat.discount}% OFF
                </span>
              </a>
              <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl tracking-tight text-slate-900">{cat.name}</h5>
                <Button type="primary" onClick={() => handleEdit(cat)} className="mr-2">
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(cat)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={currentCategory ? 'Edit Category' : 'Create Category'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input the discount!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload customRequest={handleImageUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />} loading={loading}>
                Upload Cover Image
              </Button>
            </Upload>
            {proImage && <img src={proImage} alt="Cover" className="mt-4 max-w-full" />}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {currentCategory ? 'Edit' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategory;
