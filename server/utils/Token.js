import jwt from "jsonwebtoken";
export const createToken = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRE_IN });
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
