import {
  login,
  updateAdmin,
  deleteAdmin,
  logout,
  register,
} from "../controller/adminAuthController.js";
// Input Validation for data that admin send
import {
  validateLoginInput,
  validateRegisterInput,
  validateUpdateAdminInput,
} from "../validation/adminInputValidation.js";

import express from "express";
import apiLimiter from "../utils/rateLimiter.js";
import { authenticateUser, authorizePermissions } from "../middleware/auth.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/register", apiLimiter, validateRegisterInput, register);
adminAuthRouter.post("/login", apiLimiter, validateLoginInput, login);
adminAuthRouter.get("/logout", logout);
adminAuthRouter.get("/get", authorizePermissions);
adminAuthRouter.delete("/delete", apiLimiter, authenticateUser, deleteAdmin);
adminAuthRouter.put(
  "/updateAdmin",
  apiLimiter,
  validateUpdateAdminInput,
  authenticateUser,
  updateAdmin
);
export default adminAuthRouter;
