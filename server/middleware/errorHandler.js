import { StatusCodes } from "http-status-codes";

export default function errorHandlerMiddleware(err, req, res, next) {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "error handler middleware",
  };
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }
  if (err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = "Email field has to be unique";
  }
  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
}
