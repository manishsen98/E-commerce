import { body, query } from "express-validator";
import { withValidationErrors } from "./allErrorMessages.js";
import { BadRequestError } from "../errors/customErrors.js";
import prisma from "../db/db.config.js";

export const validateRegisterInput = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name can not be Empty")
    .isLength({ max: 50 })
    .withMessage("Name is too long"),
  body("lastName")
    .notEmpty()
    .withMessage("lastName can not be Empty")
    .isLength({ max: 50 })
    .withMessage("lastName is too long"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("contact number is required")
    .isLength({ max: 10, min: 10 })
    .withMessage("Please enter your correct 10 digit number"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const userAlreadyExists = await prisma.user.findUnique({
        where: { email },
      });
      if (userAlreadyExists) {
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
      const userAlreadyExists = await prisma.user.findUnique({
        where: { email },
      });
      if (!userAlreadyExists) {
        throw new BadRequestError("email not found , please Register");
      }
    }),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").isLength({ max: 50 }).withMessage("Name is too long"),
  body("email")
    .notEmpty()
    .withMessage("Please enter your current or new email")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format"),
  body("lasName").isLength({ max: 50 }).withMessage("lastName is too long"),
  body("phoneNumber")
    .isLength({ max: 10, min: 10 })
    .withMessage("Please Enter your 10 digit Number "),
]);

export const validateDeleteUserQuery = withValidationErrors([
  query("email")
    .notEmpty()
    .withMessage("email is required")
    .isLength({ max: 100 })
    .withMessage("Email is too long")
    .isEmail()
    .withMessage("invalid email format"),
  query("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ max: 200 })
    .withMessage("password is too long")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
]);

//PASSWORD UPADATE FEATURE NOT ADDED FOR FUTURE VALIDATIONS
// body("password")
// .notEmpty()
// .withMessage("password is required")
// .isLength({max:200}).withMessage("password is too long")
// .isLength({ min: 6 })
// .withMessage("password must be at least 6 characters long"),
