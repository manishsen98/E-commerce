import {
  login,
  updateUser,
  deleteUser,
  logout,
  register,
} from "../controller/userAuthController.js";
// Input Validation for data that user send
import {
  validateLoginInput,
  validateRegisterInput,
  validateUpdateUserInput,
} from "../validation/userInputValidation.js";

import express from "express";
import apiLimiter from "../utils/rateLimiter.js";
import { authenticateUser } from "../middleware/auth.js";

const userAuthRouter = express.Router();

userAuthRouter.post("/register", apiLimiter, validateRegisterInput, register);
userAuthRouter.post("/login", apiLimiter, validateLoginInput, login);
userAuthRouter.get("/logout", logout);
userAuthRouter.delete("/delete", apiLimiter, authenticateUser, deleteUser);
userAuthRouter.put(
  "/updateUser",
  apiLimiter,
  validateUpdateUserInput,
  authenticateUser,
  updateUser
);
export default userAuthRouter;
