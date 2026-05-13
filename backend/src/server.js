import express from "express";

import dotenv from "dotenv";

import cors from "cors";

import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import testRoutes from "./routes/testRoutes.js";

import bookRoutes from "./routes/bookRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

dotenv.config({ path: "./.env" });

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Library Management API Running...");
});

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/books", bookRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
