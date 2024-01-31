import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  InternalServerError,
} from "../errors/customErrors.js";

export const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        console.log(errorMessages);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

// export const validateIdParam = withValidationErrors([
//   param("id").custom(async (value, { req }) => {
//     const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
//     if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
//     const job = await Job.findById(value);
//     if (!job) throw new NotFoundError(`no job with id ${value}`);
//     const isAdmin = req.user.role === "admin";
//     const isOwner = req.user.userId === job.createdBy.toString();

//     if (!isAdmin && !isOwner)
//       throw new UnauthorizedError("not authorized to access this route");
//   }),
// ]);
