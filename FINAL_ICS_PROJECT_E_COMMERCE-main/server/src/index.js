// server/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

// Initialize Prisma Client
const prisma = new PrismaClient();

// If your .env is in 'server/' and index.js is in 'server/src/',
// you need to go one level up to find the .env file.
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with explicit whitelist and proper preflight handling
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.filter(Boolean).includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Ensure preflight requests are handled
app.options("*", cors());

app.use(express.json());

// Serve static files from uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve from server/uploads

// Auth routes (publicly accessible for login/register)
app.use("/api/auth", authRoutes);

// Protected routes (apply authMiddleware to these)
// This applies authMiddleware to ALL routes defined in productRoutes, orderRoutes, categoryRoutes
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", categoryRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", adminRoutes); // Changed back to /api since we'll update the routes
app.use("/api", authRoutes); // Mount user endpoints at /api/users

app.get("/", (req, res) => {
  res.send("FarmDirect Backend API is running!");
});

// Health check for Render
app.get("/healthz", (req, res) => res.send("ok"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
