import { body } from "express-validator";
import { withValidationErrors } from "./allErrorMessages.js";
import { BadRequestError } from "../errors/customErrors.js";
import prisma from "../db/db.config.js";

export const validateRegisterInput = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name can not be Empty")
    .isLength({ max: 50 })
    .withMessage("Name is too long"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const adminAlreadyExists = await prisma.admin.findMany({
        where: { email },
      });
      if (adminAlreadyExists.length > 0) {
        throw new BadRequestError("email already in use , please login");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ max: 200 })
    .withMessage("password is too long")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  body("accessKey").notEmpty().withMessage("accessKey is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const adminAlreadyExists = await prisma.admin.findUnique({
        where: { email },
      });
      if (!adminAlreadyExists) {
        throw new BadRequestError("email not found , please Register");
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateAdminInput = withValidationErrors([
  body("name").isLength({ max: 50 }).withMessage("Name is too long"),
  body("email")
    .notEmpty()
    .withMessage("Please enter your current or new email")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format"),
]);

//PASSWORD UPADATE FEATURE NOT ADDED FOR FUTURE VALIDATIONS
// body("password")
// .notEmpty()
// .withMessage("password is required")
// .isLength({max:200}).withMessage("password is too long")
// .isLength({ min: 6 })
// .withMessage("password must be at least 6 characters long"),
