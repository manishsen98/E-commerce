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
  const { name, email, password, phoneNumber } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a new user
  await prisma.user.create({
    data: { name, email, password: hashPassword, phoneNumber },
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Register Successful...",
  });
};

export const login = async (req, res) => {
  const { password, email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials Wrong Password");
  }

  const token = createToken(user);

  //24hours in nanoSeconds
  const oneDay = 1000 * 60 * 60 * 24;

  res
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    })
    .status(StatusCodes.OK)
    .json({
      user,
      msg: "Login Successful",
    });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export const updateUser = async (req, res) => {
  const { email, name, lastName, phoneNumber } = req.body;
  if (!email && !name && !lastName && !phoneNumber) {
    throw new BadRequestError("Atleat one feild require to update Profile");
  }
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email, NOT: { id: req.user.id } },
  });
  if (userAlreadyExists) {
    throw new BadRequestError("email already in use by other user");
  }

  const updateData = {
    email: email ? email : req.user.email,
    name: name ? name : req.user.name,
    lastName: lastName ? lastName : req.user.lastName,
    phoneNumber: phoneNumber ? phoneNumber : req.user.phoneNumber,
    createAt: req.user.createAt,
  };
  // Find user by userId nad insert data to that user Bro
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
  });

  const token = createToken(user);

  res.status(StatusCodes.OK).json({
    user,
    token,
  });
};

export const deleteUser = async (req, res) => {
  const { email, password } = req.query;

  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  // Find user by email and also with token gived id jo ki anp ne middlewere se liya
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const user2 = await prisma.user.findUnique({ where: { email } });

  if (!user || user2) {
    throw new UnAuthenticatedError(
      "Invalid Credentials Email not found or User Not authenticate"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials Wrong Password");
  }

  const deletedUser = await prisma.user.delete({ where: { email } });

  if (!deletedUser) {
    throw new InternalServerError("Failed to delete user");
  } else {
    res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
  }
};
