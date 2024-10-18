import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, ColorPicker } from 'antd';
import { Request } from '../helpers/axios_helper'; // Import your custom axios helper

const ColorManagement = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [colorCode, setColorCode] = useState('#ffffff'); // Default color
  const [form] = Form.useForm();

  // Fetch all colors on component mount
  const fetchColors = async () => {
    setLoading(true);
    try {
      const response = await Request('get', '/colors');
      setColors(response.data);
    } catch (error) {
      message.error('Error fetching colors');
    } finally {
      setLoading(false);
    }
  };

  // Show Modal for create or edit
  const showModal = (color = null) => {
    setCurrentColor(color);
    setIsEditMode(!!color);
    setColorCode(color ? color.colorcode : '#ffffff'); // Set color code
    form.setFieldsValue({
      colorname: color ? color.colorname : '',
    });
    setIsModalVisible(true);
  };

  // Handle Modal Ok (Create or Edit)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode) {
        // Edit color
        await Request('PUT', '/colors', { id: currentColor._id, ...values, colorcode: colorCode });
        message.success('Color updated successfully');
      } else {
        // Create color
        await Request('post', '/colors', { ...values, colorcode: colorCode });
        message.success('Color created successfully');
      }
      setIsModalVisible(false);
      fetchColors(); // Refresh color list
    } catch (error) {
      message.error('Error saving color');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await Request('delete', '/colors', { id });
      message.success('Color deleted successfully');
      fetchColors();
    } catch (error) {
      message.error('Error deleting color');
    }
  };

  // Handle Cancel in Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle Color Code Change from Ant Design Color Picker
  const handleColorChange = (color) => {
    setColorCode(color.toHexString());
  };

  useEffect(() => {
    fetchColors();
  }, []);

  // Table Columns Definition
  const columns = [
    {
      title: 'Color Name',
      dataIndex: 'colorname',
      key: 'colorname',
    },
    {
      title: 'Color Code',
      dataIndex: 'colorcode',
      key: 'colorcode',
      render: (colorcode) => (
        <div style={{ backgroundColor: colorcode, width: '100px', height: '30px' }}></div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this color?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: 16 }}>
        Add Color
      </Button>
      <Table columns={columns} dataSource={colors} rowKey="_id" loading={loading} />

      <Modal
        title={isEditMode ? "Edit Color" : "Create Color"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Color Name"
            name="colorname"
            rules={[{ required: true, message: 'Please enter a color name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Color Code">
            <ColorPicker value={colorCode} onChange={handleColorChange} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ColorManagement;
