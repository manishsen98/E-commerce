import {
  UnAuthenticatedError,
  UnAuthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyToken } from "../utils/Token.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnAuthenticatedError("authentication invalid");
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    throw new UnAuthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  if (!token || token == "logout") {
    throw new UnAuthorizedError("You need to login now");
  }
  const admin = verifyToken(token);
  admin.password = null;
  admin.token = token;
  res.send(admin);
};
