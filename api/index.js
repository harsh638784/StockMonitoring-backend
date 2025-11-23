const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
app.set("trust proxy", 1);

// ==============================
//  Models
// ==============================
const HoldingsModel = require("../Models/HoldingModel");
const OrdersModel = require("../Models/OrdersSchema");
const PositionsModel = require("../Models/PositionsSchema");

// ==============================
//  Routes
// ==============================
const authRoute = require("../Routes/AuthRoute");

// ==============================
//  Middlewares
// ==============================
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "https://stock-monitoring-frontend.vercel.app",
  credentials: true,
}));


// ==============================
//  MongoDB connection
// ==============================
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==============================
//  API Endpoints
// ==============================
app.get("/checkCookie", (req, res) => {
  console.log(req.cookies);
  res.json({ cookies: req.cookies });
});
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

app.get("/newOrders", async (req, res) => {
  try {
    const orders = await OrdersModel.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();
    res.send("Order saved successfully!");
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔹 Auth routes
app.use("/", authRoute);

// ==============================
//  Start server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

