import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Popconfirm, Select } from 'antd';
import { Request, RequestParams } from '../helpers/axios_helper';

const { Option } = Select;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // Track create mode
  const [form] = Form.useForm();

  // Fetch roles, userGroups, and users from the backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rolesData = await RequestParams('GET', '/admin/roles');
      const userGroupsData = await RequestParams('GET', '/admin/usergroups');
      const usersData = await RequestParams('GET', '/admin/users');
      setRoles(rolesData.data);
      setUserGroups(userGroupsData.data);
      setUsers(usersData.data);
    } catch (error) {
      message.error('Error fetching data');
      console.error(error);
    }
  };

  // Handle Delete with Popconfirm
  const handleDelete = async (type, id) => {
    try {
      if (type === 'role') {
        await Request('POST', '/admin/role/delete', { id });
      } else if (type === 'userGroup') {
        await Request('POST', '/admin/usergroup/delete', { id });
      } else if (type === 'user') {
        await Request('POST', '/admin/user/delete', { id });
      }
      fetchData();
      message.success('Deleted successfully');
    } catch (error) {
      message.error('Error deleting the item');
      console.error(error);
    }
  };

  // Handle Edit
  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsCreating(false);
    form.setFieldsValue(item); // Set form values to current item
  };

  // Handle Create
  const handleCreate = () => {
    setSelectedItem(null);
    setIsEditing(true);
    setIsCreating(true);
    form.resetFields(); // Reset the form for new item creation
  };

  // Handle Save (Create/Edit)
  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      let url = '';
      const data = { ...values };

      if (activeTab === 'roles') {
        url = isCreating ? `/admin/role/create` : `/admin/role/edit`;
      } else if (activeTab === 'userGroups') {
        url = isCreating ? `/admin/usergroup/create` : `/admin/usergroup/edit`;
        // Convert selected role names into role IDs
        data.roles = roles.filter((role) => values.roles.includes(role.name)).map((role) => role.roleId);
      } else if (activeTab === 'users') {
        url = isCreating ? `/admin/user/create` : `/admin/user/edit`;
        // Assign selected user group name directly
        data.userGroup = userGroups.find((group) => group.name === values.userGroup)?.name;
      }

      await Request('POST', url, data);
      setIsEditing(false);
      fetchData();
      message.success(isCreating ? 'Created successfully' : 'Updated successfully');
    } catch (error) {
      message.error(isCreating ? 'Error creating the item' : 'Error updating the item');
      console.error(error);
    }
  };

  // Form Fields for Role
  const roleFields = () => (
    <>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the role name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Permissions" name="permissions" rules={[{ required: true, message: 'Please enter permissions' }]}>
        <Input.TextArea />
      </Form.Item>
    </>
  );

  // Form Fields for User Group with Role selection
  const userGroupFields = () => (
    <>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the group name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Roles" name="roles" rules={[{ required: true, message: 'Please select roles' }]}>
        <Select mode="multiple" placeholder="Select Roles">
          {roles.map((role) => (
            <Option key={role.roleId} value={role.name}>
              {role.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
    </>
  );

  // Form Fields for User with User Group selection
  const userFields = () => (
    <>
      <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter the full name' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter the email' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Phone Number" name="phonenumber" rules={[{ required: true, message: 'Please enter the phone number' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: isCreating, message: 'Please enter a password' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="User Group" name="userGroup" rules={[{ required: true, message: 'Please select a user group' }]}>
        <Select placeholder="Select User Group">
          {userGroups.map((group) => (
            <Option key={group._id} value={group.name}>
              {group.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );

  // Render Roles List
  const renderRoles = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Roles</h2>
      <Button type="primary" onClick={handleCreate} className="mb-4">Create Role</Button>
      <ul className="space-y-2">
        {roles.map((role) => (
          <li key={role._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
            <span>{role.name}</span>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(role)} type="primary">Edit</Button>
              <Popconfirm
                title="Are you sure to delete this role?"
                onConfirm={() => handleDelete('role', role._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render User Groups List
  const renderUserGroups = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Groups</h2>
      <Button type="primary" onClick={handleCreate} className="mb-4">Create User Group</Button>
      <ul className="space-y-2">
        {userGroups.map((group) => (
          <li key={group._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
            <span>{group.name}</span>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(group)} type="primary">Edit</Button>
              <Popconfirm
                title="Are you sure to delete this user group?"
                onConfirm={() => handleDelete('userGroup', group._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render Users List
  const renderUsers = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <Button type="primary" onClick={handleCreate} className="mb-4">Create User</Button>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                alt={user.fullName}
                className="w-10 h-10 rounded-full"
              />
              <span>{user.fullName}</span>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(user)} type="primary">Edit</Button>
              <Popconfirm
                title="Are you sure to delete this user?"
                onConfirm={() => handleDelete('user', user._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Handle Tab Switch
  const renderContent = () => {
    switch (activeTab) {
      case 'roles':
        return renderRoles();
      case 'userGroups':
        return renderUserGroups();
      case 'users':
        return renderUsers();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2">
          <Button onClick={() => setActiveTab('roles')}>Roles</Button>
        </li>
        <li className="me-2">
          <Button onClick={() => setActiveTab('userGroups')}>User Groups</Button>
        </li>
        <li className="me-2">
          <Button onClick={() => setActiveTab('users')}>Users</Button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="mt-4">
        {renderContent()}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        title={isCreating ? "Create Item" : "Edit Item"}
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          {activeTab === 'roles' && roleFields()}
          {activeTab === 'userGroups' && userGroupFields()}
          {activeTab === 'users' && userFields()}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
