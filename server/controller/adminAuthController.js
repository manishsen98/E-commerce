import {
  BadRequestError,
  UnAuthenticatedError,
  InternalServerError,
} from "../errors/customErrors.js";
import prisma from "../db/db.config.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { createToken } from "../utils/Token.js";

export const register = async (req, res) => {
  const { name, email, password, accessKey } = req.body;
  if (accessKey !== process.env.ADMIN_REGISTERATION_ACCESS_KEY) {
    throw new UnAuthenticatedError("Invalid accessKey");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new Admin
  await prisma.admin.create({
    data: { name, email, password: hashPassword },
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Register Successful...",
  });
};

export const login = async (req, res) => {
  const { password, email } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials Wrong Password");
  }

  const token = createToken(admin);

  //48hours in nanoSeconds
  const twoDays = 1000 * 60 * 60 * 24 * 2;
  admin.password = null;
  admin.token = token;
  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + twoDays),
      secure: false,
    })
    .status(StatusCodes.OK)
    .json({
      admin,
      msg: "Login Successful",
    });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "admin logged out!" });
};

export const updateAdmin = async (req, res) => {
  const { email, name } = req.body;

  if (!email && !name) {
    throw new BadRequestError("Atleat one feild require to update Profile");
  }

  const adminAlreadyExists = await prisma.admin.findMany({
    where: { email, NOT: { id: req.user.id } },
  });
  if (adminAlreadyExists.length > 0) {
    throw new BadRequestError("email already in use by other admin");
  }

  const updateData = {
    email: email ? email : req.user.email,
    name: name ? name : req.user.name,
    createAt: req.user.createAt,
  };
  // Find admin by adminId nad insert data to that admin Bro
  const admin = await prisma.admin.update({
    where: { id: req.user.id },
    data: updateData,
  });

  const token = createToken(admin);
  const twoDays = 1000 * 60 * 60 * 24 * 2;

  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + twoDays),
      secure: process.env.NODE_ENV === "production",
    })
    .status(StatusCodes.OK)
    .json({
      admin,
    });
};

export const deleteAdmin = async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // Find admin by email and also with token gived id jo ki anp ne middlewere se liya
  const admin = await prisma.admin.findUnique({ where: { id: req.user.id } });
  const admin2 = await prisma.admin.findUnique({ where: { email } });

  if (!admin || admin2) {
    throw new UnAuthenticatedError(
      "Invalid Credentials Email not found or Admin Not authenticate"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials Wrong Password");
  }

  const deletedAdmin = await prisma.admin.delete({ where: { email } });

  if (!deletedAdmin) {
    throw new InternalServerError("Failed to delete admin");
  } else {
    res.status(StatusCodes.OK).json({ msg: "Admin deleted successfully" });
  }
};
