import User from "../schema/userSchema.js";
// const User = require("../schema/userSchema.js");
// const UserGroup = require("../schema/usergroupsSchema.js");
import UserGroup from "../schema/usergroupsSchema.js";
import Role from "../schema/roleSchema.js";
// const Role = require("../schema/roleSchema.js")



//create admin user

export const createCustomUser = async (req, res) => {
  const { fullName, email, phonenumber, password,userGroup } = req.body;

  if (!fullName || !email || !password || !phonenumber) {
    return res.status(400).json({ error: "Please enter all the inputs" });
  }
  try {
    const usergrp = await UserGroup.findOne({name:userGroup});
    if(!usergrp){
      return res.status(400).json({error:"This user group is not existing"});
    }
    const preuser = await User.findOne({ email: email });
    if (preuser) {
      return res.status(400).json({ error: "This user already exists in our organization" });
    } else {
      const userregister = new User({ fullName, email, phonenumber, password,userGroup:userGroup });
      const storedata = await userregister.save();
      res.status(200).json(storedata);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid details", error });
  }
};

export const editUserData = async(req,res)=>{
  console.log(req.body);
  try
 { 
  const {fullName,phonenumber,password,userGroup,email} = req.body;
 
  const u = await User.findOneAndUpdate({email:email},req.body);
  console.log("dj")
  return res.status(200).json({message:"user details updated successfully"});
}
catch(error){
  console.log(error);
  return res.status(500).json({message:error.message});
}
}

export const deleteUser = async(req,res)=>{
  const {id} = req.body;
  try{
    const user = await User.findByIdAndDelete(id);
    return res.status(200);
  }
  catch(error){
    return res.status(400).json({error:"unable to find the user"});
  }
}

export const updateUserGroup = async(req,res)=>{
  const {email,usergrp} = req.body;
  try{ 
    const userp = UserGroup.findOne({name:usergrp});
    if(!userp){
      return res.status(400).json({error:"invalid usergrp"});
    }
    updates={}
    updates.userGroup = userp;
    const user=User.findOneAndUpdate({email:email},updates,{new: true});
    if(!user){
      return res.status(400).json({error:"invalid user"});
    }
    return res.status(200).json(user);
  }
  catch{
    return res.status(400).json({error:"invalid data"});
  }
}




// Create Role
export const createRole = async (req, res) => {    
  const { name, permissions } = req.body;
  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ error: "This role already exists in our database" });
    }
    const newRole = new Role({ name, permissions });
    const savedRole = await newRole.save();
    return res.status(201).json(savedRole);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating role', details: error.message });
  }
};

// Update Role
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(400).json({ error: 'Role not found' });
    }
    if(name){role.name=name;}
    // role.name = name || role.name;
    if(permissions){role.permissions = permissions;}
    role.permissions = permissions || role.permissions;

    const updatedRole = await role.save();
    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating role', details: error.message });
  }
};

// Create User Group
export const createUserGroups = async (req, res) => {
  const { name, roles, description } = req.body;
  try {
    const existingUserGroup = await UserGroup.findOne({ name:name });
    if (existingUserGroup) {
      return res.status(400).json({ error: "This user group already exists in our database" });
    }

    const roleIds = roles.map(roleId => roleId);
    const validRolesCount = await Role.countDocuments({ roleId: { $in: roleIds } });

    if (validRolesCount !== roleIds.length) {
      return res.status(400).json({ error: 'Invalid or non-existent role(s) referenced in user group.' });
    }

    const newUserGroup = new UserGroup({ name, roles, description });
    const savedUserGroup = await newUserGroup.save();
    return res.status(201).json(savedUserGroup);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating user group', details: error.message });
  }
};

// Update User Group
export const updateusergrp = async (req, res) => {
  const { id } = req.params;
  const { name, roles, description } = req.body;

  try {
    const userGroup = await UserGroup.findById(id);
    if (!userGroup) {
      return res.status(400).json({ error: 'User group not found' });
    }

    const roleIds = roles.map(roleId => roleId);
    const validRolesCount = await Role.countDocuments({ roleId: { $in: roleIds } });

    if (validRolesCount !== roleIds.length) {
      return res.status(400).json({ error: 'Invalid or non-existent role(s) referenced in user group.' });
    }

    userGroup.name = name || userGroup.name;
    userGroup.roles = roles || userGroup.roles;
    userGroup.description = description || userGroup.description;

    const updatedUserGroup = await userGroup.save();
    return res.status(200).json(updatedUserGroup);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating user group', details: error.message });
  }
};


export const getAllUsers = async (req,res)=>{
  try{
    const users = await User.find();
    if(!users) return res.status(400).json({message:"users not found"});
    return res.status(200).json(users);
  }
  catch(error){
    return res.status(500).json({"error":error.message})
  } 
};

export const getAllRoles = async(req,res)=>{
  try{
    const roles = await Role.find();
    return res.status(200).json(roles);
  }
  catch(error){
    return res.satus(500).json({"error":error.message});
  }
}
export const getAllUserGroups = async (req,res)=>{
  try{
    const usergroups = await UserGroup.find();
    return res.status(200).json(usergroups);
  }
  catch(error){
    return res.status(500).json({"error":error.message});
  }
}