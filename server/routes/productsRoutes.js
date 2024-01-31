import express from "express";
import {
  addProduct,
  getProductsByCategory,
} from "../controller/productController.js";

const productsRouter = express.Router();

productsRouter.get("/:categoryName", getProductsByCategory);

//Only For Admin
productsRouter.post("/add", addProduct);

export default productsRouter;
