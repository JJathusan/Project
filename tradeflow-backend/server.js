import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path"; // Required for cross-platform path handling
import { fileURLToPath } from "url"; // Required for ES Modules path handling

// Route Imports
import authRoutes from "./routes/auth.js"; 
import vendorRoutes from './routes/vendor.js';
import productRoutes from './routes/products.js';
import quoteRoutes from './routes/quotes.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// --- ES Modules Path Setup ---
// This ensures that the 'uploads' folder is found correctly on any computer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Essential for parsing the order data from React

// --- Static Files Folder ---
// This makes images accessible via http://localhost:5000/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use('/api/vendors', vendorRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes); // Linked to your updated order controller logic
app.use('/api/admin', adminRoutes);

// Root Health Check
app.get("/", (req, res) => {
  res.send("TradeFlow Backend Running 🚀 - Nodes Healthy");
});

// --- MongoDB Connection ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in your .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 TradeFlow Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));