import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

// ============================
// MIDDLEWARES
// ============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================
// CORS CONFIG
// ============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://netflix-clock-project.vercel.app",
  "https://netflix-clock-project-4s6v1jqdg-manish-s-projects22.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Request Origin:", origin);

      // Postman ya direct browser requests ke liye
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS Not Allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================
// DATABASE CONNECTION
// ============================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// ============================
// ROUTES
// ============================

app.use("/api/v1/user", userRoute);

// ============================
// HOME ROUTE
// ============================

app.get("/", (req, res) => {
  res.status(200).send("🚀 Netflix Backend Running");
});

// ============================
// ERROR HANDLER
// ============================

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});