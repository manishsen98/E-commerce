import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import notFoundMiddleWare from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import userAuthRouter from "./routes/userAuthRoutes.js";
import adminAuthRouter from "./routes/adminAuthRoutes.js";
import productsRouter from "./routes/productsRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import variationRouter from "./routes/variationRoutes.js";
import { authorizePermissions } from "./middleware/auth.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(cookieParser());
app.use(express.json());

///Owner ADMIN ROUTES
app.use("/category", categoryRouter);
app.use("/variation", variationRouter);

//normal ADMIN ROUTES
app.use("/products", productsRouter);
app.use("/auth/admin", adminAuthRouter);

//User Rotes or Public Routes
app.use("/auth/user", userAuthRouter);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log("Server Started on " + port + " Port");
    });
  } catch (error) {
    console.log("DataBase Error" + error);
  }
};

start();
