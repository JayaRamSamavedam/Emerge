import React, { useState, useEffect } from 'react';
import { Request } from '../helpers/axios_helper';
import { Input, Button, Form, Spin, message, Avatar, Divider } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import stringToColor from 'string-to-color'; // Helper to create a color from string

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await Request('GET', '/user/getuser');
      const user = response.data.user;
      setUserData(user);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching user data');
      setLoading(false);
    }
  };

  const handleEditUserData = async (values) => {
    try {
      await Request('POST', '/user/edituser', values);
      message.success('User details updated');
    } catch (error) {
      message.error('Error updating user details');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await Request('POST', '/user/changepassword', {...values,email:userData.email});
      message.success('Password changed successfully');
      setShowPasswordFields(false); // Hide password fields on success
    } catch (error) {
      message.error('Error changing password');
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const renderAvatar = () => {
    if (userData) {
      const initials = userData.fullName
        ? userData.fullName.split(' ').map(name => name[0]).join('').toUpperCase()
        : 'U';
      return (
        <Avatar
          size={80}
          style={{
            backgroundColor: stringToColor(userData.fullName),
            fontSize: '2rem',
            color: '#fff'
          }}
        >
          {initials}
        </Avatar>
      );
    }
    return <Avatar size={80} icon={<UserOutlined />} />;
  };

  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {loading ? (
        <Spin size="large" className="flex justify-center" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-6 shadow rounded">
            <div className="flex items-center mb-4 space-x-4">
              {renderAvatar()}
              <h2 className="text-lg font-semibold">{userData?.fullName || 'User'}</h2>
            </div>
            <Divider />
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <Form onFinish={handleEditUserData} initialValues={userData} layout="vertical">
              <Form.Item name="fullName" label="Full Name">
                <Input />
              </Form.Item>
              <Form.Item name="phonenumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">Update User Details</Button>
            </Form>
            <Divider />
            <Button type="default" onClick={togglePasswordFields} className="w-full mt-4">
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </Button>
            {showPasswordFields && (
              <Form onFinish={handleChangePassword} className="mt-4" layout="vertical">
                <Form.Item name="oldPassword" label="Old Password" rules={[{ required: true }]}>
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">Submit</Button>
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
