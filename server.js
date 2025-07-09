// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import cors from "cors";

// import connectDB from "./config/db.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// // Load env variables

// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }
// // Connect to MongoDB
// connectDB();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const allowedOrigins = "https://baba-boutique-chg5.onrender.com";
// app.use(cors({
//   origin: allowedOrigins
// }));

// // API Routes
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load env variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Improved CORS setup
const allowedOrigins = [
  "https://baba-boutique-chg5.onrender.com",
  "http://localhost:3000" // For local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `CORS error: ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
  }
}));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`🚀 Server running on port ${PORT}`)
);