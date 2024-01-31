import express from "express";
import {
  addVariation,
  deleteVariation,
  editVariation,
  getAllVariation,
  getSingleVariation,
} from "../controller/variationController.js";

const variationRouter = express.Router();

// FOR ADMIN ONLY
variationRouter.get("/", getAllVariation);
variationRouter.get("/:variationId", getSingleVariation);
variationRouter.put("/edit", editVariation);
variationRouter.post("/add", addVariation);
variationRouter.delete("/delete", deleteVariation);

export default variationRouter;
