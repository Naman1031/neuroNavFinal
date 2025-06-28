import express from "express";
import cors from "cors";
import dataRouter from "./routes/data.routes.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
const app = express();

dotenv.config();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/output", express.static("output"));

app.use("/api/data", dataRouter);

//user routes
app.use("/api/users", userRouter);

export { app };
