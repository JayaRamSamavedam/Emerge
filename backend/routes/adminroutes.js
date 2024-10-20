import express from "express";
import * as admin from '../controllers/adminController.js';
// import verifyAdminCredentials from "../middlewares/verifyAdmin.js";
import checkRoleAccess from "../middlewares/checkroleaccess.js";

import verifyAuthToken from '../middlewares/verifyAuthToken.js';

// import { verifyToken } from "../controllers/userController.js";

const router = express.Router();

router.get('/admin/logs',verifyAuthToken,checkRoleAccess, admin.getAllLogs);

// admin create custome user
router.post("/admin/user/create",admin.createCustomUser);

// admin delete any user
router.post("/admin/user/delete",admin.deleteUser);

// admin create role
router.post("/admin/role/create",admin.createRole);
router.post("/admin/user/edit",admin.editUserData)
// admin create usergrp
router.post("/admin/usergroup/create",admin.createUserGroups);

// admin edit usergrp
router.post("/admin/usergroup/edit",admin.updateUserGroup);

// admin edit role
router.post("/admin/role/edit",admin.updateRole);

router.get("/admin/users",admin.getAllUsers);
router.get("/admin/roles",admin.getAllRoles);
router.get("/admin/usergroups",admin.getAllUserGroups);

export default router;