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
  "https://vercel.com/manish-s-projects22/netflix-clock-project/2g2Gt8wexW2bTcfHq6QB1UAw3x1G",
];

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow Postman / Mobile Apps
      if (!origin) {
        return callback(null, true);
      }

      // Allow frontend URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Block other origins
      return callback(new Error("CORS Not Allowed"));
    },

    credentials: true,
  })
);

// ============================
// DATABASE CONNECTION
// ============================

const connectDB = async () => {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

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
  res.send("🚀 Netflix Backend Running");
});

// ============================
// SERVER
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});